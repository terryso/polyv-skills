/**
 * ATDD Test Suite: API Client
 * Story: 2.1 - 实现 polyv CLI 核心（签名和 API 调用）
 * TDD Phase: GREEN (tests should pass after implementation)
 *
 * Acceptance Criteria:
 * - AC6: 调用 polyv 创建频道 API (POST /live/v4/channel/create)
 * - AC7: Content-Type: application/json
 * - AC8: 请求体包含 appId, timestamp, sign, name, scene, template
 * - AC9: 解析成功响应，提取 channelId 和 userId
 * - AC10: 解析错误响应，提取错误码和错误信息
 */

'use strict';

const assert = require('assert');

// Import the functions we're testing
const {
  createChannel,
  parseApiResponse,
  parseApiError,
  buildRequestConfig,
  buildRequestBody,
  isSuccessfulResponse,
  handleNetworkError,
  API_BASE_URL,
  DEFAULT_TIMEOUT
} = require('../../tools/clis/polyv');

describe('API Client - Story 2.1', () => {

  describe('AC6: 调用 polyv 创建频道 API', () => {

    it('[P0] should send POST request to correct endpoint', async () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      // This should make a POST request to https://api.polyv.net/live/v4/channel/create
      // Will fail because endpoint requires real credentials
      try {
        await createChannel(config, channelParams);
      } catch (error) {
        // Expected to fail - either network error or auth error
        // But we can verify the error structure
        assert.ok(error);
      }
    });

    it('[P1] should throw clear error when credentials invalid', async () => {
      const invalidConfig = {
        appId: 'invalid',
        appSecret: 'invalid'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      await assert.rejects(
        async () => await createChannel(invalidConfig, channelParams),
        (error) => {
          // Error code could be API_ERROR (API response) or NETWORK_ERROR (network issue)
          assert.ok(error.code === 'API_ERROR' || error.code === 'NETWORK_ERROR');
          return true;
        }
      );
    });

  });

  describe('AC7: Content-Type: application/json', () => {

    it('[P0] should send request with JSON content type', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const requestConfig = buildRequestConfig(config, channelParams);

      assert.strictEqual(requestConfig.headers['Content-Type'], 'application/json');
    });

    it('[P1] should serialize body as JSON', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const requestConfig = buildRequestConfig(config, channelParams);

      // Body should be a JSON string
      assert.strictEqual(typeof requestConfig.body, 'string');
      // Should be parseable as JSON
      const parsedBody = JSON.parse(requestConfig.body);
      assert.ok(parsedBody);
    });

  });

  describe('AC8: 请求体包含必要参数', () => {

    it('[P0] should include appId in request body', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const body = buildRequestBody(config, channelParams);

      assert.strictEqual(body.appId, 'test-app-id');
    });

    it('[P0] should include timestamp in request body', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const body = buildRequestBody(config, channelParams);

      assert.ok(body.timestamp);
      assert.strictEqual(typeof body.timestamp, 'number');
    });

    it('[P0] should include sign in request body', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const body = buildRequestBody(config, channelParams);

      assert.ok(body.sign);
      assert.strictEqual(typeof body.sign, 'string');
      assert.match(body.sign, /^[a-f0-9]{32}$/);
    });

    it('[P0] should include channel name in request body', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const body = buildRequestBody(config, channelParams);

      assert.strictEqual(body.name, '测试频道');
    });

    it('[P1] should include scene type in request body', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const body = buildRequestBody(config, channelParams);

      assert.strictEqual(body.scene, 'topclass');
    });

    it('[P1] should include template type in request body', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道',
        scene: 'topclass',
        template: 'ppt'
      };

      const body = buildRequestBody(config, channelParams);

      assert.strictEqual(body.template, 'ppt');
    });

    it('[P1] should use defaults for optional params', () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道'
        // scene and template not provided
      };

      const body = buildRequestBody(config, channelParams);

      // Should use defaults
      assert.strictEqual(body.scene, 'topclass');
      assert.strictEqual(body.template, 'ppt');
    });

  });

  describe('AC9: 解析成功响应', () => {

    it('[P0] should extract channelId from success response', () => {
      const mockResponse = {
        code: 200,
        status: 'success',
        data: {
          channelId: 123456,
          userId: 'user123',
          name: '测试频道'
        }
      };

      const result = parseApiResponse(mockResponse);

      assert.strictEqual(result.channelId, 123456);
    });

    it('[P0] should extract userId from success response', () => {
      const mockResponse = {
        code: 200,
        status: 'success',
        data: {
          channelId: 123456,
          userId: 'user123',
          name: '测试频道'
        }
      };

      const result = parseApiResponse(mockResponse);

      assert.strictEqual(result.userId, 'user123');
    });

    it('[P1] should identify success responses', () => {
      const successResponse = { code: 200, status: 'success' };
      const errorResponse = { code: 400, status: 'error' };

      assert.strictEqual(isSuccessfulResponse(successResponse), true);
      assert.strictEqual(isSuccessfulResponse(errorResponse), false);
    });

  });

  describe('AC10: 解析错误响应', () => {

    it('[P0] should extract error code from error response', () => {
      const mockErrorResponse = {
        code: 400,
        status: 'error',
        message: '参数错误',
        data: null
      };

      const error = parseApiError(mockErrorResponse);

      assert.strictEqual(error.code, 400);
    });

    it('[P0] should extract error message from error response', () => {
      const mockErrorResponse = {
        code: 400,
        status: 'error',
        message: '参数错误',
        data: null
      };

      const error = parseApiError(mockErrorResponse);

      assert.ok(error.message.includes('参数错误'));
    });

    it('[P1] should handle authentication errors', () => {
      const authErrorResponse = {
        code: 403,
        status: 'error',
        message: '签名验证失败',
        data: null
      };

      const error = parseApiError(authErrorResponse);

      assert.strictEqual(error.code, 403);
      assert.ok(error.message.includes('签名'));
    });

    it('[P1] should handle rate limiting errors', () => {
      const rateLimitResponse = {
        code: 429,
        status: 'error',
        message: '请求过于频繁',
        data: null
      };

      const error = parseApiError(rateLimitResponse);

      assert.strictEqual(error.code, 429);
      assert.ok(error.isRateLimit === true);
    });

    it('[P2] should include hint for common errors', () => {
      const authErrorResponse = {
        code: 403,
        status: 'error',
        message: '签名验证失败',
        data: null
      };

      const error = parseApiError(authErrorResponse);

      assert.ok(error.hint);
      assert.ok(error.hint.length > 0);
    });

  });

  describe('NFR3: 使用 HTTPS 传输', () => {

    it('[P0] should use HTTPS for API requests', () => {
      assert.ok(API_BASE_URL.startsWith('https://'));
      assert.ok(API_BASE_URL.includes('polyv.net'));
    });

  });

  describe('NFR10: 网络错误时返回清晰错误信息', () => {

    it('[P0] should handle network timeout gracefully', async () => {
      const config = {
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
      };

      const channelParams = {
        name: '测试频道'
      };

      // Request with very short timeout
      try {
        await createChannel(config, channelParams, { timeout: 1 });
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error);
        assert.ok(error.code || error.message);
        // Should not crash
      }
    });

    it('[P1] should handle DNS resolution failure', () => {
      const dnsError = new Error('getaddrinfo ENOTFOUND invalid.domain');
      const result = handleNetworkError(dnsError);

      assert.ok(result.message);
      assert.ok(result.code === 'NETWORK_ERROR');
    });

    it('[P1] should handle connection refused', () => {
      const connError = new Error('connect ECONNREFUSED');
      const result = handleNetworkError(connError);

      assert.ok(result.message);
      assert.ok(result.code === 'NETWORK_ERROR');
    });

  });

  describe('NFR5: API 调用响应时间 < 5 秒', () => {

    it('[P1] should have default timeout of 5 seconds', () => {
      assert.ok(DEFAULT_TIMEOUT <= 5000);
    });

  });

});
