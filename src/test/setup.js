import * as matchers from '@testing-library/jest-dom/matchers'
// Vitest injects `expect` when `test.globals` is enabled.
// Using `globalThis` here avoids importing `vitest` from setup context.
globalThis.expect?.extend(matchers)

