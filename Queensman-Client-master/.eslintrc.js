module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "babel-eslint",
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "prettier",
    "plugin:prettier/recommended", // Make sure this is always the last element in the array.
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
  plugins: ["react"],
  rules: {
    quotes: "off",
    "react/state-in-constructor": "off",
    "react/sort-comp": "off",
    "react/jsx-filename-extension": "off",
    "react/destructuring-assignment": "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": "warn",
    "react/jsx-props-no-spreading": "warn",
    "global-require": "off",
    "react/prop-types": "off",
    "react/no-unused-state": "warn",
  },
};
