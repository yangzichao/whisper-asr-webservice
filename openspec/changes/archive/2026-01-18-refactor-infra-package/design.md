## Context

The `infra/` package contains AWS CDK infrastructure for deploying the Whisper ASR service to EC2. The current implementation is a single 220-line stack file. While functional, splitting into constructs improves organization and testability.

## Goals / Non-Goals

**Goals:**
- Establish consistent code formatting with ESLint and Prettier
- Organize code into logical constructs for better separation of concerns
- Enable isolated testing of infrastructure components
- Preserve backward compatibility with existing deployments

**Non-Goals:**
- Changing deployed infrastructure behavior
- Adding new AWS resources
- Multi-environment configuration (future scope)

## Decisions

### Construct Structure

Split into two constructs based on logical grouping:

```
lib/
├── constructs/
│   ├── whisper-asr-security.ts   # SecurityGroup + ingress rules
│   └── whisper-asr-instance.ts   # EC2 Instance + UserData + EIP
├── types.ts                       # WhisperAsrStackProps interface
└── infra-stack.ts                 # Main stack (renamed class)
```

**Why this split:**
- Security group is a logical unit (network access control)
- Instance construct groups compute resources (EC2 + EIP + UserData)
- Types extracted for potential reuse and cleaner imports

**Alternative considered:** Single file with helper methods - rejected because constructs provide better test isolation.

### Preserving CloudFormation Logical IDs

When extracting constructs, the construct IDs passed to resources must match the original IDs to prevent CloudFormation resource replacement.

Example: The security group was created with ID `'WhisperAsrSg'` - this ID must be preserved in the new construct.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Logical ID changes cause resource replacement | Use `cdk diff` before deploy, preserve original IDs |
| More files to navigate | Clear naming and minimal nesting |

## Open Questions

None - scope is well-defined.
