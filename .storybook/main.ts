import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.resolve(dirname, '../src');

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      base: process.env.STORYBOOK_BASE_PATH || '/',
      plugins: [
        svgr({
          svgrOptions: {
            ref: true,
            memo: true,
            plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          },
        }),
      ],
      resolve: {
        alias: {
          components: path.join(srcPath, 'components'),
          pages: path.join(srcPath, 'pages'),
          store: path.join(srcPath, 'store'),
          styles: path.join(srcPath, 'styles'),
          types: path.join(srcPath, 'types'),
          utils: path.join(srcPath, 'utils'),
          hooks: path.join(srcPath, 'hooks'),
        },
      },
      css: {
        modules: {
          generateScopedName: '[name]__[local]__[hash:base64:5]',
        },
      },
    });
  },
};

export default config;
