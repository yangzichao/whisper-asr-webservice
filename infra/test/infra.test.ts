import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { WhisperAsrStack } from '../lib/infra-stack';

describe('WhisperAsrStack', () => {
  let app: cdk.App;
  let stack: WhisperAsrStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new WhisperAsrStack(app, 'TestStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
    template = Template.fromStack(stack);
  });

  describe('Security Group', () => {
    test('allows SSH access on port 22', () => {
      template.hasResourceProperties('AWS::EC2::SecurityGroup', {
        SecurityGroupIngress: Match.arrayWith([
          Match.objectLike({
            IpProtocol: 'tcp',
            FromPort: 22,
            ToPort: 22,
          }),
        ]),
      });
    });

    test('allows API access on port 9000', () => {
      template.hasResourceProperties('AWS::EC2::SecurityGroup', {
        SecurityGroupIngress: Match.arrayWith([
          Match.objectLike({
            IpProtocol: 'tcp',
            FromPort: 9000,
            ToPort: 9000,
          }),
        ]),
      });
    });

    test('allows all outbound traffic', () => {
      template.hasResourceProperties('AWS::EC2::SecurityGroup', {
        SecurityGroupEgress: Match.arrayWith([
          Match.objectLike({
            IpProtocol: '-1',
          }),
        ]),
      });
    });
  });

  describe('IAM Role', () => {
    test('has EC2 assume role policy', () => {
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'ec2.amazonaws.com',
              },
            }),
          ]),
        },
      });
    });

    test('has SSM managed policy attached', () => {
      template.hasResourceProperties('AWS::IAM::Role', {
        ManagedPolicyArns: Match.arrayWith([
          Match.objectLike({
            'Fn::Join': Match.arrayWith([
              Match.arrayWith([Match.stringLikeRegexp('AmazonSSMManagedInstanceCore')]),
            ]),
          }),
        ]),
      });
    });
  });

  describe('EC2 Instance', () => {
    test('has encrypted EBS volume', () => {
      template.hasResourceProperties('AWS::EC2::Instance', {
        BlockDeviceMappings: Match.arrayWith([
          Match.objectLike({
            Ebs: Match.objectLike({
              Encrypted: true,
              VolumeType: 'gp3',
            }),
          }),
        ]),
      });
    });
  });

  describe('Elastic IP', () => {
    test('creates an Elastic IP', () => {
      template.resourceCountIs('AWS::EC2::EIP', 1);
    });

    test('associates EIP with instance', () => {
      template.resourceCountIs('AWS::EC2::EIPAssociation', 1);
    });
  });

  describe('Outputs', () => {
    test('exports public IP', () => {
      template.hasOutput('PublicIp', {});
    });

    test('exports API endpoint', () => {
      template.hasOutput('ApiEndpoint', {});
    });

    test('exports instance ID', () => {
      template.hasOutput('InstanceId', {});
    });
  });
});
