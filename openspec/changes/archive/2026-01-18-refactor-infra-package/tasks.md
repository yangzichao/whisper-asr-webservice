## 1. Formatting Setup

- [x] 1.1 Install ESLint, Prettier, and TypeScript ESLint dependencies
- [x] 1.2 Create `.eslintrc.json` and `.prettierrc` configuration files
- [x] 1.3 Add `lint`, `lint:fix`, and `format` scripts to `package.json`

## 2. Construct Refactoring

- [x] 2.1 Create `lib/types.ts` with `WhisperAsrStackProps` interface
- [x] 2.2 Create `lib/constructs/whisper-asr-security.ts` - extract security group
- [x] 2.3 Create `lib/constructs/whisper-asr-instance.ts` - extract EC2 instance and EIP
- [x] 2.4 Refactor `lib/infra-stack.ts` to use constructs (preserve logical IDs)
- [x] 2.5 Rename `InfraStack` class to `WhisperAsrStack`
- [x] 2.6 Update `bin/infra.ts` to import renamed stack

## 3. Testing & Documentation

- [x] 3.1 Add tests for security group rules (SSH port 22, API port 9000)
- [x] 3.2 Add tests for IAM role with SSM policy
- [x] 3.3 Update `README.md` with project-specific documentation

## 4. Validation

- [x] 4.1 Run `npm run lint` - ensure no linting errors
- [x] 4.2 Run `npm run test` - ensure all tests pass
- [x] 4.3 Run `cdk synth` - verify stack synthesizes
