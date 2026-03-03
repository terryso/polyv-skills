/**
 * E2E Test Suite: Plugin Installation
 * Story: 1.1 - 创建项目结构和插件配置
 *
 * These tests verify the end-to-end plugin installation workflow.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Get project root directory
const projectRoot = process.cwd();

test.describe('Plugin Installation E2E Tests', () => {

  test.describe('Plugin Structure', () => {

    test('should have valid marketplace.json', async () => {
      const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');

      // Verify file exists
      expect(fs.existsSync(marketplacePath)).toBe(true);

      // Verify JSON is valid
      const content = fs.readFileSync(marketplacePath, 'utf-8');
      const marketplace = JSON.parse(content);

      // Verify structure
      expect(marketplace.plugins).toBeDefined();
      expect(marketplace.plugins.length).toBeGreaterThan(0);

      const plugin = marketplace.plugins[0];
      expect(plugin.name).toBe('polyv-skills');
      expect(plugin.homepage).toBe('https://github.com/terryso/polyv-skills');
    });

    test('should have valid plugin.json', async () => {
      const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');

      // Verify file exists
      expect(fs.existsSync(pluginPath)).toBe(true);

      // Verify JSON is valid
      const content = fs.readFileSync(pluginPath, 'utf-8');
      const plugin = JSON.parse(content);

      // Verify structure
      expect(plugin.name).toBe('polyv-skills');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.skills).toContain('./skills/');
    });

    test('should have skills directory', async () => {
      const skillsPath = path.join(projectRoot, 'skills');

      expect(fs.existsSync(skillsPath)).toBe(true);
      expect(fs.statSync(skillsPath).isDirectory()).toBe(true);
    });

  });

  test.describe('Documentation', () => {

    test('should have README with installation instructions', async () => {
      const readmePath = path.join(projectRoot, 'README.md');

      expect(fs.existsSync(readmePath)).toBe(true);

      const content = fs.readFileSync(readmePath, 'utf-8');

      // Verify all installation methods are documented
      expect(content).toContain('Claude Code');
      expect(content).toContain('terryso/polyv-skills');
      expect(content).toContain('Git Submodule');
      expect(content).toContain('Clone');
    });

    test('should have AGENTS.md with usage instructions', async () => {
      const agentsPath = path.join(projectRoot, 'AGENTS.md');

      expect(fs.existsSync(agentsPath)).toBe(true);

      const content = fs.readFileSync(agentsPath, 'utf-8');

      // Verify it contains skill usage info
      expect(content).toContain('polyv-create-channel');
      expect(content).toContain('配置');
    });

    test('should have LICENSE file', async () => {
      const licensePath = path.join(projectRoot, 'LICENSE');

      expect(fs.existsSync(licensePath)).toBe(true);

      const content = fs.readFileSync(licensePath, 'utf-8');
      expect(content).toContain('MIT');
    });

    test('should have project-context.md for AI', async () => {
      const contextPath = path.join(projectRoot, 'project-context.md');

      expect(fs.existsSync(contextPath)).toBe(true);

      const content = fs.readFileSync(contextPath, 'utf-8');
      expect(content).toContain('Mocha');
      expect(content).toContain('Playwright');
    });

  });

  test.describe('Configuration', () => {

    test('should have config example file', async () => {
      const configPath = path.join(projectRoot, 'config', 'config.example.json');

      expect(fs.existsSync(configPath)).toBe(true);

      const content = fs.readFileSync(configPath, 'utf-8');

      // Should have placeholders for required fields
      expect(content).toContain('appId');
      expect(content).toContain('appSecret');
    });

  });

  test.describe('CLI Tool', () => {

    test('should have polyv CLI tool', async () => {
      const cliPath = path.join(projectRoot, 'skills', 'polyv-create-channel', 'scripts', 'polyv.js');

      expect(fs.existsSync(cliPath)).toBe(true);

      const content = fs.readFileSync(cliPath, 'utf-8');
      expect(content).toContain('loadConfig');
      expect(content).toContain('validateConfig');
    });

    test('should export required functions', async () => {
      const polyv = require(path.join(projectRoot, 'skills', 'polyv-create-channel', 'scripts', 'polyv.js'));

      expect(typeof polyv.loadConfig).toBe('function');
      expect(typeof polyv.validateConfig).toBe('function');
      expect(typeof polyv.formatError).toBe('function');
      expect(typeof polyv.maskSensitiveData).toBe('function');
    });

  });

  test.describe('Package Configuration', () => {

    test('should have correct package.json configuration', async () => {
      const packagePath = path.join(projectRoot, 'package.json');

      const content = fs.readFileSync(packagePath, 'utf-8');
      const pkg = JSON.parse(content);

      expect(pkg.name).toBe('polyv-skills');
      expect(pkg.license).toBe('MIT');
      expect(pkg.repository.url).toBe('https://github.com/terryso/polyv-skills.git');
      expect(pkg.engines.node).toBe('>=18.0.0');
    });

    test('should have .nvmrc file', async () => {
      const nvmrcPath = path.join(projectRoot, '.nvmrc');

      expect(fs.existsSync(nvmrcPath)).toBe(true);

      const content = fs.readFileSync(nvmrcPath, 'utf-8').trim();
      expect(content).toBe('23');
    });

  });

});
