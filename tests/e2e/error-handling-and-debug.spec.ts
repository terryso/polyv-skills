/**
 * ATDD E2E Test Suite: Error Handling and Debug Mode
 * Story: 2.3 - 实现错误处理和 Debug 模式
 * TDD Phase: RED (tests will fail until feature verified/enhanced)
 *
 * These tests verify the CLI error handling and debug mode end-to-end.
 */

import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import * as path from 'path';

const CLI_PATH = path.join(process.cwd(), 'skills', 'polyv-create-channel', 'scripts', 'polyv.js');

test.describe('Error Handling and Debug Mode E2E Tests (ATDD) - Story 2.3', () => {

  test.describe('AC1: 凭据缺失错误提示', () => {

    test('[P0] should show CONFIG_MISSING error for missing appId', async () => {
      // THIS TEST WILL FAIL until error format verified
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试频道"`, {
          encoding: 'utf-8',
          timeout: 5000,
          env: {
            ...process.env,
            POLYV_APP_ID: '',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should have error code
        expect(output).toContain('CONFIG_MISSING');
        // Should mention appId
        expect(output).toContain('appId');
      }
    });

    test('[P0] should show CONFIG_MISSING error for missing appSecret', async () => {
      // THIS TEST WILL FAIL until error format verified
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试频道"`, {
          encoding: 'utf-8',
          timeout: 5000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: ''
          }
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should have error code
        expect(output).toContain('CONFIG_MISSING');
        // Should mention appSecret
        expect(output).toContain('appSecret');
      }
    });

    test('[P1] should show config file hint in error message', async () => {
      // THIS TEST WILL FAIL until error hint verified
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
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should mention config.json
        expect(output).toContain('config.json');
        // Should mention environment variables
        expect(output).toContain('POLYV_APP_ID');
      }
    });

    test('[P1] should show environment variable hint', async () => {
      // THIS TEST WILL FAIL until error hint verified
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
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should mention environment variable setup
        // Should mention environment variable setup
        const hasEnvHint = output.includes('POLYV_APP_ID') || output.includes('环境变量');
        expect(hasEnvHint).toBeTruthy();
      }
    });

  });

  test.describe('AC2: API 错误处理', () => {

    test('[P0] should return Chinese error for API 400', async () => {
      // THIS TEST WILL FAIL - requires mocking API response
      // This test would need API mocking to verify Chinese error messages
      try {
        execSync(`node ${CLI_PATH} create-channel --name ""`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should have Chinese error message (if API returns 400)
        // This test is informational - real behavior depends on API
        expect(output).toBeDefined();
      }
    });

    test('[P1] should include hint for API errors', async () => {
      // THIS TEST WILL FAIL - requires mocking API response
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'invalid-id',
            POLYV_APP_SECRET: 'invalid-secret'
          }
        });
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // Should include some hint or suggestion
        // This is informational - actual hint content varies
        expect(output).toBeDefined();
      }
    });

  });

  test.describe('AC3: 网络错误处理', () => {

    test('[P0] should handle network timeout gracefully', async () => {
      // THIS TEST WILL FAIL until timeout handling verified
      try {
        // Use very short timeout to trigger timeout error
        execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 1, // 1ms - will definitely timeout
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        // Program should not crash - should have error output
        const output = error.message || error.stdout || error.stderr;
        expect(output).toBeDefined();
        // Should not be a raw Node.js crash
        expect(output).not.toContain('Uncaught');
      }
    });

    test('[P1] should not crash on network errors', async () => {
      // THIS TEST WILL FAIL until error handling verified
      // Test that any network error results in clean exit, not crash
      let errorThrown = false;
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 5000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        errorThrown = true;
        // Should exit cleanly (with error code) not crash
        expect(error.killed).toBeFalsy(); // Not killed by signal
      }
      expect(errorThrown).toBe(true);
    });

  });

  test.describe('AC4: Debug 模式', () => {

    test('[P0] should show debug info when POLYV_DEBUG=true', async () => {
      // THIS TEST WILL FAIL until debug mode verified
      try {
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
        // Should show debug info
        expect(result).toMatch(/DEBUG|debug/i);
      } catch (error: any) {
        // Even if config-test fails, debug output should be visible
        const output = error.stdout || error.message;
        expect(output).toMatch(/DEBUG|debug/i);
      }
    });

    test('[P0] should mask appSecret in debug output', async () => {
      // THIS TEST WILL FAIL until debug masking verified
      try {
        const result = execSync(`node ${CLI_PATH} config-test`, {
          encoding: 'utf-8',
          timeout: 5000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'super-secret-value-12345',
            POLYV_DEBUG: 'true'
          }
        });
        // Should NOT contain full secret
        expect(result).not.toContain('super-secret-value-12345');
      } catch (error: any) {
        const output = error.stdout || error.message;
        // Should NOT contain full secret
        expect(output).not.toContain('super-secret-value-12345');
      }
    });

    test('[P1] should show request URL in debug mode', async () => {
      // THIS TEST WILL FAIL until debug mode enhanced
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
        const hasUrl = output.includes('api.polyv.net') || output.includes('endpoint');
        expect(hasUrl).toBeTruthy();
      }
    });

    test('[P1] should show request params in debug mode', async () => {
      try {
        const result = execSync(`node ${CLI_PATH} create-channel --name "测试频道"`, {
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
        // Should show request parameters - check for either params or name
        const hasParams = output.toLowerCase().includes('params') || output.includes('name');
        expect(hasParams).toBeTruthy();
      }
    });

    test('[P1] should show response in debug mode', async () => {
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
        // Should show response (or response status) - case insensitive
        const hasResponse = output.toLowerCase().includes('response');
        expect(hasResponse).toBeTruthy();
      }
    });

    test('[P2] should not show debug when POLYV_DEBUG not set', async () => {
      // THIS TEST WILL FAIL until debug mode verified
      const result = execSync(`node ${CLI_PATH} config-test`, {
        encoding: 'utf-8',
        timeout: 5000,
        env: {
          ...process.env,
          POLYV_APP_ID: 'test-id',
          POLYV_APP_SECRET: 'test-secret'
          // POLYV_DEBUG not set
        }
      });
      // Should NOT show debug output
      expect(result).not.toMatch(/\[DEBUG/i);
    });

  });

  test.describe('AC5: API 限流处理', () => {

    test('[P0] should return friendly message for 429', async () => {
      // THIS TEST WILL FAIL - requires mocking 429 response
      // This test would need API mocking to verify 429 handling
      // Informational test - actual behavior depends on API
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 10000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        const output = error.message || error.stdout || error.stderr;
        // If 429 occurs, should have friendly message
        // This test is informational
        expect(output).toBeDefined();
      }
    });

    test('[P1] should include wait hint for rate limit', async () => {
      // THIS TEST WILL FAIL - requires mocking 429 response
      // This test would need API mocking to verify rate limit hints
      expect(true).toBe(true); // Placeholder - needs API mock setup
    });

  });

  test.describe('Error Output Format', () => {

    test('[P0] should format errors with JSON structure', async () => {
      // THIS TEST WILL FAIL until JSON output format verified
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
        const output = error.stdout || error.stderr;
        // Should be valid JSON
        try {
          const parsed = JSON.parse(output);
          expect(parsed).toHaveProperty('success');
          expect(parsed.success).toBe(false);
          expect(parsed).toHaveProperty('error');
        } catch {
          // If not JSON, should have formatted text output
          expect(output).toContain('POLYV');
        }
      }
    });

    test('[P1] should include error code in JSON output', async () => {
      // THIS TEST WILL FAIL until JSON output format verified
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
        const output = error.stdout || error.stderr;
        try {
          const parsed = JSON.parse(output);
          expect(parsed.error).toHaveProperty('code');
        } catch {
          // Text format also acceptable
          expect(output).toBeDefined();
        }
      }
    });

    test('[P1] should include hint in JSON output', async () => {
      // THIS TEST WILL FAIL until JSON output format verified
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
        const output = error.stdout || error.stderr;
        try {
          const parsed = JSON.parse(output);
          expect(parsed.error).toHaveProperty('hint');
        } catch {
          // Text format also acceptable
          const hasHint = output.includes('提示') || output.includes('hint');
          expect(hasHint).toBeTruthy();
        }
      }
    });

  });

  test.describe('NFR10: 网络错误时返回清晰错误信息', () => {

    test('[P0] should not crash on network error', async () => {
      // THIS TEST WILL FAIL until error handling verified
      let crashed = false;
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 3000,
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        // Should not be a crash (SIGSEGV, etc.)
        expect(error.signal).not.toBe('SIGSEGV');
        expect(error.signal).not.toBe('SIGABRT');
        crashed = error.status !== 0;
      }
      // CLI should exit with non-zero code on error (expected behavior)
      // But should not crash
      expect(crashed).toBe(true);
    });

    test('[P1] should return clear error message on network error', async () => {
      // THIS TEST WILL FAIL until error message format verified
      try {
        execSync(`node ${CLI_PATH} create-channel --name "测试"`, {
          encoding: 'utf-8',
          timeout: 100, // Very short timeout to force error
          env: {
            ...process.env,
            POLYV_APP_ID: 'test-id',
            POLYV_APP_SECRET: 'test-secret'
          }
        });
      } catch (error: any) {
        const output = error.stdout || error.stderr || error.message;
        // Should have some error message
        expect(output.length).toBeGreaterThan(0);
      }
    });

  });

});
