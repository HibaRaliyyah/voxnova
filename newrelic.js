'use strict';

/**
 * New Relic agent configuration.
 * See https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration/
 */
exports.config = {
  /**
   * Application name displayed in the New Relic UI.
   */
  app_name: ['VoxNova'],

  /**
   * Your New Relic license key.
   * Hardcoded here because --require newrelic runs before Next.js loads .env.local,
   * so process.env.NEW_RELIC_LICENSE_KEY would be undefined at agent startup.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY || '436dbb79973c4dba15611989de02ed6a6074NRAL',

  /**
   * Logging level. Levels: trace | debug | info | warn | error
   */
  logging: {
    level: 'info',
    filepath: 'stdout',
  },

  /**
   * Distributed tracing — enable for full request traces across services.
   */
  distributed_tracing: {
    enabled: true,
  },

  /**
   * Track all API route response times & errors.
   */
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    record_sql: 'obfuscated',
  },

  /**
   * Capture slow queries in the trace details.
   */
  slow_sql: {
    enabled: true,
  },

  /**
   * Error collector — sends unhandled exceptions + caught errors to New Relic.
   */
  error_collector: {
    enabled: true,
    ignore_status_codes: [404],
  },

  /**
   * Apdex target (seconds). Requests under this threshold are "Satisfied".
   */
  apdex_t: 0.5,
};
