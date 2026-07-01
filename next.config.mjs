/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Required to load instrumentation.js (New Relic agent) at server startup
  experimental: {
    instrumentationHook: true,
    // Prevent webpack from bundling newrelic in Next.js 14 (Next.js 15 uses serverExternalPackages)
    serverComponentsExternalPackages: ['newrelic'],
  },
};

export default nextConfig;
