/** @type {import('next').NextConfig} */
const path = require('path');

console.log("??? alias", path.join(__dirname, '../../src'));

module.exports = {
  webpack: (config) => {
    // Note: we provide webpack as an argument to the function
    // This is necessary because Next.js controls the version of webpack
  
    // Image optimization
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Path for 3D and Image resosources specififed in catalog
    config.module.rules.push({
      test: /.*catalog.*\.(mtl|obj)$/i,
      // test: /.*catalog.*\.(mtl|obj|png|jpe?g)$/i,
      type: 'asset/resource',
      generator: {
        filename: '[path][name][ext]',
        publicPath: '/',
      },
    });

    // extensions
    config.resolve.extensions.push('.js', '.jsx');

    // aliases
    config.resolve.alias['react-planner'] = path.join(__dirname, '../../src');

    // fallbacks
    config.resolve.fallback = {
      "crypto": false,
      "path": false,
      "fs": false,
      "os": false
    };

    images = {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          port: '',
          pathname: '/v0/b/luccid-mvp.appspot.com/o/**',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '',
        }
      ],
    };

    // TODO(pg): remove this when running is solved
    config.cache = false;

    // Important: return the modified config
    return config;
  },
};
