# Change: Refactor Infrastructure Package with Formatting and Constructs

## Why

The `infra/` package lacks code formatting tooling and uses a monolithic stack structure. Adding formatting validation and splitting into constructs will improve maintainability, testability, and code organization.

## What Changes

### Formatting & Validation
- Add ESLint with `@typescript-eslint` for TypeScript linting
- Add Prettier for consistent code formatting
- Add `lint`, `lint:fix`, and `format` scripts to package.json

### Structure Refactoring
- Split monolithic stack into composable CDK constructs:
  - `lib/constructs/whisper-asr-security.ts` - Security group construct
  - `lib/constructs/whisper-asr-instance.ts` - EC2 instance with EIP construct
- Create `lib/types.ts` for shared interfaces
- Rename `InfraStack` class to `WhisperAsrStack` for clarity

### Testing & Documentation
- Add infrastructure tests for security-critical configurations
- Update README with project-specific documentation

## Impact

- Affected specs: `infrastructure` (new spec)
- Affected code: `infra/` directory
  - `package.json` - New scripts and dependencies
  - `.eslintrc.json` - New file
  - `.prettierrc` - New file
  - `lib/constructs/` - New directory with construct files
  - `lib/types.ts` - New file
  - `lib/infra-stack.ts` - Refactored to use constructs
  - `bin/infra.ts` - Updated import
  - `test/infra.test.ts` - Replace placeholder with real tests
  - `README.md` - Updated

**Note:** CloudFormation logical IDs will be preserved to prevent resource replacement.
