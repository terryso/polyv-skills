#!/usr/bin/env node

/**
 * polyv-skills CLI Tool
 * Configuration loading module implementing Story 1.2
 * Signature and API module implementing Story 2.1
 *
 * Supports:
 * - Environment variables (POLYV_APP_ID, POLYV_APP_SECRET)
 * - Config file (~/.polyv-skills/config.json)
 * - CLI parameter overrides (--appId, --appSecret)
 * - MD5 signature generation for PolyV API v4
 * - API calls to PolyV platform
 *
 * Priority: params > env > file
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Constants
const CONFIG_DIR_NAME = '.polyv-skills';
const CONFIG_FILE_NAME = 'config.json';
const ENV_APP_ID = 'POLYV_APP_ID';
const ENV_APP_SECRET = 'POLYV_APP_SECRET';
const ENV_DEBUG = 'POLYV_DEBUG';

// API Constants (Story 2.1)
const API_BASE_URL = 'https://api.polyv.net';
const DEFAULT_TIMEOUT = 5000; // 5 seconds
const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get the path to the config file
 * @param {string} customHome - Optional custom home directory for testing
 * @returns {string} Path to config file
 */
function getConfigPath(customHome) {
  const home = customHome || os.homedir();
  return path.join(home, CONFIG_DIR_NAME, CONFIG_FILE_NAME);
}

/**
 * Debug output - only prints when POLYV_DEBUG is set
 * @param {string} message - Debug message
 * @param {object} data - Optional data to log
 */
function debug(message, data = null) {
  if (process.env[ENV_DEBUG]) {
    const timestamp = new Date().toISOString();
    if (data) {
      const maskedData = maskSensitiveData(data);
      console.log(`[DEBUG ${timestamp}] ${message}`, JSON.stringify(maskedData, null, 2));
    } else {
      console.log(`[DEBUG ${timestamp}] ${message}`);
    }
  }
}

/**
 * Mask sensitive data for logging
 * @param {object} data - Data object to mask
 * @returns {object} Masked data object
 */
function maskSensitiveData(data) {
  if (!data || typeof data !== 'object') return data;

  const masked = { ...data };
  if (masked.appSecret) {
    const secret = String(masked.appSecret);
    if (secret.length > 4) {
      masked.appSecret = secret.substring(0, 2) + '****' + secret.substring(secret.length - 2);
    } else {
      masked.appSecret = '****';
    }
  }
  return masked;
}

/**
 * Format error message with Chinese text
 * @param {string} code - Error code
 * @param {string} message - Error message (Chinese)
 * @param {string} hint - Optional hint for resolution
 * @returns {string} Formatted error string
 */
function formatError(code, message, hint = null) {
  let error = `❌ [POLYV-${code}] ${message}`;
  if (hint) {
    error += `\n   提示：${hint}`;
  }
  return error;
}

/**
 * Validate configuration and return error if missing required fields
 * @param {object} config - Config object to validate
 * @returns {object|null} Error object with code, message, hint or null if valid
 */
function validateConfig(config) {
  const missing = [];

  if (!config || !config.appId) {
    missing.push('appId');
  }
  if (!config || !config.appSecret) {
    missing.push('appSecret');
  }

  if (missing.length === 0) {
    return null;
  }

  const message = missing.length === 1
    ? `缺少 ${missing[0]} 配置`
    : `缺少 ${missing.join(' 和 ')} 配置`;

  let hint;
  if (missing.includes('appId') && missing.includes('appSecret')) {
    hint = '请设置 POLYV_APP_ID 和 POLYV_APP_SECRET 环境变量，或创建 ~/.polyv-skills/config.json 配置文件';
  } else if (missing.includes('appId')) {
    hint = '请设置 POLYV_APP_ID 环境变量，或在 ~/.polyv-skills/config.json 中配置 appId';
  } else {
    hint = '请设置 POLYV_APP_SECRET 环境变量，或在 ~/.polyv-skills/config.json 中配置 appSecret';
  }

  return {
    code: 'CONFIG_MISSING',
    message: message,
    hint: hint
  };
}

