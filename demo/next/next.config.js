/** @type {import('next').NextConfig} */
const path = require('path');

console.log("### alias", path.join(__dirname, '../src'));

module.exports = {
  webpack: (config) => {
    // Note: we provide webpack as an argument to the function
    // This is necessary because Next.js controls the version of webpack
    
    // extensions
    config.resolve.extensions.push('.js', '.jsx');

    // aliases
    config.resolve.alias['react-planner'] = path.join(__dirname, '../src');

    // fallbacks
    config.resolve.fallback = {
      "crypto": false,
      "path": false,
      "fs": false,
      "os": false
    };

    // Important: return the modified config
    return config;
  },
};
