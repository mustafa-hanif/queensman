module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    semi: 0,
    camelcase: 0,
    'comma-dangle': 0,
    'space-before-function-paren': 0
  }
}
