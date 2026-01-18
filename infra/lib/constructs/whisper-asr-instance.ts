import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { WhisperAsrInstanceProps } from '../types';

/**
 * Construct that creates EC2 instance with Elastic IP for Whisper ASR service
 */
export class WhisperAsrInstance extends Construct {
  public readonly instance: ec2.Instance;
  public readonly eip: ec2.CfnEIP;

  constructor(scope: Construct, id: string, props: WhisperAsrInstanceProps) {
    super(scope, id);

    const instanceType = props.instanceType ?? 't3.xlarge';
    const useGpu = props.useGpu ?? false;
    const asrModel = props.asrModel ?? 'large-v3';
    const asrEngine = props.asrEngine ?? 'faster_whisper';

    // Docker image and device settings based on GPU availability
    const dockerImage = useGpu
      ? 'onerahmet/openai-whisper-asr-webservice:latest-gpu'
      : 'onerahmet/openai-whisper-asr-webservice:latest';
    const asrDevice = useGpu ? 'cuda' : 'cpu';
    const gpuFlag = useGpu ? '--gpus all' : '';

    // User Data script to setup Docker and run Whisper ASR
    const userData = ec2.UserData.forLinux();

    const gpuSetupCommands = useGpu
      ? [
          '# Install NVIDIA Container Toolkit',
          'curl -s -L https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo | tee /etc/yum.repos.d/nvidia-container-toolkit.repo',
          'dnf install -y nvidia-container-toolkit',
          'nvidia-ctk runtime configure --runtime=docker',
          'systemctl restart docker',
        ]
      : [];

    userData.addCommands(
      '#!/bin/bash',
      'set -ex',
      '',
      '# Log start',
      'echo "Starting Whisper ASR setup..." > /home/ec2-user/setup.log',
      '',
      '# Install Docker',
      'dnf install -y docker',
      'systemctl start docker',
      'systemctl enable docker',
      '',
      '# Add ec2-user to docker group',
      'usermod -aG docker ec2-user',
      '',
      ...gpuSetupCommands,
      '# Create cache directory for models',
      'mkdir -p /home/ec2-user/whisper-cache',
      'chown ec2-user:ec2-user /home/ec2-user/whisper-cache',
      '',
      '# Pull and run Whisper ASR container',
      `echo "Pulling Whisper ASR Docker image..." >> /home/ec2-user/setup.log`,
      `docker pull ${dockerImage}`,
      '',
      `echo "Starting Whisper ASR container..." >> /home/ec2-user/setup.log`,
      `docker run -d ${gpuFlag} \\`.trim(),
      `  --name whisper-asr \\`,
      `  --restart unless-stopped \\`,
      `  -p 9000:9000 \\`,
      `  -v /home/ec2-user/whisper-cache:/root/.cache \\`,
      `  -e ASR_ENGINE=${asrEngine} \\`,
      `  -e ASR_MODEL=${asrModel} \\`,
      `  -e ASR_DEVICE=${asrDevice} \\`,
      `  ${dockerImage}`,
      '',
      '# Log completion',
      'echo "Whisper ASR setup complete at $(date)" >> /home/ec2-user/setup.log'
    );

    // Use Amazon Linux 2023 - standard for CPU, Deep Learning AMI for GPU
    const machineImage = useGpu
      ? ec2.MachineImage.genericLinux({
          'us-west-2': 'ami-0d9b641f025db5469', // Deep Learning OSS Nvidia Driver AMI
          'us-east-1': 'ami-0d9b641f025db5469',
        })
      : ec2.MachineImage.latestAmazonLinux2023();

    // EC2 Instance
    this.instance = new ec2.Instance(this, 'Instance', {
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: new ec2.InstanceType(instanceType),
      machineImage,
      securityGroup: props.securityGroup,
      role: props.role,
      userData,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(100, {
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            encrypted: true,
          }),
        },
      ],
    });

    // Allocate Elastic IP for static address
    this.eip = new ec2.CfnEIP(this, 'Eip', {
      domain: 'vpc',
    });

    new ec2.CfnEIPAssociation(this, 'EipAssoc', {
      allocationId: this.eip.attrAllocationId,
      instanceId: this.instance.instanceId,
    });
  }
}
