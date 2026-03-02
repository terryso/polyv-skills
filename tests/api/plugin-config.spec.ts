/**
 * ATDD Test Suite: Plugin Configuration
 * Story: 1.1 - 创建项目结构和插件配置
 * TDD Phase: RED (failing tests)
 *
 * These tests verify the plugin.json configuration for the polyv-skills plugin.
 * All tests use test.skip() to mark them as RED phase.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Plugin Configuration - AC3', () => {
  /**
   * Test: Should create valid plugin.json
   * Given: The plugin.json file
   * When: The plugin configuration is checked
   * Then: It should have the correct structure
   */
  test.skip('should have name in plugin.json', async () => {
    const projectRoot = process.cwd();
    const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');

    const content = fs.readFileSync(pluginPath, 'utf-8');
    const plugin = JSON.parse(content);

    // AC3: name must be "polyv-skills"
    expect(plugin.name).toBe('polyv-skills');
  });

  test.skip('should have version in plugin.json', async () => {
    const projectRoot = process.cwd();
    const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');

    const content = fs.readFileSync(pluginPath, 'utf-8');
    const plugin = JSON.parse(content);

    // AC3: version must be "1.0.0"
    expect(plugin.version).toBe('1.0.0');
  });

  test.skip('should have skills array pointing to ./skills/', async () => {
    const projectRoot = process.cwd();
    const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');

    const content = fs.readFileSync(pluginPath, 'utf-8');
    const plugin = JSON.parse(content);

    // AC3: skills must to an array containing "./skills/"
    expect(plugin.skills).toBeDefined();
    expect(Array.isArray(plugin.skills)).toBe(true);
    expect(plugin.skills).toContain('./skills/');
  });

  test.skip('should have description in plugin.json', async () => {
    const projectRoot = process.cwd();
    const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');

    const content = fs.readFileSync(pluginPath, 'utf-8');
    const plugin = JSON.parse(content);

    // AC3: description should describe the plugin
    expect(plugin.description).toBeDefined();
    expect(plugin.description).toContain('polyv');
  });

  test.skip('should have keywords array', async () => {
    const projectRoot = process.cwd();
    const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');

    const content = fs.readFileSync(pluginPath, 'utf-8');
    const plugin = JSON.parse(content);

    // AC3: keywords should include relevant terms
    expect(plugin.keywords).toBeDefined();
    expect(Array.isArray(plugin.keywords)).toBe(true);
    expect(plugin.keywords).toContain('polyv');
  });
});
