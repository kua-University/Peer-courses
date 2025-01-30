//babel.config.js

module.exports = {
    presets: [
        'next/babel',  // Preset for Next.js
        '@babel/preset-react',  // Support for React
        ['@babel/preset-typescript', { "runtime": "automatic" }]
        // Support for TypeScript
    ],
    "plugins": ["@babel/plugin-transform-react-jsx"]
};
