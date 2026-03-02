/**
 * Config Factory
 * Story: 1.2 - 实现配置加载功能
 *
 * Factory functions for creating test configuration data.
 * Follows the factory pattern with overrides support.
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration type matching the expected polyv config structure
 */
export type PolyvConfig = {
  appId?: string;
  appSecret?: string;
};

/**
 * Environment variables type for polyv configuration
 */
export type PolyvEnvVars = {
  POLYV_APP_ID?: string;
  POLYV_APP_SECRET?: string;
  POLYV_DEBUG?: string;
};

/**
 * Default values for configuration
 */
const DEFAULT_APP_ID = 'test-app-id-xxxxxxxx';
const DEFAULT_APP_SECRET = 'test-app-secret-xxxxxxxxxxxxxxxxxxxxxxxx';

/**
 * Create a config object with optional overrides
 * @param overrides - Partial config to override defaults
 * @returns Complete PolyvConfig object
 *
 * @example
 * const config = createConfig(); // Uses defaults
 * const customConfig = createConfig({ appId: 'my-custom-id' }); // Overrides appId
 */
export const createConfig = (overrides: Partial<PolyvConfig> = {}): PolyvConfig => ({
  appId: DEFAULT_APP_ID,
  appSecret: DEFAULT_APP_SECRET,
  ...overrides,
});

/**
 * Create environment variables object with optional overrides
 * @param overrides - Partial env vars to override defaults
 * @returns Complete PolyvEnvVars object
 *
 * @example
 * const envVars = createEnvVars(); // Uses defaults
 * const customEnv = createEnvVars({ POLYV_APP_ID: 'env-app-id' });
 */
export const createEnvVars = (overrides: Partial<PolyvEnvVars> = {}): PolyvEnvVars => ({
  POLYV_APP_ID: DEFAULT_APP_ID,
  POLYV_APP_SECRET: DEFAULT_APP_SECRET,
  POLYV_DEBUG: 'false',
  ...overrides,
});

/**
 * Create a temporary config file for testing
 * @param configDir - Directory to create the config file in
 * @param content - Config content (uses defaults if not provided)
 * @returns Path to the created config file
 *
 * @example
 * const configPath = await createConfigFile('/tmp/test-dir');
 * // Creates /tmp/test-dir/config.json with default content
 *
 * const customPath = await createConfigFile('/tmp/test-dir', { appId: 'custom' });
 * // Creates /tmp/test-dir/config.json with custom content
 */
export const createConfigFile = (
  configDir: string,
  content: PolyvConfig = {}
): string => {
  const configPath = path.join(configDir, 'config.json');
  const configContent = createConfig(content);

  fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), 'utf-8');

  return configPath;
};

/**
 * Create multiple config variations for testing priority
 * @returns Object with configs for different priority levels
 *
 * @example
 * const { fileConfig, envConfig, paramConfig } = createPriorityConfigs();
 * // Use these to test priority: param > env > file
 */
export const createPriorityConfigs = () => ({
  fileConfig: createConfig({
    appId: 'file-app-id',
    appSecret: 'file-app-secret',
  }),
  envConfig: createEnvVars({
    POLYV_APP_ID: 'env-app-id',
    POLYV_APP_SECRET: 'env-app-secret',
  }),
  paramConfig: createConfig({
    appId: 'param-app-id',
    appSecret: 'param-app-secret',
  }),
});

/**
 * Create invalid config for error testing
 * @param type - Type of invalid config to create
 * @returns Invalid config object
 *
 * @example
 * const missingId = createInvalidConfig('missing-app-id');
 * // Returns { appSecret: '...' } without appId
 */
export const createInvalidConfig = (
  type: 'missing-app-id' | 'missing-app-secret' | 'empty' | 'invalid-json'
): PolyvConfig | string => {
  switch (type) {
    case 'missing-app-id':
      return { appSecret: DEFAULT_APP_SECRET };
    case 'missing-app-secret':
      return { appId: DEFAULT_APP_ID };
    case 'empty':
      return {};
    case 'invalid-json':
      return 'this is not valid json {{{';
    default:
      return {};
  }
};