/**
 * Read configuration from file
 * @param {string} customHome - Optional custom home directory for testing
 * @returns {object} Config object from file (empty if not found or invalid)
 */
function readConfigFile(customHome) {
  const configPath = getConfigPath(customHome);

  try {
    if (!fs.existsSync(configPath)) {
      debug('Config file not found', { path: configPath });
      return {};
    }

    const content = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content);

    debug('Config loaded from file', { path: configPath, config });
    return config;
  } catch (error) {
    if (error.code === 'ENOENT') {
      debug('Config file does not exist', { path: configPath });
      return {};
    }
    if (error instanceof SyntaxError) {
      debug('Config file contains invalid JSON', { path: configPath, error: error.message });
      return {};
    }
    debug('Error reading config file', { path: configPath, error: error.message });
    return {};
  }
}

/**
 * Read configuration from environment variables
 * @returns {object} Config object from environment
 */
function readConfigEnv() {
  const config = {};

  if (process.env[ENV_APP_ID]) {
    config.appId = process.env[ENV_APP_ID];
  }

  if (process.env[ENV_APP_SECRET]) {
    config.appSecret = process.env[ENV_APP_SECRET];
  }

  debug('Config from environment', config);
  return config;
}

/**
 * Parse CLI arguments for config overrides
 * @param {string[]} args - CLI arguments (process.argv.slice(2))
 * @returns {object} Config object from CLI args
 */
function parseCliArgs(args) {
  const config = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--appId' && args[i + 1]) {
      config.appId = args[++i];
    } else if (arg === '--appSecret' && args[i + 1]) {
      config.appSecret = args[++i];
    } else if (arg.startsWith('--appId=')) {
      config.appId = arg.split('=')[1];
    } else if (arg.startsWith('--appSecret=')) {
      config.appSecret = arg.split('=')[1];
    }
  }

  debug('Config from CLI args', config);
  return config;
}

/**
 * Load configuration with priority: params > env > file
 * @param {object} params - Optional parameter overrides
 * @param {object} options - Additional options (e.g., customHome for testing)
 * @returns {object} Merged config object
 */
function loadConfig(params = {}, options = {}) {
  // Load from file (lowest priority)
  const fileConfig = readConfigFile(options.customHome);

  // Load from environment (medium priority)
  const envConfig = readConfigEnv();

  // Merge with priority: params > env > file
  const mergedConfig = {
    appId: params.appId || envConfig.appId || fileConfig.appId,
    appSecret: params.appSecret || envConfig.appSecret || fileConfig.appSecret,
  };

  // Remove undefined values for cleaner output
  const finalConfig = {};
  if (mergedConfig.appId !== undefined) {
    finalConfig.appId = mergedConfig.appId;
  }
  if (mergedConfig.appSecret !== undefined) {
    finalConfig.appSecret = mergedConfig.appSecret;
  }

  debug('Final merged config', finalConfig);
  return finalConfig;
}

// ============================================
// Story 2.1: Signature Generation Functions
// ============================================

/**
 * Generate millisecond timestamp
 * @returns {number} Current timestamp in milliseconds
 */
function generateTimestamp() {
  return Date.now();
}

/**
 * Validate timestamp is within 5 minute window
 * @param {number} timestamp - Timestamp to validate (milliseconds)
 * @returns {boolean} True if timestamp is valid
 */
function validateTimestamp(timestamp) {
  // Reject non-millisecond timestamps (10 digit second-based)
  if (timestamp < 10000000000) {
    return false;
  }

  const now = Date.now();
  const diff = Math.abs(now - timestamp);
  return diff <= TIMESTAMP_TOLERANCE_MS;
}

/**
 * Mask appSecret for display
 * @param {string} secret - The secret to mask
 * @returns {string} Masked secret (e.g., "ab****yz")
 */
