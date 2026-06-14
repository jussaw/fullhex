import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

// eslint-config-next ships native flat configs in Next 16 — import them directly
// (wrapping them in FlatCompat triggers a circular-structure crash).
const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'build/**', 'node_modules/**', 'next-env.d.ts'] },
  ...nextVitals,
  ...nextTs,
  // eslint-config-prettier disables stylistic rules that conflict with Prettier — keep last.
  prettier,
];

export default eslintConfig;
