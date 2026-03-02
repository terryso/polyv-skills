/**
 * Test Data Fixtures for polyv-skills ATDD Tests
 *
 * These fixtures provide test data for the test suites.
 * Uses faker for unique data generation.
 */

import { faker } from '@faker-js/faker';

/**
 * Creates a valid marketplace configuration object for testing
 */
export const createMarketplaceConfig = (overrides: Partial<{
  name: string;
  owner: { name: string };
  metadata: { description: string };
  plugins: Array<{
    name: string;
    source: string;
    description: string;
    homepage: string;
    license: string;
    keywords: string[];
  }>;
}> = {}) => ({
  name: faker.company.name(),
  owner: {
    name: faker.person.fullName(),
  },
  metadata: {
    description: faker.lorem.sentence(),
  },
  plugins: [
    {
      name: 'polyv-skills',
      source: './',
      description: 'polyv API Skills Collection',
      homepage: faker.internet.url(),
      license: 'MIT',
      keywords: ['polyv', 'live-streaming', 'api'],
    },
  ],
  ...overrides,
});

/**
 * Creates a valid plugin configuration object for testing
 */
export const createPluginConfig = (overrides: Partial<{
  name: string;
  version: string;
  description: string;
  skills: string[];
  keywords: string[];
}> = {}) => ({
  name: 'polyv-skills',
  version: '1.0.0',
  description: faker.lorem.sentence(),
  skills: ['./skills/'],
  keywords: ['polyv', 'live-streaming', 'api'],
  ...overrides,
});

/**
 * Creates a complete project structure for testing
 */
export const createProjectStructure = () => {
  return {
    claudePlugin: {
      marketplace: createMarketplaceConfig(),
      plugin: createPluginConfig(),
    },
    skills: {},
    tools: {
      clis: {},
      integrations: {},
      registry: '# Tool Registry\n',
    },
    readme: '# polyv-skills\n',
    agents: '# Agent Usage\n',
    gitignore: 'node_modules/\n',
    license: 'MIT License\n',
    config: {
      example: '{}\n',
    },
  };
};
