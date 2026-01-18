#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { WhisperAsrStack } from '../lib/infra-stack';

const app = new cdk.App();

new WhisperAsrStack(app, 'WhisperAsrStack', {
  // Use environment from CLI profile or environment variables
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },

  // Whisper ASR configuration
  asrModel: 'large-v3', // Options: tiny, base, small, medium, large-v3
  asrEngine: 'faster_whisper', // Options: openai_whisper, faster_whisper, whisperx
  instanceType: 'g4dn.xlarge', // GPU instance for CUDA acceleration
  useGpu: true, // Enable GPU support

  // Security: Restrict these in production!
  sshCidr: '0.0.0.0/0', // SSH access (consider restricting to your IP)
  apiCidr: '0.0.0.0/0', // API access

  description: 'Whisper ASR Service - Speech recognition API powered by OpenAI Whisper',
});
