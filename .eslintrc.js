module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  rules: {
    'no-use-before-define': ['error', {
      functions: false,
      classes: true,
      variables: true,
    }],
  },
};
