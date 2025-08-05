module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attributes-order': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/require-default-prop': 'off'
  },
  ignorePatterns: ['dist/**', '.nuxt/**', '.output/**']
}