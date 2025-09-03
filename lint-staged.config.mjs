import path from 'node:path';

export default {
  '**/*.{ts,tsx}': (files) => {
    const relativePaths = files.map((file) => path.relative(process.cwd(), file));
    return [
      `eslint --no-warn-ignored ${relativePaths.join(' ')}`,
      `prettier --write ${relativePaths.join(' ')}`,
    ];
  },
  '**/*.css': (files) => {
    const relativePaths = files.map((file) => path.relative(process.cwd(), file));
    return [`prettier --write ${relativePaths.join(' ')}`];
  },
};
