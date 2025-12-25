/** @type {import('next').NextConfig} */

const REPO_NAME = 'the-field-quad';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // For Next.js 12, we use 'next export' command instead of output: 'export'
  
  basePath: isProd ? `/${REPO_NAME}` : '',
  assetPrefix: isProd ? `/${REPO_NAME}/` : '',
  
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
  reactStrictMode: true,
  
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('ergo-lib-wasm-browser');
    }

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
