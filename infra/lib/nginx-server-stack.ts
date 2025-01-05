import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

const enableEBSVolume = false;
const enableIpv6 = false;

export class NginxServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = enableIpv6
      ? new ec2.Vpc(this, "Ip6VpcDualStack", {
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
        })
      : new ec2.Vpc(this, "NginxServerVpc", {
          maxAzs: 2, // Default is 2 availability zones
        });

    // Security group
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

    // Allow SSH access (port 22) and HTTP access (port 80) from anywhere
    // IPV4
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access from anywhere"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP access from anywhere"
    );
    if (enableIpv6) {
      // IPV6
      securityGroup.addIngressRule(
        ec2.Peer.anyIpv6(),
        ec2.Port.tcp(22),
        "Allow SSH access from IPv6"
      );
      securityGroup.addIngressRule(
        ec2.Peer.anyIpv6(),
        ec2.Port.tcp(80),
        "Allow HTTP access from IPv6"
      );
    }

    // AMI: Amazon Linux 2 ARM-based (aarch64)
    const ami = ec2.MachineImage.latestAmazonLinux2023({
      edition: ec2.AmazonLinuxEdition.STANDARD,
      cpuType: ec2.AmazonLinuxCpuType.ARM_64,
    });

    const keyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "NginxServerKeyPair",
      "NginxServerKeyPair"
    );

    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'echo "LANG=en_US.utf-8; LC_ALL=en_US.utf-8" | sudo tee /etc/environment',
      "sudo yum update -y",
      "sudo amazon-linux-extras enable nginx1",
      "sudo yum install -y nginx",
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx",
      "wget https://github.com/DioryMe/demo-content-room/archive/refs/heads/main.zip",
      "sudo unzip main.zip",
      "sudo mkdir /usr/share/nginx/html/demo-content-room",
      // "sudo rm main.zip",
      "sudo cp -r demo-content-room-main/* /usr/share/nginx/html/demo-content-room/"
    );

    if (enableEBSVolume) {
      userData.addCommands(
        "sudo mkfs.ext4 /dev/xvdf",
        "sudo mkdir /ext-disk-data",
        "sudo mount /dev/xvdf /ext-disk-data"
      );
    }

    // EC2 instance
    const ec2Instance = new ec2.Instance(this, "NginxServerEc2Instance", {
      vpc,
      instanceType: new ec2.InstanceType("t4g.micro"),
      machineImage: ami,
      securityGroup,
      keyPair,
      blockDevices: [
        {
          deviceName: "/dev/xvda", // Root volume device
          volume: ec2.BlockDeviceVolume.ebs(8), // Minimal root volume size (8GB)
        },
      ],
      userData,
      ...(enableIpv6
        ? {
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            allowAllIpv6Outbound: true,
          }
        : {}),
    });

    // External EBS volume
    if (enableEBSVolume) {
      const ebsVolume = new ec2.CfnVolume(this, "NginxServerExternalVolume", {
        availabilityZone: ec2Instance.instanceAvailabilityZone,
        size: 2, // 2GB
        volumeType: "gp3",
      });

      // Do not delete the volume on stack destruction
      // - TODO: How to re-attach it to the new instance?
      // ebsVolume.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

      // Attach the EBS volume to the EC2 instance
      new ec2.CfnVolumeAttachment(this, "NginxServerVolumeAttachment", {
        volumeId: ebsVolume.ref, // Reference the created EBS volume
        instanceId: ec2Instance.instanceId, // Reference the EC2 instance
        device: "/dev/xvdf",
      });
    }

    // Output the EC2 instance public IP
    new cdk.CfnOutput(this, "InstancePublicIP", {
      value: ec2Instance.instancePublicIp,
      description: "The public IP of the EC2 instance",
    });
  }
}
