# infrastructure Specification

## Purpose
TBD - created by archiving change refactor-infra-package. Update Purpose after archive.
## Requirements
### Requirement: Code Formatting Standards

The infrastructure package SHALL enforce consistent code formatting through automated tooling.

#### Scenario: ESLint validation passes

- **WHEN** running `npm run lint` in the infra directory
- **THEN** all TypeScript files pass ESLint validation with zero errors

#### Scenario: Prettier formatting is applied

- **WHEN** running `npm run format` in the infra directory
- **THEN** all TypeScript files are formatted according to Prettier rules

### Requirement: Construct-Based Architecture

The infrastructure package SHALL organize CDK resources into composable constructs.

#### Scenario: Security group is encapsulated

- **WHEN** examining the infrastructure code
- **THEN** security group configuration exists in a dedicated construct file at `lib/constructs/whisper-asr-security.ts`

#### Scenario: EC2 instance is encapsulated

- **WHEN** examining the infrastructure code
- **THEN** EC2 instance and EIP configuration exists in a dedicated construct file at `lib/constructs/whisper-asr-instance.ts`

#### Scenario: Main stack composes constructs

- **WHEN** examining `lib/infra-stack.ts`
- **THEN** it instantiates the security and instance constructs rather than defining resources inline

### Requirement: Infrastructure Test Coverage

The infrastructure package SHALL have automated tests that validate security-critical configurations.

#### Scenario: Security group rules are validated

- **WHEN** running `npm run test` in the infra directory
- **THEN** tests verify that SSH (port 22) and API (port 9000) ingress rules are configured

#### Scenario: IAM role configuration is validated

- **WHEN** running `npm run test` in the infra directory
- **THEN** tests verify that the EC2 role has the AmazonSSMManagedInstanceCore policy attached

### Requirement: Backward Compatible Refactoring

The infrastructure refactoring SHALL NOT cause CloudFormation resource replacement.

#### Scenario: No infrastructure drift after refactor

- **WHEN** running `cdk diff` against an existing deployment after the refactor
- **THEN** the diff shows no resource additions, modifications, or deletions

