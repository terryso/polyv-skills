/**
 * ATDD Test Suite: Signature Generation
 * Story: 2.1 - 实现 polyv CLI 核心（签名和 API 调用）
 * TDD Phase: GREEN (tests should pass after implementation)
 *
 * Acceptance Criteria:
 * - AC1: 生成与 polyv API v4 兼容的 MD5 签名
 * - AC2: 参数按字典序排序
 * - AC3: 拼接格式：key1value1key2value2...
 * - AC4: 追加 appSecret 后计算 MD5
 * - AC5: 时间戳为毫秒级，5 分钟有效期
 */

'use strict';

const assert = require('assert');
const crypto = require('crypto');

// Import the functions we're testing
const {
  generateSignature,
  generateTimestamp,
  validateTimestamp,
  buildSignatureString,
  maskAppSecret
} = require('../../tools/clis/polyv');

describe('Signature Generation - Story 2.1', () => {

  describe('AC1: 生成与 polyv API v4 兼容的 MD5 签名', () => {

    it('[P0] should generate valid MD5 signature format', () => {
      const params = {
        appId: 'test-app-id',
        timestamp: 1709347200000,
        name: 'test-channel'
      };
      const appSecret = 'test-secret';

      const signature = generateSignature(params, appSecret);

      // Signature should be a 32-character lowercase hex string (MD5)
      assert.strictEqual(typeof signature, 'string');
      assert.strictEqual(signature.length, 32);
      assert.match(signature, /^[a-f0-9]{32}$/);
    });

    it('[P1] should generate consistent signatures for same input', () => {
      const params = {
        appId: 'test-app-id',
        timestamp: 1709347200000,
        name: 'test-channel'
      };
      const appSecret = 'test-secret';

      const signature1 = generateSignature(params, appSecret);
      const signature2 = generateSignature(params, appSecret);

      assert.strictEqual(signature1, signature2);
    });

  });

  describe('AC2: 参数按字典序排序', () => {

    it('[P0] should sort parameters alphabetically before signing', () => {
      // Unordered params
      const params1 = {
        timestamp: 1709347200000,
        appId: 'test-app-id',
        name: 'test-channel'
      };

      // Same params in different order
      const params2 = {
        name: 'test-channel',
        appId: 'test-app-id',
        timestamp: 1709347200000
      };

      const appSecret = 'test-secret';

      const signature1 = generateSignature(params1, appSecret);
      const signature2 = generateSignature(params2, appSecret);

      // Both should produce the same signature (order independent)
      assert.strictEqual(signature1, signature2);
    });

    it('[P1] should handle special characters in parameter names', () => {
      const params = {
        appId: 'test-app-id',
        timestamp: 1709347200000,
        sceneType: 'topclass',
        templateType: 'ppt'
      };
      const appSecret = 'test-secret';

      // Should not throw
      const signature = generateSignature(params, appSecret);
      assert.strictEqual(typeof signature, 'string');
    });

  });

  describe('AC3: 拼接格式 key1value1key2value2...', () => {

    it('[P0] should concatenate params in key-value format', () => {
      const params = {
        appId: 'my-app',
        name: 'channel',
        timestamp: 1234567890
      };

      // Sorted alphabetically: appId, name, timestamp
      // Expected: "appIdmy-appnamechanneltimestamp1234567890"
      const result = buildSignatureString(params);

      assert.strictEqual(result, 'appIdmy-appnamechanneltimestamp1234567890');
    });

    it('[P1] should handle empty parameter values', () => {
      const params = {
        appId: 'test-app',
        name: '',
        timestamp: 1234567890
      };

      // Should include empty string after name
      const result = buildSignatureString(params);

      assert.strictEqual(result, 'appIdtest-appnametimestamp1234567890');
    });

  });

  describe('AC4: 追加 appSecret 后计算 MD5', () => {

    it('[P0] should append appSecret before MD5 hashing', () => {
      const params = {
        appId: 'test-app',
        timestamp: 1234567890
      };
      const appSecret = 'my-secret';

      // Manual calculation for verification:
      // Sorted params: "appIdtest-apptimestamp1234567890"
      // With secret: "appIdtest-apptimestamp1234567890my-secret"
      const expectedInput = 'appIdtest-apptimestamp1234567890my-secret';
      const expectedHash = crypto.createHash('md5').update(expectedInput).digest('hex');

      const signature = generateSignature(params, appSecret);

      assert.strictEqual(signature, expectedHash);
    });

    it('[P1] should use MD5 algorithm specifically', () => {
      const params = { appId: 'a', timestamp: 1 };
      const appSecret = 's';

      const signature = generateSignature(params, appSecret);

      // Verify it's a valid MD5 hash (32 hex chars)
      assert.match(signature, /^[a-f0-9]{32}$/);

      // Verify it matches our expected MD5
      const expectedInput = 'appIdatimestamp1s';
      const expectedHash = crypto.createHash('md5').update(expectedInput).digest('hex');
      assert.strictEqual(signature, expectedHash);
    });

  });

  describe('AC5: 时间戳为毫秒级，5 分钟有效期', () => {

    it('[P0] should generate millisecond timestamp', () => {
      const timestamp = generateTimestamp();

      // Should be a number
      assert.strictEqual(typeof timestamp, 'number');

      // Should be milliseconds (13 digits for current era)
      const now = Date.now();
      assert.ok(timestamp > 1700000000000, 'Timestamp should be in milliseconds');
      assert.ok(timestamp <= now + 1000, 'Timestamp should be close to current time');
    });

    it('[P1] should validate timestamp within 5 minute window', () => {
      const now = Date.now();

      // Valid: current time
      assert.strictEqual(validateTimestamp(now), true);

      // Valid: 4 minutes ago
      assert.strictEqual(validateTimestamp(now - 4 * 60 * 1000), true);

      // Valid: 4 minutes in future (clock skew tolerance)
      assert.strictEqual(validateTimestamp(now + 4 * 60 * 1000), true);

      // Invalid: 6 minutes ago
      assert.strictEqual(validateTimestamp(now - 6 * 60 * 1000), false);

      // Invalid: 6 minutes in future
      assert.strictEqual(validateTimestamp(now + 6 * 60 * 1000), false);
    });

    it('[P2] should reject non-millisecond timestamps', () => {
      // Second-based timestamp (10 digits) - should be rejected
      const secondTimestamp = Math.floor(Date.now() / 1000);
      assert.strictEqual(validateTimestamp(secondTimestamp), false);
    });

  });

  describe('Security: appSecret 不在日志中明文显示 (NFR1)', () => {

    it('[P0] should mask appSecret in debug output', () => {
      const secret = 'abcdefghijklmnopqrstuvwxyz';
      const masked = maskAppSecret(secret);

      // Should show format: "ab****yz"
      assert.strictEqual(masked, 'ab****yz');
      assert.ok(!masked.includes('cdefghijklmnopqrstuvwx'));
    });

    it('[P1] should handle short secrets', () => {
      // Short secret should still be partially masked
      const shortSecret = 'abc';
      const masked = maskAppSecret(shortSecret);

      assert.ok(masked.includes('*'));
      assert.ok(!masked.includes('abc') || masked === 'a*c');
    });

  });

});
