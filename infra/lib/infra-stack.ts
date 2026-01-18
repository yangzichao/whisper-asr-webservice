import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { WhisperAsrStackProps } from './types';
import { WhisperAsrSecurity } from './constructs/whisper-asr-security';
import { WhisperAsrInstance } from './constructs/whisper-asr-instance';

export { WhisperAsrStackProps } from './types';

/**
 * CDK Stack for deploying Whisper ASR service on EC2
 */
export class WhisperAsrStack extends cdk.Stack {
  public readonly instance: ec2.Instance;
  public readonly publicIp: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: WhisperAsrStackProps) {
    super(scope, id, props);

    // Use default VPC for simplicity
    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true,
    });

    // Create security group and IAM role
    const security = new WhisperAsrSecurity(this, 'Security', {
      vpc,
      sshCidr: props?.sshCidr,
      apiCidr: props?.apiCidr,
    });

    // Create EC2 instance with Elastic IP
    const compute = new WhisperAsrInstance(this, 'Compute', {
      vpc,
      securityGroup: security.securityGroup,
      role: security.role,
      instanceType: props?.instanceType,
      useGpu: props?.useGpu,
      asrModel: props?.asrModel,
      asrEngine: props?.asrEngine,
    });

    this.instance = compute.instance;

    // Outputs
    this.publicIp = new cdk.CfnOutput(this, 'PublicIp', {
      value: compute.eip.attrPublicIp,
      description: 'Public IP address of Whisper ASR instance',
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `http://${compute.eip.attrPublicIp}:9000`,
      description: 'Whisper ASR API endpoint',
    });

    new cdk.CfnOutput(this, 'ApiDocs', {
      value: `http://${compute.eip.attrPublicIp}:9000/docs`,
      description: 'Whisper ASR API documentation (Swagger UI)',
    });

    new cdk.CfnOutput(this, 'SshCommand', {
      value: `ssh -i <your-key.pem> ec2-user@${compute.eip.attrPublicIp}`,
      description: 'SSH command to connect to instance',
    });

    new cdk.CfnOutput(this, 'InstanceId', {
      value: this.instance.instanceId,
      description: 'EC2 Instance ID',
    });

    // Tags
    cdk.Tags.of(this).add('Project', 'whisper-asr');
    cdk.Tags.of(this).add('Environment', 'production');
  }
}
