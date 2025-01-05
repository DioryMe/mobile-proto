import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class NginxServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC with a single public subnet
    const vpc = new ec2.Vpc(this, "NginxServerVpc", {
      maxAzs: 2, // Default is 2 availability zones
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"), // IPv4 CIDR
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "PublicSubnet",
          subnetType: ec2.SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
        },
      ],
      // Enable IPv6 in the VPC
      natGateways: 0,
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
    });

    // Add a static IPv6 address to the EC2 instance (=eip, Elastic IP)
    const ipv6Address = new ec2.CfnEIP(this, "NginxServerIPv6Address", {
      domain: "vpc",
    });

    // Do not remove IP address on stack destruction
    // ipv6Address.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    // Associate the IPv6 address with the network interface (=eip, Elastic IP)
    new ec2.CfnEIPAssociation(this, "Ec2Association", {
      allocationId: ipv6Address.attrAllocationId,
      // allocationId: "NginxServerIPv6Address",
      instanceId: ec2Instance.instanceId,
    });

    // Add an external EBS volume of type
    const ebsVolume = new ec2.CfnVolume(this, "NginxServerColdHddVolume", {
      availabilityZone: ec2Instance.instanceAvailabilityZone,
      size: 2, // 2GB
      volumeType: "gp3",
    });

    // Do not delete the volume on stack destruction
    // ebsVolume.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    // Output the EC2 instance public IP and IPv6 address
    new cdk.CfnOutput(this, "InstancePublicIP", {
      value: ec2Instance.instancePublicIp,
      description: "The public IP of the EC2 instance",
    });

    new cdk.CfnOutput(this, "InstanceIPv6Address", {
      value: ipv6Address.ref,
      description: "The static IPv6 address of the EC2 instance",
    });
  }
}
