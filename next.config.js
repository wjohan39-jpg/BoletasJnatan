const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Scoped to this project's own Storage bucket only (not the whole
    // firebasestorage.googleapis.com host) to close a known Next.js image
    // optimizer vulnerability where an open remote-image allowlist lets an
    // attacker point the optimizer at arbitrary files under the same host.
    remotePatterns: storageBucket
      ? [
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            pathname: `/v0/b/${storageBucket}/o/**`,
          },
        ]
      : [],
  },
};

module.exports = nextConfig;
