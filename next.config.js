/** @type {import('next').NextConfig} */

// CHANGE THIS to match your repo name exactly
const REPO_NAME = 'the-field-quad';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Set basePath for GitHub Pages URL structure
  basePath: isProd ? `/${REPO_NAME}` : '',
  assetPrefix: isProd ? `/${REPO_NAME}/` : '',
  
  // Required for static export
  images: {
    unoptimized: true,
  },
  
  // Helps with GitHub Pages routing
  trailingSlash: true,
  
  reactStrictMode: true,
  
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