function maskAppSecret(secret) {
  if (!secret || typeof secret !== 'string') {
    return '****';
  }
  if (secret.length <= 4) {
    return secret.charAt(0) + '*'.repeat(secret.length - 1);
  }
  return secret.substring(0, 2) + '****' + secret.substring(secret.length - 2);
}

/**
 * Build signature string from params (sorted alphabetically)
 * @param {object} params - Parameters to build signature string from
 * @returns {string} Concatenated string in key1value1key2value2... format
 */
function buildSignatureString(params) {
  const sortedKeys = Object.keys(params).sort();
  let signStr = '';
  for (const key of sortedKeys) {
    signStr += key + params[key];
  }
  return signStr;
}

/**
 * Generate MD5 signature for PolyV API v4
 * @param {object} params - Request parameters (not including appSecret)
 * @param {string} appSecret - Application secret
 * @returns {string} MD5 signature (32-char lowercase hex)
 */
function generateSignature(params, appSecret) {
  // 1. Build sorted parameter string
  const signStr = buildSignatureString(params) + appSecret;
  // 2. Calculate MD5
  return crypto.createHash('md5').update(signStr).digest('hex');
}

// ============================================
// Story 2.1: API Client Functions
// ============================================

/**
 * Build request body for create-channel API
 * @param {object} config - Config with appId and appSecret
 * @param {object} channelParams - Channel parameters
 * @returns {object} Request body object
 */
function buildRequestBody(config, channelParams) {
  const timestamp = generateTimestamp();

  // Build params for signature (business params only, not including sign)
  const signParams = {
    appId: config.appId,
    timestamp: timestamp,
    name: channelParams.name,
    newScene: channelParams.newScene || channelParams.scene || 'topclass',
    template: channelParams.template || 'ppt'
  };

  // Add optional parameters if provided
  if (channelParams.channelPasswd) signParams.channelPasswd = channelParams.channelPasswd;
  if (channelParams.pureRtcEnabled) signParams.pureRtcEnabled = channelParams.pureRtcEnabled;
  if (channelParams.type) signParams.type = channelParams.type;
  if (channelParams.linkMicLimit) signParams.linkMicLimit = channelParams.linkMicLimit;
  if (channelParams.categoryId) signParams.categoryId = channelParams.categoryId;
  if (channelParams.startTime) signParams.startTime = channelParams.startTime;
  if (channelParams.endTime) signParams.endTime = channelParams.endTime;
  if (channelParams.labelData) signParams.labelData = channelParams.labelData;

  const sign = generateSignature(signParams, config.appSecret);

  // Build request body (API uses newScene, but we accept both scene and newScene)
  const requestBody = {
    appId: config.appId,
    timestamp: timestamp,
    sign: sign,
    name: signParams.name,
    newScene: signParams.newScene,
    template: signParams.template
  };

  // Add optional parameters to request body
  if (signParams.channelPasswd) requestBody.channelPasswd = signParams.channelPasswd;
  if (signParams.pureRtcEnabled) requestBody.pureRtcEnabled = signParams.pureRtcEnabled;
  if (signParams.type) requestBody.type = signParams.type;
  if (signParams.linkMicLimit) requestBody.linkMicLimit = signParams.linkMicLimit;
  if (signParams.categoryId) requestBody.categoryId = signParams.categoryId;
  if (signParams.startTime) requestBody.startTime = signParams.startTime;
  if (signParams.endTime) requestBody.endTime = signParams.endTime;
  if (signParams.labelData) requestBody.labelData = signParams.labelData;

  return requestBody;
}

/**
 * Build request configuration for fetch
 * @param {object} config - Config with appId and appSecret
 * @param {object} channelParams - Channel parameters
 * @returns {object} Request config with headers and body
 */
