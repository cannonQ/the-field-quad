/** @type {import('next').NextConfig} */

const REPO_NAME = 'the-field-quad';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${REPO_NAME}` : '',
  assetPrefix: isProd ? `/${REPO_NAME}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  
  // Critical: Handle WASM files properly
  webpack: (config, { isServer }) => {
    // WASM experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Prevent ergo-lib-wasm from being bundled server-side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('ergo-lib-wasm-browser');
    }

    // Fallbacks for client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
