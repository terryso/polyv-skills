/**
 * Config Test Fixtures
 * Story: 1.2 - 实现配置加载功能
 *
 * Provides isolated testing environment for configuration loading tests.
 * Ensures clean environment state and temporary config directories.
 */

import { test as base } from '@playwright/test';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

type ConfigFixture = {
  cleanEnv: void;
  tempConfigDir: string;
};

// Store original environment variables for restoration
const originalEnv: Record<string, string | undefined> = {};

/**
 * Clean environment fixture
 * Saves and clears all POLYV_* environment variables before each test,
 * then restores them after the test completes.
 */
export const test = base.extend<ConfigFixture>({
  cleanEnv: [
    async ({}, use) => {
      // Save original POLYV_* environment variables
      const polyvEnvVars = Object.keys(process.env).filter(key => key.startsWith('POLYV_'));

      for (const key of polyvEnvVars) {
        originalEnv[key] = process.env[key];
        delete process.env[key];
      }

      // Also save and clear HOME-based config path for testing
      const originalHome = process.env.HOME;

      // Provide clean environment
      await use();

      // Restore original environment variables
      for (const key of polyvEnvVars) {
        if (originalEnv[key] !== undefined) {
          process.env[key] = originalEnv[key];
        } else {
          delete process.env[key];
        }
      }

      // Restore HOME
      if (originalHome !== undefined) {
        process.env.HOME = originalHome;
      }

      // Clear stored values
      for (const key of polyvEnvVars) {
        delete originalEnv[key];
      }
    },
    { auto: true },
  ],

  tempConfigDir: async ({}, use) => {
    // Create temporary directory for config files
    const tempDir = path.join(os.tmpdir(), `polyv-skills-test-${Date.now()}`);
    const configDir = path.join(tempDir, '.polyv-skills');

    fs.mkdirSync(configDir, { recursive: true });

    // Provide the config directory path
    await use(configDir);

    // Cleanup: Remove temp directory and all contents
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  },
});

export { expect } from '@playwright/test';