function buildRequestConfig(config, channelParams) {
  const body = buildRequestBody(config, channelParams);

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

/**
 * Check if API response indicates success
 * @param {object} response - API response object
 * @returns {boolean} True if response is successful
 */
function isSuccessfulResponse(response) {
  return response && response.code === 200;
}

/**
 * Parse successful API response
 * @param {object} response - API response object
 * @returns {object} Parsed result with channelId and userId
 */
function parseApiResponse(response) {
  if (!isSuccessfulResponse(response)) {
    return null;
  }

  return {
    channelId: response.data?.channelId,
    userId: response.data?.userId,
    name: response.data?.name
  };
}

/**
 * Error code mapping for Chinese messages
 */
const ERROR_CODE_MESSAGES = {
  400: '请求参数错误',
  401: '签名验证失败',
  403: '无权限访问',
  429: '请求过于频繁',
  500: '服务器内部错误'
};

/**
 * Error code hints
 */
const ERROR_CODE_HINTS = {
  400: '检查请求参数是否正确',
  401: '检查 appId 和 appSecret 是否正确',
  403: '检查账号权限',
  429: '请稍后重试',
  500: '请稍后重试或联系技术支持'
};

/**
 * Parse API error response
 * @param {object} response - API error response object
 * @returns {object} Parsed error with code, message, hint
 */
function parseApiError(response) {
  const code = response?.code || 500;
  const message = response?.message || response?.msg || ERROR_CODE_MESSAGES[code] || '未知错误';

  return {
    code: code,
    message: message,
    hint: ERROR_CODE_HINTS[code] || '请检查请求后重试',
    isRateLimit: code === 429
  };
}

/**
 * Handle network errors
 * @param {Error} error - Network error
 * @returns {object} Formatted error object
 */
function handleNetworkError(error) {
  let message = '网络请求失败';
  let hint = '请检查网络连接后重试';

  if (error.message?.includes('ENOTFOUND') || error.message?.includes('DNS')) {
    message = 'DNS 解析失败';
    hint = '请检查网络连接或 DNS 配置';
  } else if (error.message?.includes('ECONNREFUSED')) {
    message = '连接被拒绝';
    hint = '服务器无法连接，请稍后重试';
  } else if (error.message?.includes('ETIMEDOUT') || error.message?.includes('timeout')) {
    message = '请求超时';
    hint = '服务器响应超时，请稍后重试';
  }

  return {
    code: 'NETWORK_ERROR',
    message: message,
    hint: hint
  };
}

/**
 * Create a channel via PolyV API
 * @param {object} config - Config with appId and appSecret
 * @param {object} channelParams - Channel parameters (name, scene, template)
 * @param {object} options - Additional options (timeout)
 * @returns {Promise<object>} Created channel info
 */
async function createChannel(config, channelParams, options = {}) {
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const endpoint = `${API_BASE_URL}/live/v4/channel/create`;
  const requestConfig = buildRequestConfig(config, channelParams);

  debug('Creating channel', {
    endpoint: endpoint,
    params: { ...channelParams, appId: config.appId },
    timeout: timeout
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endpoint, {
      ...requestConfig,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    debug('API response', maskSensitiveData(data));

    if (isSuccessfulResponse(data)) {
      return parseApiResponse(data);
    } else {
      const error = parseApiError(data);
      const err = new Error(error.message);
      err.code = 'API_ERROR';
      err.apiCode = error.code;
      err.hint = error.hint;
      throw err;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('请求超时');
      timeoutError.code = 'API_ERROR';
      timeoutError.apiCode = 'TIMEOUT';
      throw timeoutError;
    }

    if (error.code === 'API_ERROR') {
      throw error;
    }

    // Network error
    const networkError = handleNetworkError(error);
    const err = new Error(networkError.message);
    err.code = networkError.code;
    err.hint = networkError.hint;
    throw err;
  }
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
polyv-skills CLI Tool v${CLI_VERSION}

Usage:
  polyv [command] [options]
  polyv --help
  polyv --version

Commands:
  config-test       Test configuration loading
  create-channel    Create a new channel
  help              Show this help message

Options:
  --help, -h     Show this help message
  --version, -v  Show version number
  --appId        PolyV application ID
  --appSecret    PolyV application secret

create-channel Options:
  --name              Channel name (required)
  --scene             Scene type: topclass (default), double, train, alone, seminar, guide
  --template          Template type: ppt (default), portrait_ppt, alone, portrait_alone, topclass, portrait_topclass, seminar

  Advanced Options:
  --channelPasswd     Teacher login password (6-16 chars, auto-generated if not provided)
  --pureRtcEnabled    Latency mode: Y (no delay) or N (normal delay)
  --type              Broadcast type: normal, transmit, receive
  --linkMicLimit      Max co-hosts (1-16)
  --categoryId        Category ID
  --startTime         Start timestamp (display only)
  --endTime           End timestamp (display only)
  --labelData         Label IDs (comma-separated)

Environment Variables:
  POLYV_APP_ID      PolyV application ID
  POLYV_APP_SECRET  PolyV application secret
  POLYV_DEBUG       Enable debug mode (set to 'true')

Config File:
  ~/.polyv-skills/config.json
  {
    "appId": "your-app-id",
    "appSecret": "your-app-secret"
  }
  POLYV_APP_SECRET  PolyV application secret
  POLYV_DEBUG       Enable debug mode (set to 'true')

Config File:
  ~/.polyv-skills/config.json
  {
    "appId": "your-app-id",
    "appSecret": "your-app-secret"
  }

Priority: CLI params > Environment variables > Config file
`);
}

/**
 * Run configuration test
 */
function runConfigTest() {
  console.log('Testing configuration loading...\n');

  // Test 1: Load config
  const config = loadConfig();
  console.log('1. Loaded config:', maskSensitiveData(config));

  // Test 2: Validate config
  const error = validateConfig(config);
  if (error) {
    console.log('\n2. Validation result:', formatError(error.code, error.message, error.hint));
  } else {
    console.log('\n2. Validation result: ✅ Config is valid');
  }

  // Test 3: Show config paths
  console.log('\n3. Config file path:', getConfigPath());

  console.log('\n✅ Configuration test complete');
}

/**
 * Parse channel parameters from CLI args
 * @param {string[]} args - CLI arguments
 * @returns {object} Channel parameters
 */
function parseChannelArgs(args) {
  const params = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Required parameters
    if (arg === '--name' && args[i + 1]) {
      params.name = args[++i];
    } else if (arg.startsWith('--name=')) {
      params.name = arg.split('=')[1];

    // Scene (newScene) - basic parameter
    } else if ((arg === '--scene' || arg === '--newScene') && args[i + 1]) {
      params.newScene = args[++i];
    } else if (arg.startsWith('--scene=')) {
      params.newScene = arg.split('=')[1];
    } else if (arg.startsWith('--newScene=')) {
      params.newScene = arg.split('=')[1];

    // Template - basic parameter
    } else if (arg === '--template' && args[i + 1]) {
      params.template = args[++i];
    } else if (arg.startsWith('--template=')) {
      params.template = arg.split('=')[1];

    // Optional advanced parameters
    } else if (arg === '--channelPasswd' && args[i + 1]) {
      params.channelPasswd = args[++i];
    } else if (arg.startsWith('--channelPasswd=')) {
      params.channelPasswd = arg.split('=')[1];

    } else if (arg === '--pureRtcEnabled' && args[i + 1]) {
      params.pureRtcEnabled = args[++i];
    } else if (arg.startsWith('--pureRtcEnabled=')) {
      params.pureRtcEnabled = arg.split('=')[1];

    } else if (arg === '--type' && args[i + 1]) {
      params.type = args[++i];
    } else if (arg.startsWith('--type=')) {
      params.type = arg.split('=')[1];

    } else if (arg === '--linkMicLimit' && args[i + 1]) {
      params.linkMicLimit = parseInt(args[++i], 10);
    } else if (arg.startsWith('--linkMicLimit=')) {
      params.linkMicLimit = parseInt(arg.split('=')[1], 10);

    } else if (arg === '--categoryId' && args[i + 1]) {
      params.categoryId = parseInt(args[++i], 10);
    } else if (arg.startsWith('--categoryId=')) {
      params.categoryId = parseInt(arg.split('=')[1], 10);

    } else if (arg === '--startTime' && args[i + 1]) {
      params.startTime = parseInt(args[++i], 10);
    } else if (arg.startsWith('--startTime=')) {
      params.startTime = parseInt(arg.split('=')[1], 10);

    } else if (arg === '--endTime' && args[i + 1]) {
      params.endTime = parseInt(args[++i], 10);
    } else if (arg.startsWith('--endTime=')) {
      params.endTime = parseInt(arg.split('=')[1], 10);

    } else if (arg === '--labelData' && args[i + 1]) {
      params.labelData = args[++i].split(',').map(id => parseInt(id.trim(), 10));
    } else if (arg.startsWith('--labelData=')) {
      params.labelData = arg.split('=')[1].split(',').map(id => parseInt(id.trim(), 10));
    }
  }

  return params;
}

/**
 * Run create-channel command
 * @param {object} config - Validated config
 * @param {string[]} args - CLI args for channel params
 */
async function runCreateChannel(config, args) {
  const channelParams = parseChannelArgs(args);

  if (!channelParams.name) {
    console.error(formatError('MISSING_NAME', '缺少频道名称', '请使用 --name 参数指定频道名称'));
    process.exit(1);
  }

  try {
    const result = await createChannel(config, channelParams);
    console.log(JSON.stringify({
      success: true,
      channelId: result.channelId,
      userId: result.userId
    }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      error: {
        code: error.apiCode || error.code,
        message: error.message,
        hint: error.hint
      }
    }, null, 2));
    process.exit(1);
  }
}

// CLI version
const CLI_VERSION = '1.0.0';

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const cliConfig = parseCliArgs(args);

  // Handle --help and --version flags first (even without command)
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(CLI_VERSION);
    process.exit(0);
  }

  // Handle commands
  const command = args.find(arg => !arg.startsWith('--'));

  if (command === 'help') {
    printHelp();
    process.exit(0);
  }

  if (command === 'config-test') {
    runConfigTest();
    process.exit(0);
  }

  if (command === 'create-channel') {
    const config = loadConfig(cliConfig);
    const error = validateConfig(config);

    if (error) {
      console.error(JSON.stringify({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          hint: error.hint
        }
      }, null, 2));
      process.exit(1);
    }

    await runCreateChannel(config, args);
    return;
  }

  // Default: load and display config
  const config = loadConfig(cliConfig);
  const error = validateConfig(config);

  if (error) {
    console.error(formatError(error.code, error.message, error.hint));
    process.exit(1);
  }

  console.log(JSON.stringify(maskSensitiveData(config), null, 2));
}

// Export functions for testing
module.exports = {
  // Config functions (Story 1.2)
  loadConfig,
  validateConfig,
  formatError,
  maskSensitiveData,
  debug,
  getConfigPath,
  readConfigFile,
  readConfigEnv,
  parseCliArgs,

  // Signature functions (Story 2.1)
  generateTimestamp,
  validateTimestamp,
  maskAppSecret,
  buildSignatureString,
  generateSignature,

  // API functions (Story 2.1)
  API_BASE_URL,
  DEFAULT_TIMEOUT,
  buildRequestBody,
  buildRequestConfig,
  isSuccessfulResponse,
  parseApiResponse,
  parseApiError,
  handleNetworkError,
  createChannel,

  // Error handling constants (Story 2.3)
  ERROR_CODE_MESSAGES,
  ERROR_CODE_HINTS
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
