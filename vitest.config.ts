/// <reference types="vitest/config" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [...configDefaults.exclude],
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
    typecheck: {
      tsconfig: "tsconfig.test.json",
      exclude: [
        'coverage/**',
        'dist/**',
        '**\/[.]**',
        'packages/*\/test?(s)/**',
        '**\/*.d.ts',
        '**\/virtual:*',
        '**\/__x00__*',
        // '**\/\x00*',
        'cypress/**',
        // 'test?(s)/**',
        // 'test?(-*).?(c|m)[jt]s?(x)',
        // '**\/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)',
        '**\/__tests__/**',
        '**\/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**\/vitest.{workspace,projects}.[jt]s?(on)',
        '**\/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
      ],
      enabled: true,
      ignoreSourceErrors: true,
    },
  },
})
