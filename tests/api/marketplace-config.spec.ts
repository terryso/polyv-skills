/**
 * ATDD Test Suite: Marketplace Configuration
 * Story: 1.1 - 创建项目结构和插件配置
 * TDD Phase: RED (failing tests)
 *
 * These tests verify the marketplace.json configuration for the polyv-skills plugin.
 * All tests use test.skip() to mark them as RED phase.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Marketplace Configuration - AC2', () => {
  test.skip('should have correct name in marketplace.json', async () => {
    const projectRoot = process.cwd();
    const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');

    const content = fs.readFileSync(marketplacePath, 'utf-8');
    const marketplace = JSON.parse(content);

    // AC2: name must be "polyv-skills"
    expect(marketplace.name).toBe('polyv-skills');
  });

  test.skip('should have owner configuration in marketplace.json', async () => {
    const projectRoot = process.cwd();
    const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');

    const content = fs.readFileSync(marketplacePath, 'utf-8');
    const marketplace = JSON.parse(content);

    // AC2: owner must be defined with name property
    expect(marketplace.owner).toBeDefined();
    expect(marketplace.owner.name).toBe('Nick');
  });

  test.skip('should have description in metadata', async () => {
    const projectRoot = process.cwd();
    const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');

    const content = fs.readFileSync(marketplacePath, 'utf-8');
    const marketplace = JSON.parse(content);

    // AC2: metadata must contain description
    expect(marketplace.metadata).toBeDefined();
    expect(marketplace.metadata.description).toContain('polyv');
  });

  test.skip('should have plugins array with correct structure', async () => {
    const projectRoot = process.cwd();
    const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');

    const content = fs.readFileSync(marketplacePath, 'utf-8');
    const marketplace = JSON.parse(content);

    // AC2: plugins array must exist with correct structure
    expect(marketplace.plugins).toBeDefined();
    expect(Array.isArray(marketplace.plugins)).toBe(true);
    expect(marketplace.plugins.length).toBeGreaterThan(0);

    const plugin = marketplace.plugins[0];
    expect(plugin.name).toBe('polyv-skills');
    expect(plugin.source).toBe('./');
    expect(plugin.license).toBe('MIT');
  });
});
