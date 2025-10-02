// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   serverExternalPackages: ["@node-rs/argon2"]
// };

// export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     turbo: false, // désactive Turbopack
//   },
// }

// module.exports = nextConfig

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Configuration pour les modules WASM
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Gestion des fichiers WASM
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    // Configuration spécifique pour Argon2
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Ignorer les modules WASM problématiques côté client
    config.resolve.alias = {
      ...config.resolve.alias,
      '@node-rs/argon2-wasm32-wasi': false,
    };

    return config;
  },
  
  // Configuration pour les packages externes (serveur uniquement)
  serverExternalPackages: ['@node-rs/argon2'],
};

export default nextConfig;