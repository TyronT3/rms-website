export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        document: "readonly",
        getComputedStyle: "readonly",
        IntersectionObserver: "readonly",
        localStorage: "readonly",
        window: "readonly",
      },
    },
    rules: {
      "no-constant-condition": "warn",
      "no-redeclare": "error",
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          args: "none",
          caughtErrors: "none",
        },
      ],
    },
  },
];
