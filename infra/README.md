# Whisper ASR Infrastructure

AWS CDK infrastructure for deploying Whisper ASR service on EC2.

## Architecture

```
lib/
├── constructs/
│   ├── whisper-asr-security.ts   # Security group + IAM role
│   └── whisper-asr-instance.ts   # EC2 instance + Elastic IP
├── types.ts                       # Shared interfaces
└── infra-stack.ts                 # Main stack
```

## Prerequisites

- Node.js 18+
- AWS CLI configured with credentials
- AWS CDK CLI (`npm install -g aws-cdk`)

## Configuration

Edit `bin/infra.ts` to customize:

| Property | Description | Default |
|----------|-------------|---------|
| `asrModel` | Whisper model size | `large-v3` |
| `asrEngine` | ASR engine | `faster_whisper` |
| `instanceType` | EC2 instance type | `t3.xlarge` |
| `useGpu` | Enable GPU support | `false` |
| `sshCidr` | CIDR for SSH access | `0.0.0.0/0` |
| `apiCidr` | CIDR for API access | `0.0.0.0/0` |

## Commands

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm run test

# Synthesize CloudFormation template
npx cdk synth

# Deploy to AWS
npx cdk deploy

# Compare with deployed stack
npx cdk diff

# Destroy stack
npx cdk destroy
```

## Security Notes

- **Restrict CIDR ranges** in production - default `0.0.0.0/0` is open to all
- EC2 instance has SSM access for secure shell without SSH keys
- EBS volumes are encrypted by default
