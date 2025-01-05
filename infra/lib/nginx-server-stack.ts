import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class NginxServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Ip6VpcDualStack", {
      ipProtocol: ec2.IpProtocol.DUAL_STACK,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
        },
        // {
        //   name: "Private",
        //   subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        // },
      ],
    });

    // Define a security group for the EC2 instance
    const securityGroup = new ec2.SecurityGroup(
      this,
      "NginxServerSecurityGroup",
      {
        vpc,
        description: "Allow HTTP and SSH access to EC2 instance",
        allowAllOutbound: true, // Allow outbound internet access
        allowAllIpv6Outbound: true, // Allow outbound IPv6 traffic
      }
    );

    // Allow SSH access (port 22) from anywhere
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access from anywhere"
    );

    // Allow SSH access for IPv6
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(22),
      "Allow SSH access from IPv6"
    );

    // Allow HTTP access (port 80) from anywhere
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP access from anywhere"
    );

    // Allow IPv6 HTTP access (port 80)
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(80),
      "Allow HTTP access from IPv6"
    );

    // Define the Amazon Linux 2 ARM-based AMI
    const ami = ec2.MachineImage.latestAmazonLinux2({
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      cpuType: ec2.AmazonLinuxCpuType.ARM_64,
    });

    const keyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "NginxServerKeyPair",
      "NginxServerKeyPair"
    );

    // Create the EC2 instance
    const ec2Instance = new ec2.Instance(this, "NginxServerEc2Instance", {
      vpc,
      instanceType: new ec2.InstanceType("t4g.micro"),
      machineImage: ami,
      securityGroup,
      keyPair,
      // keyName: "NginxServerKeyPair",
      blockDevices: [
        {
          deviceName: "/dev/xvda", // Root volume device
          volume: ec2.BlockDeviceVolume.ebs(8), // Minimal root volume size (8GB)
        },
      ],
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      allowAllIpv6Outbound: true,
    });

    ec2Instance.connections.allowFrom(
      ec2.Peer.anyIpv6(),
      ec2.Port.allIcmpV6(),
      "allow ICMPv6"
    );

    // Add an external EBS volume of type
    const ebsVolume = new ec2.CfnVolume(this, "NginxServerColdHddVolume", {
      availabilityZone: ec2Instance.instanceAvailabilityZone,
      size: 2, // 2GB
      volumeType: "gp3",
    });

    // Do not delete the volume on stack destruction
    // ebsVolume.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    // Attach the EBS volume to the EC2 instance
    new ec2.CfnVolumeAttachment(this, "NginxServerVolumeAttachment", {
      volumeId: ebsVolume.ref, // Reference the created EBS volume
      instanceId: ec2Instance.instanceId, // Reference the EC2 instance
      device: "/dev/xvdf", // Device name (e.g., /dev/xvdf)
    });
  }
}
