/**
 * Next.js Instrumentation Hook
 * This file is loaded by Next.js before any other server-side code.
 * We use it to initialise the New Relic Node.js agent so that ALL
 * API route handlers, middleware, and server components are instrumented.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on the Node.js server runtime (not Edge runtime).
  // Use require() — newrelic is a CJS module and must NOT be bundled by webpack.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    require('newrelic');
    console.log('[New Relic] Agent initialised for VoxNova backend');
  }
}
