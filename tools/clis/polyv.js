#!/usr/bin/env node

/**
 * polyv-skills CLI Tool
 * Configuration loading module implementing Story 1.2
 *
 * Supports:
 * - Environment variables (POLYV_APP_ID, POLYV_APP_SECRET)
 * - Config file (~/.polyv-skills/config.json)
 * - CLI parameter overrides (--appId, --appSecret)
 *
 * Priority: params > env > file
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Constants
const CONFIG_DIR_NAME = '.polyv-skills';
const CONFIG_FILE_NAME = 'config.json';
const ENV_APP_ID = 'POLYV_APP_ID';
const ENV_APP_SECRET = 'POLYV_APP_SECRET';
const ENV_DEBUG = 'POLYV_DEBUG';

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

/**
 * Print help message
 */
function printHelp() {
  console.log(`
polyv-skills CLI Tool

Usage:
  polyv [command] [options]

Commands:
  config-test    Test configuration loading
  help           Show this help message

Options:
  --appId        PolyV application ID
  --appSecret    PolyV application secret

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

// CLI entry point
function main() {
  const args = process.argv.slice(2);
  const cliConfig = parseCliArgs(args);

  // Handle commands
  const command = args.find(arg => !arg.startsWith('--'));

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  if (command === 'config-test') {
    runConfigTest();
    process.exit(0);
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
  loadConfig,
  validateConfig,
  formatError,
  maskSensitiveData,
  debug,
  getConfigPath,
  readConfigFile,
  readConfigEnv,
  parseCliArgs
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
