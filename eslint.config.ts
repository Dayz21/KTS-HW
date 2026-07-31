import path from 'node:path';
import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';
import importX from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import TsParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Linter.Config[] = tseslint.config(
  // Global ignores
  {
    ignores: [
      'dist/**',
      'public/**',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      '*.config.mts',
      '*-env.d.ts',
    ],
  },

  // Base configs
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Global settings for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: TsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.scss', '.svg'],
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: path.resolve(__dirname, './tsconfig.json'),
        }),
      ],
      'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
      react: {
        version: 'detect',
      },
    },
  },

  // TypeScript & React files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@stylistic': stylistic,
      'import-x': importX,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // ═══════════════════════════════════════════════════════════════════════
      // Layout & Formatting (@stylistic)
      // ═══════════════════════════════════════════════════════════════════════
      '@stylistic/array-bracket-newline': ['error', { multiline: true }],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/func-call-spacing': ['error', 'never'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': 'off',
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/line-comment-position': 'off',
      '@stylistic/lines-around-comment': [
        'warn',
        {
          beforeBlockComment: true,
          allowBlockStart: true,
          allowArrayStart: true,
          allowObjectStart: true,
          allowClassStart: true,
          allowEnumStart: true,
          allowInterfaceStart: true,
          allowTypeStart: true,
          allowModuleStart: true,
        },
      ],
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      '@stylistic/max-len': [
        'warn',
        {
          code: 100,
          tabWidth: 2,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
      '@stylistic/new-parens': 'error',
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/object-curly-newline': ['error', { consistent: true }],
      '@stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/operator-linebreak': [
        'error',
        'after',
        { overrides: { '?': 'before', ':': 'before' } },
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['block', 'block-like', 'return', 'class', 'export', 'for', 'while', 'if'],
        },
        {
          blankLine: 'always',
          prev: ['block', 'block-like', 'const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-spacing': 'error',
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/switch-colon-spacing': ['error', { after: true, before: false }],
      '@stylistic/template-curly-spacing': 'error',
      '@stylistic/template-tag-spacing': 'error',

      // ═══════════════════════════════════════════════════════════════════════
      // Suggestions (core ESLint rules)
      // ═══════════════════════════════════════════════════════════════════════
      'consistent-return': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'max-classes-per-file': 'error',
      'new-cap': ['error', { newIsCap: true }],
      'no-alert': 'error',
      'no-bitwise': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-else-return': 'error',
      'no-implicit-coercion': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      'no-negated-condition': 'error',
      'no-param-reassign': 'error',
      'no-redeclare': 'off', // Using @typescript-eslint/no-redeclare
      'no-sequences': 'error',
      'no-shadow': 'off', // Using @typescript-eslint/no-shadow
      'no-unneeded-ternary': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      yoda: 'error',

      // ═══════════════════════════════════════════════════════════════════════
      // Import plugin (import-x)
      // ═══════════════════════════════════════════════════════════════════════
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: { order: 'asc' },
          'newlines-between': 'always',
        },
      ],
      'import-x/default': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-relative-packages': 'error',
      'import-x/no-useless-path-segments': 'error',
      'import-x/no-self-import': 'error',
      'import-x/first': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'error',

      // ═══════════════════════════════════════════════════════════════════════
      // Prettier
      // ═══════════════════════════════════════════════════════════════════════
      'prettier/prettier': 'error',

      // ═══════════════════════════════════════════════════════════════════════
      // React
      // ═══════════════════════════════════════════════════════════════════════
      'react/prop-types': 'off',
      'react/boolean-prop-naming': 'error',
      'react/hook-use-state': 'error',
      'react/no-children-prop': 'error',
      'react/no-multi-comp': 'error',
      'react/no-this-in-sfc': 'error',
      'react/no-typos': 'error',
      'react/no-unused-state': 'error',
      'react/jsx-boolean-value': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/prefer-stateless-function': 'error',
      'react/display-name': 'off',

      // ═══════════════════════════════════════════════════════════════════════
      // React Hooks
      // ═══════════════════════════════════════════════════════════════════════
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ═══════════════════════════════════════════════════════════════════════
      // TypeScript
      // ═══════════════════════════════════════════════════════════════════════
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: ['parameter'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['typeProperty', 'objectLiteralProperty'],
          format: ['camelCase', 'snake_case', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['memberLike'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: ['memberLike'],
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: ['memberLike'],
          modifiers: ['protected'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: ['classProperty'],
          modifiers: ['readonly'],
          types: ['boolean', 'number', 'string', 'array'],
          format: ['UPPER_CASE'],
        },
        {
          selector: ['classProperty'],
          modifiers: ['private', 'readonly'],
          types: ['boolean', 'number', 'string', 'array'],
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'require',
        },
        {
          selector: ['classProperty'],
          modifiers: ['protected', 'readonly'],
          types: ['boolean', 'number', 'string', 'array'],
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'require',
        },
        {
          selector: ['variable'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: ['typeLike'],
          format: ['PascalCase'],
        },
        {
          selector: ['import'],
          format: ['PascalCase', 'camelCase'],
        },
        {
          selector: ['default'],
          format: ['camelCase'],
        },
      ],
    },
  },

  // Prettier must be last to override conflicting rules
  prettier,
) as Linter.Config[];

export default config;
