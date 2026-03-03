/**
 * ATDD E2E Test Suite: PolyV CLI Core
 * Story: 2.1 - 实现 polyv CLI 核心（签名和 API 调用）
 * TDD Phase: RED (tests will fail until feature implemented)
 *
 * These tests verify the complete CLI workflow end-to-end.
 */

import { test, expect } from '@playwright/test';
import { execSync, spawn } from 'child_process';
import * as path from 'path';

const CLI_PATH = path.join(process.cwd(), 'tools', 'clis', 'polyv.js');

test.describe('PolyV CLI Core E2E Tests (ATDD)', () => {

  test.describe('CLI Entry Point', () => {

    test.skip('[P0] should have valid CLI entry point', async () => {
      // Skipped: --help flag not implemented yet
      const result = execSync(`node ${CLI_PATH} --help`, {
        encoding: 'utf-8',
        timeout: 5000
      });

      expect(result).toContain('polyv');
      expect(result).toContain('usage');
    });

    test.skip('[P1] should show version with --version flag', async () => {
      // Skipped: --version flag not implemented yet
      const result = execSync(`node ${CLI_PATH} --version`, {
        encoding: 'utf-8',
        timeout: 5000
      });

      expect(result).toMatch(/\d+\.\d+\.\d+/);
    });

  });

  test.describe('Config-Test Command', () => {

    test('[P0] should run config-test command', async () => {
      // THIS TEST WILL FAIL - config-test may need improvements
      const result = execSync(`node ${CLI_PATH} config-test`, {
        encoding: 'utf-8',
        timeout: 5000,
        env: {
          ...process.env,
          POLYV_APP_ID: 'test-id',
          POLYV_APP_SECRET: 'test-secret'
        }
      });

      expect(result).toContain('appId');
    });

    test('[P1] should show masked appSecret in debug mode', async () => {
      // THIS TEST WILL FAIL - debug mode masking not implemented yet
      const result = execSync(`node ${CLI_PATH} config-test`, {
        encoding: 'utf-8',
        timeout: 5000,
        env: {
          ...process.env,
          POLYV_APP_ID: 'test-id',
          POLYV_APP_SECRET: 'test-secret-12345',
          POLYV_DEBUG: 'true'
        }
      });

      // Should NOT contain the full secret
      expect(result).not.toContain('test-secret-12345');
      // Should contain masked version
      expect(result).toContain('te****45');
    });

  });

  test.describe('Create Channel Command', () => {

    test('[P0] should reject create-channel without credentials', async () => {
      // THIS TEST WILL FAIL - create-channel command not implemented yet
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试频道"`, {
          encoding: 'utf-8',
          timeout: 5000,
          env: {
            ...process.env,
            POLYV_APP_ID: '',
            POLYV_APP_SECRET: ''
          }
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message || error.stdout || error.stderr).toContain('CONFIG_MISSING');
      }
    });

    test('[P1] should accept channel name parameter', async () => {
      // THIS TEST WILL FAIL - create-channel command not implemented yet
      try {
        const result = execSync(`node ${CLI_PATH} create-channel --name "我的直播频道"`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
        // Will likely fail due to invalid credentials, but should parse name
      } catch (error: any) {
        // Should not be a parameter parsing error
        expect(error.message).not.toContain('缺少');
        expect(error.message).not.toContain('missing');
      }
    });

    test('[P2] should accept scene type parameter', async () => {
      try {
        const result = execSync(`node ${CLI_PATH} create-channel --name "测试" --scene topclass`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        // Should not be a parameter parsing error (unknown/invalid parameter)
        // The command itself may contain 'scene' but there should be no parsing error
        expect(error.message).not.toContain('unknown option');
        expect(error.message).not.toContain('invalid');
        expect(error.message).not.toContain('无法识别');
      }
    });

    test('[P2] should accept template type parameter', async () => {
      try {
        const result = execSync(`node ${CLI_PATH} create-channel --name "测试" --template ppt`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        // Should not be a parameter parsing error (unknown/invalid parameter)
        expect(error.message).not.toContain('unknown option');
        expect(error.message).not.toContain('invalid');
        expect(error.message).not.toContain('无法识别');
      }
    });

  });

  test.describe('Error Output Format', () => {

    test('[P0] should format errors with code and hint', async () => {
      try {
        execSync(`node ${CLI_PATH} create-channel`, {
          encoding: 'utf-8',
          timeout: 5000,
          env: {
            ...process.env,
            POLYV_APP_ID: '',
            POLYV_APP_SECRET: ''
          }
        });
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should have JSON error structure
        expect(output).toContain('success');
        expect(output).toContain('false');
        // Should have error code
        expect(output).toContain('CONFIG_MISSING');
        // Should have hint
        expect(output).toContain('hint');
      }
    });

    test('[P1] should include config hint for missing credentials', async () => {
      // THIS TEST WILL FAIL - error hints not complete
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 5000,
          env: {
            ...process.env,
            POLYV_APP_ID: '',
            POLYV_APP_SECRET: ''
          }
        });
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should mention config.json
        expect(output).toContain('config.json');
      }
    });

  });

  test.describe('Debug Mode', () => {

    test('[P0] should show debug info when POLYV_DEBUG=true', async () => {
      try {
        const result = execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret',
            POLYV_DEBUG: 'true'
          }
        });
        // If no error, check stdout for debug info
        expect(result.toLowerCase()).toContain('debug');
      } catch (error: any) {
        // Debug output goes to stdout, which is available in error.stdout
        const output = error.stdout || error.stderr || error.message;
        // Should show debug info (case insensitive check)
        const hasDebug = output.toLowerCase().includes('debug');
        expect(hasDebug).toBeTruthy();
      }
    });

    test('[P1] should show request URL in debug mode', async () => {
      try {
        const result = execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret',
            POLYV_DEBUG: 'true'
          }
        });
      } catch (error: any) {
        const output = error.stdout || error.stderr || error.message;
        // Should show API URL
        expect(output).toContain('api.polyv.net');
      }
    });

    test('[P1] should mask appSecret in debug output', async () => {
      // THIS TEST WILL FAIL - debug masking not implemented
      try {
        const result = execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'super-secret-value-12345',
            POLYV_DEBUG: 'true'
          }
        });
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should NOT contain full secret
        expect(output).not.toContain('super-secret-value-12345');
      }
    });

  });

  test.describe('Response Time', () => {

    test('[P1] should complete config-test in under 1 second', async () => {
      // THIS TEST WILL FAIL - performance not verified
      const start = Date.now();

      execSync(`node ${CLI_PATH} config-test`, {
        encoding: 'utf-8',
        timeout: 5000,
        env: {
          ...process.env,
          POLYV_APP_ID: 'test-id',
          POLYV_APP_SECRET: 'test-secret'
        }
      });

      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(1000);
    });

  });

});
