module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        semi: 'off',
        'quote-props': ['warn', 'as-needed'],
        '@typescript-eslint/semi': ['warn', 'always', { omitLastInOneLineBlock: true }],
        '@typescript-eslint/member-delimiter-style': ['warn', {
            singleline: {
                requireLast: true
            }
        }],
        quotes: 'off',
        '@typescript-eslint/quotes': ['error', 'single']
    },
    ignorePatterns: ['dist', 'node_modules']
};