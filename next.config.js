/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle Node.js built-in modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: 'mock',
        child_process: false,
      };
    }

    // Handle WebAssembly modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  
  // Mark firebase-admin as an external package that shouldn't be bundled
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin', '@google-cloud/firestore'],
  },
  
  // Disable server-side rendering for pages that use firebase-admin
  // This ensures firebase-admin only runs on the server
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
