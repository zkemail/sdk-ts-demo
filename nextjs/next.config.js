module.exports = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        '*.wasm': {
          loaders: ['file-loader'],
          as: '*.wasm',
        },
      },
    },
    // Mark WASM-related packages as external for server components
    serverComponentsExternalPackages: [
      '@noir-lang/acvm_js',
      '@noir-lang/noirc_abi', 
      '@noir-lang/noir_js',
      '@aztec/bb.js',
    ],
  },
};
