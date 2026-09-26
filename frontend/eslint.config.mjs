import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // Standard "fetch on mount" effects (admin pages, useAuth, navbar scroll state) are safe;
      // this React Compiler lint rule flags them without distinguishing async-resolved setState.
      'react-hooks/set-state-in-effect': 'off',
      // react-hook-form's watch()/setValue() are intentionally excluded from compiler memoization.
      'react-hooks/incompatible-library': 'off',
    },
  },
];

export default eslintConfig;
