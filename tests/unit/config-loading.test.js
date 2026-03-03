/**
 * ATDD Test Suite: Config Loading
 * Story: 1.2 - 实现配置加载功能
 * TDD Phase: GREEN (implementation complete)
 *
 * These tests verify the configuration loading functionality for the polyv-skills CLI tool.
 *
 * Acceptance Criteria:
 * - AC1: 环境变量配置支持
 * - AC2: 配置文件支持
 * - AC3: 参数传入支持
 * - AC4: 配置优先级
 * - AC5: 凭据缺失错误提示
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Import the functions we're testing
const {
  loadConfig,
  validateConfig,
  formatError,
  maskSensitiveData
} = require('../../skills/polyv-create-channel/scripts/polyv');

// Store original env values
const originalEnv = {};

// Helper to clean environment
function cleanEnv() {
  const polyvEnvVars = Object.keys(process.env).filter(key => key.startsWith('POLYV_'));
  for (const key of polyvEnvVars) {
    originalEnv[key] = process.env[key];
    delete process.env[key];
  }
}
// Helper to restore environment
function restoreEnv() {
  for (const key of Object.keys(originalEnv)) {
    if (originalEnv[key] !== undefined) {
      process.env[key] = originalEnv[key];
    } else {
      delete process.env[key];
    }
    delete originalEnv[key];
  }
}
// Helper to create temp config dir
function createTempConfigDir() {
  const tempDir = path.join(os.tmpdir(), `polyv-skills-test-${Date.now()}`);
  const configDir = path.join(tempDir, '.polyv-skills');
  fs.mkdirSync(configDir, { recursive: true });
  return configDir;
}
// Helper to cleanup temp dir
function cleanupTempDir(configDir) {
  const tempDir = path.dirname(configDir);
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
describe('Config Loading - Story 1.2', () => {
  beforeEach(() => {
    cleanEnv();
  });
  afterEach(() => {
    restoreEnv();
  });
  describe('AC1: 环境变量配置支持', () => {
    it('should load config from environment variables', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Set environment variables
        process.env.POLYV_APP_ID = 'env-test-app-id';
        process.env.POLYV_APP_SECRET = 'env-test-app-secret';
        // Action: Load config
        const config = loadConfig({}, { customHome: tempConfigDir });
        // Assert: Config should contain values from environment
        assert.strictEqual(config.appId, 'env-test-app-id');
        assert.strictEqual(config.appSecret, 'env-test-app-secret');
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
    it('should return undefined for missing environment variables', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Environment is clean (no POLYV_* vars)
        // Action: Load config
        const config = loadConfig({}, { customHome: tempConfigDir });
        // Assert: Config should have undefined values
        assert.strictEqual(config.appId, undefined);
        assert.strictEqual(config.appSecret, undefined);
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
  });
  describe('AC2: 配置文件支持', () => {
    it('should load config from config file', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Create config file in temp directory
        const configContent = {
          appId: 'file-test-app-id',
          appSecret: 'file-test-app-secret',
        };
        const configPath = path.join(tempConfigDir, 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), 'utf-8');
        // Action: Load config with customHome pointing to the .polyv-skills directory
        const parentDir = path.dirname(tempConfigDir);
        const config = loadConfig({}, { customHome: parentDir });
        // Assert: Config should contain values from file
        assert.strictEqual(config.appId, 'file-test-app-id');
        assert.strictEqual(config.appSecret, 'file-test-app-secret');
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
    it('should handle invalid JSON in config file', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Create config file with invalid JSON
        const configPath = path.join(tempConfigDir, 'config.json');
        fs.writeFileSync(configPath, '{ invalid json }}}', 'utf-8');
        // Action: Load config
        const parentDir = path.dirname(tempConfigDir);
        const config = loadConfig({}, { customHome: parentDir });
        // Assert: Config should be empty (graceful degradation)
        assert.strictEqual(config.appId, undefined);
        assert.strictEqual(config.appSecret, undefined);
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
  });
  describe('AC3: 参数传入支持', () => {
    it('should support CLI parameter overrides', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: No environment variables, no config file
        // Action: Load config with parameter overrides
        const config = loadConfig({
          appId: 'param-test-app-id',
          appSecret: 'param-test-app-secret',
        }, { customHome: tempConfigDir });
        // Assert: Config should contain values from parameters
        assert.strictEqual(config.appId, 'param-test-app-id');
        assert.strictEqual(config.appSecret, 'param-test-app-secret');
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
    it('should support partial parameter overrides', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Set appSecret in environment
        process.env.POLYV_APP_SECRET = 'env-app-secret';
        // Action: Load config with partial override
        const config = loadConfig({ appId: 'param-app-id' }, { customHome: tempConfigDir });
        // Assert: Config should merge parameter and environment values
        assert.strictEqual(config.appId, 'param-app-id'); // From parameter
        assert.strictEqual(config.appSecret, 'env-app-secret'); // From environment
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
  });
  describe('AC4: 配置优先级', () => {
    it('should respect priority: params > env > file', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Configure all three sources
        // 1. Config file
        const configContent = {
          appId: 'file-app-id',
          appSecret: 'file-app-secret',
        };
        const configPath = path.join(tempConfigDir, 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), 'utf-8');
        // 2. Environment variables
        process.env.POLYV_APP_ID = 'env-app-id';
        process.env.POLYV_APP_SECRET = 'env-app-secret';
        // 3. Parameters
        const paramAppId = 'param-app-id';
        const paramAppSecret = 'param-app-secret';
        // Action: Load config with parameters
        const parentDir = path.dirname(tempConfigDir);
        const config = loadConfig({
          appId: paramAppId,
          appSecret: paramAppSecret,
        }, { customHome: parentDir });
        // Assert: Parameter values should win (highest priority)
        assert.strictEqual(config.appId, 'param-app-id');
        assert.strictEqual(config.appSecret, 'param-app-secret');
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
    it('should use env values when no params provided', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Configure file and env sources
        const configContent = {
          appId: 'file-app-id',
          appSecret: 'file-app-secret',
        };
        const configPath = path.join(tempConfigDir, 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), 'utf-8');
        process.env.POLYV_APP_ID = 'env-app-id';
        process.env.POLYV_APP_SECRET = 'env-app-secret';
        // Action: Load config without parameters
        const parentDir = path.dirname(tempConfigDir);
        const config = loadConfig({}, { customHome: parentDir });
        // Assert: Environment values should win over file
        assert.strictEqual(config.appId, 'env-app-id');
        assert.strictEqual(config.appSecret, 'env-app-secret');
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
    it('should use file values when no params or env provided', () => {
      const tempConfigDir = createTempConfigDir();
      try {
        // Setup: Configure only file source
        const configContent = {
          appId: 'file-app-id',
          appSecret: 'file-app-secret',
        };
        const configPath = path.join(tempConfigDir, 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), 'utf-8');
        // No env vars set (cleanEnv ensures this)
        // Action: Load config
        const parentDir = path.dirname(tempConfigDir);
        const config = loadConfig({}, { customHome: parentDir });
        // Assert: File values should be used
        assert.strictEqual(config.appId, 'file-app-id');
        assert.strictEqual(config.appSecret, 'file-app-secret');
      } finally {
        cleanupTempDir(tempConfigDir);
      }
    });
  });
  describe('AC5: 凭据缺失错误提示', () => {
    it('should return clear error when appId missing', () => {
      // Setup: Only appSecret is provided
      const partialConfig = {
        appSecret: 'test-secret'
      };
      // Action: Validate config
      const error = validateConfig(partialConfig);
      // Assert: Error should be clear and actionable
      assert.ok(error);
      assert.strictEqual(error.code, 'CONFIG_MISSING');
      assert.ok(error.message.includes('appId'));
      assert.ok(/缺少|缺失|未配置/.test(error.message)); // Chinese error message
      assert.ok(error.hint.includes('POLYV_APP_ID')); // Include hint
    });
    it('should return clear error when appSecret missing', () => {
      // Setup: Only appId is provided
      const partialConfig = {
        appId: 'test-app-id'
      };
      // Action: Validate config
      const error = validateConfig(partialConfig);
      // Assert: Error should be clear and actionable
      assert.ok(error);
      assert.strictEqual(error.code, 'CONFIG_MISSING');
      assert.ok(error.message.includes('appSecret'));
      assert.ok(/缺少|缺失|未配置/.test(error.message)); // Chinese error message
      assert.ok(error.hint.includes('POLYV_APP_SECRET')); // Include hint
    });
    it('should return clear error when both credentials missing', () => {
      // Setup: No credentials provided
      const emptyConfig = {};
      // Action: Validate config
      const error = validateConfig(emptyConfig);
      // Assert: Error should list all missing items
      assert.ok(error);
      assert.strictEqual(error.code, 'CONFIG_MISSING');
      assert.ok(error.message.includes('appId'));
      assert.ok(error.message.includes('appSecret'));
      assert.ok(error.hint.includes('config.json')); // Include file path hint
    });
    it('should format error message correctly', () => {
      // Setup: Error details
      const code = 'CONFIG_MISSING';
      const message = '缺少 appId 配置';
      const hint = '请设置 POLYV_APP_ID 环境变量';
      // Action: Format error
      const formattedError = formatError(code, message, hint);
      // Assert: Error should be properly formatted
      assert.ok(formattedError.includes('❌')); // Error indicator
      assert.ok(formattedError.includes('[POLYV-CONFIG_MISSING]')); // Error code
      assert.ok(formattedError.includes(message)); // Message
      assert.ok(formattedError.includes('提示：')); // Hint prefix
      assert.ok(formattedError.includes(hint)); // Hint content
    });
    it('should not expose appSecret in error messages', () => {
      // Setup: Data with sensitive data
      const data = { appId: 'test-app-id', appSecret: 'secret-12345' };
      // Action: Mask sensitive data
      const maskedData = maskSensitiveData(data);
      // Assert: appSecret should be masked
      assert.notStrictEqual(maskedData.appSecret, 'secret-12345');
      assert.ok(!maskedData.appSecret.includes('secret-12345'));
      assert.strictEqual(maskedData.appId, 'test-app-id'); // appId should not be masked
    });
  });
});
