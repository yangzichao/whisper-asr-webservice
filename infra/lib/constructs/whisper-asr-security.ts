import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { WhisperAsrSecurityProps } from '../types';

/**
 * Construct that creates security group and IAM role for Whisper ASR service
 */
export class WhisperAsrSecurity extends Construct {
  public readonly securityGroup: ec2.SecurityGroup;
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: WhisperAsrSecurityProps) {
    super(scope, id);

    const sshCidr = props.sshCidr ?? '0.0.0.0/0';
    const apiCidr = props.apiCidr ?? '0.0.0.0/0';

    // Security Group
    this.securityGroup = new ec2.SecurityGroup(this, 'Sg', {
      vpc: props.vpc,
      description: 'Security group for Whisper ASR service',
      allowAllOutbound: true,
    });

    // Allow SSH access
    this.securityGroup.addIngressRule(ec2.Peer.ipv4(sshCidr), ec2.Port.tcp(22), 'Allow SSH access');

    // Allow API access on port 9000
    this.securityGroup.addIngressRule(
      ec2.Peer.ipv4(apiCidr),
      ec2.Port.tcp(9000),
      'Allow Whisper ASR API access'
    );

    // IAM Role for EC2 instance
    this.role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')],
    });
  }
}
