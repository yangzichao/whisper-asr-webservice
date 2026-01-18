import * as cdk from 'aws-cdk-lib';

/**
 * Configuration properties for the Whisper ASR Stack
 */
export interface WhisperAsrStackProps extends cdk.StackProps {
  /**
   * Whisper model size: tiny, base, small, medium, large-v3
   * @default 'large-v3'
   */
  asrModel?: string;

  /**
   * ASR engine: openai_whisper, faster_whisper, whisperx
   * @default 'faster_whisper'
   */
  asrEngine?: string;

  /**
   * EC2 instance type
   * @default 't3.xlarge'
   */
  instanceType?: string;

  /**
   * Use GPU acceleration (requires GPU instance and quota)
   * @default false
   */
  useGpu?: boolean;

  /**
   * Allow SSH access from this CIDR
   * @default '0.0.0.0/0' (open to all - restrict in production!)
   */
  sshCidr?: string;

  /**
   * Allow API access from this CIDR
   * @default '0.0.0.0/0'
   */
  apiCidr?: string;
}

/**
 * Properties for the WhisperAsrSecurity construct
 */
export interface WhisperAsrSecurityProps {
  /**
   * The VPC to create the security group in
   */
  vpc: cdk.aws_ec2.IVpc;

  /**
   * CIDR for SSH access
   * @default '0.0.0.0/0'
   */
  sshCidr?: string;

  /**
   * CIDR for API access
   * @default '0.0.0.0/0'
   */
  apiCidr?: string;
}

/**
 * Properties for the WhisperAsrInstance construct
 */
export interface WhisperAsrInstanceProps {
  /**
   * The VPC to launch the instance in
   */
  vpc: cdk.aws_ec2.IVpc;

  /**
   * Security group for the instance
   */
  securityGroup: cdk.aws_ec2.ISecurityGroup;

  /**
   * IAM role for the instance
   */
  role: cdk.aws_iam.IRole;

  /**
   * EC2 instance type
   * @default 't3.xlarge'
   */
  instanceType?: string;

  /**
   * Use GPU acceleration
   * @default false
   */
  useGpu?: boolean;

  /**
   * ASR model name
   * @default 'large-v3'
   */
  asrModel?: string;

  /**
   * ASR engine name
   * @default 'faster_whisper'
   */
  asrEngine?: string;
}
