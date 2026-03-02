/**
 * E2E Test Suite: Plugin Installation
 * Tests verify the plugin installation workflow and file structure.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Plugin Installation E2E Tests', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  describe('Plugin Structure', () => {
    it('should have valid marketplace.json', () => {
      const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');

      assert.ok(fs.existsSync(marketplacePath), 'marketplace.json should exist');

      const content = fs.readFileSync(marketplacePath, 'utf-8');
      const marketplace = JSON.parse(content);

      assert.ok(marketplace.plugins, 'plugins array should exist');
      assert.ok(marketplace.plugins.length > 0, 'plugins array should not be empty');

      const plugin = marketplace.plugins[0];
      assert.strictEqual(plugin.name, 'polyv-skills', 'plugin name should be polyv-skills');
    });

    it('should have valid plugin.json', () => {
      const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');

      assert.ok(fs.existsSync(pluginPath), 'plugin.json should exist');

      const content = fs.readFileSync(pluginPath, 'utf-8');
      const plugin = JSON.parse(content);

      assert.strictEqual(plugin.name, 'polyv-skills', 'plugin name should be polyv-skills');
      assert.ok(plugin.skills, 'skills array should exist');
    });

    it('should have skills directory', () => {
      const skillsPath = path.join(projectRoot, 'skills');

      assert.ok(fs.existsSync(skillsPath), 'skills directory should exist');
      assert.ok(fs.statSync(skillsPath).isDirectory(), 'skills should be a directory');
    });
  });

  describe('Documentation', () => {
    it('should have README with installation instructions', () => {
      const readmePath = path.join(projectRoot, 'README.md');

      assert.ok(fs.existsSync(readmePath), 'README.md should exist');

      const content = fs.readFileSync(readmePath, 'utf-8');

      // Verify all installation methods are documented
      assert.ok(content.includes('Claude Code'), 'should mention Claude Code');
      assert.ok(content.includes('npx skills'), 'should mention npx skills');
      assert.ok(content.includes('Git Submodule'), 'should mention Git Submodule');
      assert.ok(content.includes('Clone'), 'should mention Clone');
    });

    it('should have AGENTS.md with usage instructions', () => {
      const agentsPath = path.join(projectRoot, 'AGENTS.md');

      assert.ok(fs.existsSync(agentsPath), 'AGENTS.md should exist');
    });

    it('should have LICENSE file', () => {
      const licensePath = path.join(projectRoot, 'LICENSE');

      assert.ok(fs.existsSync(licensePath), 'LICENSE should exist');
    });
  });

  describe('Configuration', () => {
    it('should have config example file', () => {
      const configPath = path.join(projectRoot, 'config', 'config.example.json');

      assert.ok(fs.existsSync(configPath), 'config.example.json should exist');

      const content = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content);

      // Should have placeholders for required fields
      assert.ok(content.includes('appId'), 'should mention appId');
      assert.ok(content.includes('appSecret'), 'should mention appSecret');
    });
  });

  describe('CLI Tool', () => {
    it('should have polyv CLI tool', () => {
      const cliPath = path.join(projectRoot, 'tools', 'clis', 'polyv.js');

      assert.ok(fs.existsSync(cliPath), 'polyv.js should exist');
    });

    it('should export required functions', () => {
      const polyv = require(path.join(projectRoot, 'tools', 'clis', 'polyv.js'));

      assert.ok(typeof polyv.loadConfig === 'function', 'loadConfig should be a function');
      assert.ok(typeof polyv.validateConfig === 'function', 'validateConfig should be a function');
      assert.ok(typeof polyv.formatError === 'function', 'formatError should be a function');
      assert.ok(typeof polyv.maskSensitiveData === 'function', 'maskSensitiveData should be a function');
    });
  });
});
