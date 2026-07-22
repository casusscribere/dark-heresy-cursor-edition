import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/unit/**/*.test.mjs'],
        environment: 'node',
        setupFiles: ['tests/unit/mocks/foundry.mjs'],
        globals: false,
        reporters: ['default', 'json'],
        outputFile: {
            json: 'tests/.vitest-report.json',
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary'],
            include: ['module/**/*.mjs'],
            exclude: [
                'module/**/handlebars/**',
                'module/**/sheets/**',
                'module/**/prompts/**',
            ],
        },
    },
});
