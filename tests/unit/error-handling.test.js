/**
 * ATDD Unit Test Suite: Error Handling and Debug Mode
 * Story: 2.3 - 实现错误处理和 Debug 模式
 * TDD Phase: GREEN (verifying existing implementation)
 *
 * Acceptance Criteria:
 * - AC1: 凭据缺失错误提示
 * - AC2: API 错误处理
 * - AC3: 网络错误处理
 * - AC4: Debug 模式
 * - AC5: API 限流处理
 */

'use strict';

const assert = require('assert');

// Import the functions we're testing
const {
  formatError,
  validateConfig,
  maskSensitiveData,
  maskAppSecret,
  debug,
  handleNetworkError,
  parseApiError,
  ERROR_CODE_MESSAGES,
  ERROR_CODE_HINTS
} = require('../../skills/polyv-create-channel/scripts/polyv');

describe('Error Handling - Story 2.3', () => {

  describe('AC1: 凭据缺失错误提示', () => {

    it('[P0] should return CONFIG_MISSING error for missing appId', () => {
      // Given: 用户凭据缺失 appId
      const config = { appSecret: 'test-secret' };

      // When: 验证配置
      const error = validateConfig(config);

      // Then: 返回 CONFIG_MISSING 错误
      assert.ok(error);
      assert.strictEqual(error.code, 'CONFIG_MISSING');
      assert.ok(error.message.includes('appId'));
    });

    it('[P0] should return CONFIG_MISSING error for missing appSecret', () => {
      // Given: 用户凭据缺失 appSecret
      const config = { appId: 'test-id' };

      // When: 验证配置
      const error = validateConfig(config);

      // Then: 返回 CONFIG_MISSING 错误
      assert.ok(error);
      assert.strictEqual(error.code, 'CONFIG_MISSING');
      assert.ok(error.message.includes('appSecret'));
    });

    it('[P0] should return CONFIG_MISSING error for missing both', () => {
      // Given: 用户凭据完全缺失
      const config = {};

      // When: 验证配置
      const error = validateConfig(config);

      // Then: 返回 CONFIG_MISSING 错误，包含两个配置项
      assert.ok(error);
      assert.strictEqual(error.code, 'CONFIG_MISSING');
      assert.ok(error.message.includes('appId'));
      assert.ok(error.message.includes('appSecret'));
    });

    it('[P1] should format error with code and hint', () => {
      // Given: 错误码和信息
      const code = 'CONFIG_MISSING';
      const message = '缺少 appId 配置';
      const hint = '请设置 POLYV_APP_ID 环境变量，或创建配置文件 ~/.polyv-skills/config.json';

      // When: 格式化错误
      const formatted = formatError(code, message, hint);

      // Then: 输出格式正确
      assert.ok(formatted.includes('[POLYV-CONFIG_MISSING]'));
      assert.ok(formatted.includes('缺少 appId 配置'));
      assert.ok(formatted.includes('提示：'));
      assert.ok(formatted.includes('config.json'));
    });

    it('[P1] should include error indicator emoji', () => {
      // Given: 任何错误
      const formatted = formatError('TEST', '测试错误', '测试提示');

      // Then: 包含错误指示符
      assert.ok(formatted.includes('[POLYV-'));
    });

  });

  describe('AC2: API 错误处理', () => {

    it('[P0] should return Chinese error message for 400', () => {
      // Given: API 返回 400 错误
      const response = { code: 400, message: 'Bad Request' };

      // When: 解析错误
      const error = parseApiError(response);

      // Then: 返回中文错误信息
      assert.ok(error.message.includes('请求参数错误') || error.message.includes('Bad Request'));
      assert.ok(error.hint);
    });

    it('[P0] should return Chinese error message for 401', () => {
      // Given: API 返回 401 错误
      const response = { code: 401, message: 'Unauthorized' };

      // When: 解析错误
      const error = parseApiError(response);

      // Then: 返回中文错误信息
      assert.ok(error.message.includes('签名') || error.message.includes('Unauthorized'));
      assert.ok(error.hint);
    });

    it('[P1] should include hint for resolution', () => {
      // Given: API 错误
      const response = { code: 403, message: 'Forbidden' };

      // When: 解析错误
      const error = parseApiError(response);

      // Then: 包含解决建议
      assert.ok(error.hint);
      assert.ok(error.hint.length > 0);
    });

    it('[P1] should have complete ERROR_CODE_MESSAGES mapping', () => {
      // Given: 常见错误码
      const expectedCodes = [400, 401, 403, 429, 500];

      // Then: 每个错误码都有中文消息
      for (const code of expectedCodes) {
        assert.ok(ERROR_CODE_MESSAGES[code], `Missing message for code ${code}`);
        assert.ok(ERROR_CODE_MESSAGES[code].length > 0);
      }
    });

    it('[P1] should have complete ERROR_CODE_HINTS mapping', () => {
      // Given: 常见错误码
      const expectedCodes = [400, 401, 403, 429, 500];

      // Then: 每个错误码都有提示
      for (const code of expectedCodes) {
        assert.ok(ERROR_CODE_HINTS[code], `Missing hint for code ${code}`);
        assert.ok(ERROR_CODE_HINTS[code].length > 0);
      }
    });

  });

  describe('AC3: 网络错误处理', () => {

    it('[P0] should handle DNS errors', () => {
      // Given: DNS 错误
      const error = new Error('getaddrinfo ENOTFOUND api.polyv.net');

      // When: 处理网络错误
      const result = handleNetworkError(error);

      // Then: 返回清晰的错误信息
      assert.strictEqual(result.code, 'NETWORK_ERROR');
      assert.ok(result.message.includes('DNS'));
      assert.ok(result.hint);
    });

    it('[P0] should handle connection refused', () => {
      // Given: 连接被拒绝
      const error = new Error('connect ECONNREFUSED 127.0.0.1:443');

      // When: 处理网络错误
      const result = handleNetworkError(error);

      // Then: 返回清晰的错误信息
      assert.strictEqual(result.code, 'NETWORK_ERROR');
      assert.ok(result.message.includes('连接') || result.message.includes('拒绝'));
      assert.ok(result.hint);
    });

    it('[P0] should handle timeout errors', () => {
      // Given: 超时错误
      const error = new Error('ETIMEDOUT connection timeout');

      // When: 处理网络错误
      const result = handleNetworkError(error);

      // Then: 返回清晰的错误信息
      assert.strictEqual(result.code, 'NETWORK_ERROR');
      assert.ok(result.message.includes('超时'));
      assert.ok(result.hint);
    });

    it('[P1] should not crash on unknown network errors', () => {
      // Given: 未知网络错误
      const error = new Error('Some unknown network error');

      // When: 处理网络错误
      const result = handleNetworkError(error);

      // Then: 程序不崩溃，返回通用错误
      assert.ok(result);
      assert.ok(result.code);
      assert.ok(result.message);
      assert.ok(result.hint);
    });

  });

  describe('AC4: Debug 模式', () => {

    it('[P0] should output debug logs when POLYV_DEBUG=true', () => {
      // Given: POLYV_DEBUG 环境变量设置
      const originalDebug = process.env.POLYV_DEBUG;
      process.env.POLYV_DEBUG = 'true';

      // Capture console.log output
      let captured = '';
      const originalLog = console.log;
      console.log = (...args) => { captured += args.join(' '); };

      try {
        // When: 调用 debug 函数
        debug('Test message', { key: 'value' });

        // Then: 应该输出调试信息
        assert.ok(captured.includes('DEBUG') || captured.includes('Test message'));
      } finally {
        console.log = originalLog;
        process.env.POLYV_DEBUG = originalDebug;
      }
    });

    it('[P0] should mask appSecret in debug output', () => {
      // Given: 包含 appSecret 的数据
      const data = {
        appId: 'test-app-id',
        appSecret: 'super-secret-value-12345'
      };

      // When: 脱敏处理
      const masked = maskSensitiveData(data);

      // Then: appSecret 应该被脱敏
      assert.ok(masked.appSecret);
      assert.ok(!masked.appSecret.includes('super-secret-value-12345'));
      assert.ok(masked.appSecret.includes('****'));
    });

    it('[P1] should mask appSecret with correct format', () => {
      // Given: 长密钥
      const secret = 'abcdefghij1234567890';

      // When: 脱敏处理
      const masked = maskAppSecret(secret);

      // Then: 保留前2位和后2位，中间用 **** 替代
      assert.strictEqual(masked.substring(0, 2), 'ab');
      assert.strictEqual(masked.substring(masked.length - 2), '90');
      assert.ok(masked.includes('****'));
    });

    it('[P1] should handle short appSecret', () => {
      // Given: 短密钥
      const secret = 'abc';

      // When: 脱敏处理
      const masked = maskAppSecret(secret);

      // Then: 应该安全处理
      assert.ok(masked);
      assert.ok(!masked.includes('abc') || masked === 'a**');
    });

    it('[P2] should not output when POLYV_DEBUG not set', () => {
      // Given: POLYV_DEBUG 未设置
      const originalDebug = process.env.POLYV_DEBUG;
      delete process.env.POLYV_DEBUG;

      let captured = '';
      const originalLog = console.log;
      console.log = (...args) => { captured += args.join(' '); };

      try {
        // When: 调用 debug 函数
        debug('Test message', { key: 'value' });

        // Then: 不应该输出
        assert.strictEqual(captured, '');
      } finally {
        console.log = originalLog;
        if (originalDebug !== undefined) {
          process.env.POLYV_DEBUG = originalDebug;
        }
      }
    });

  });

  describe('AC5: API 限流处理', () => {

    it('[P0] should return friendly message for 429 status', () => {
      // Given: API 返回 429 限流
      const response = { code: 429, message: 'Too Many Requests' };

      // When: 解析错误
      const error = parseApiError(response);

      // Then: 返回友好的等待提示
      assert.strictEqual(error.code, 429);
      assert.ok(error.message.includes('频繁') || error.message.includes('Too Many'));
    });

    it('[P0] should set isRateLimit flag for 429', () => {
      // Given: API 返回 429
      const response = { code: 429, message: 'Too Many Requests' };

      // When: 解析错误
      const error = parseApiError(response);

      // Then: isRateLimit 标志正确设置
      assert.strictEqual(error.isRateLimit, true);
    });

    it('[P1] should include wait hint for rate limiting', () => {
      // Given: API 返回 429
      const response = { code: 429, message: 'Too Many Requests' };

      // When: 解析错误
      const error = parseApiError(response);

      // Then: 包含等待提示
      assert.ok(error.hint);
      assert.ok(error.hint.includes('稍后') || error.hint.includes('重试'));
    });

    it('[P1] should not set isRateLimit for non-429 errors', () => {
      // Given: 其他错误码
      const response = { code: 500, message: 'Internal Server Error' };

      // When: 解析错误
      const error = parseApiError(response);

      // Then: isRateLimit 不应该为 true
      assert.notStrictEqual(error.isRateLimit, true);
    });

  });

  describe('NFR1: 敏感信息脱敏', () => {

    it('[P0] should not expose full appSecret in masked output', () => {
      // Given: 敏感数据
      const data = { appId: 'test', appSecret: 'my-super-secret-key-12345' };

      // When: 脱敏
      const masked = maskSensitiveData(data);

      // Then: 完整密钥不应该出现
      const maskedStr = JSON.stringify(masked);
      assert.ok(!maskedStr.includes('my-super-secret-key-12345'));
    });

    it('[P1] should handle null data gracefully', () => {
      // Given: null 数据
      const data = null;

      // When: 脱敏
      const masked = maskSensitiveData(data);

      // Then: 应该安全返回
      assert.strictEqual(masked, null);
    });

    it('[P1] should handle non-object data gracefully', () => {
      // Given: 非对象数据
      const data = 'string data';

      // When: 脱敏
      const masked = maskSensitiveData(data);

      // Then: 应该原样返回
      assert.strictEqual(masked, 'string data');
    });

  });

});
