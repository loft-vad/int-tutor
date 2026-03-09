import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @param {string} phase */
export default async function nextConfig(phase) {
  // Only load serwist in non-development or when needed
  const withSerwist =
    phase === PHASE_DEVELOPMENT_SERVER
      ? (config) => config
      : (await import('@serwist/next')).default({
          swSrc: 'src/app/sw.ts',
          swDest: 'public/sw.js',
          reloadOnOnline: true,
        });

  return withSerwist({
    reactStrictMode: true,
    output: 'export',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
    images: {
      unoptimized: true,
    },
  });
}
