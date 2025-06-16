// TODO: this is still a work in progress a full example on how to use
// client side proving with noir will be provided soon
module.exports = {
  reactStrictMode: true,
  experimental: {
    // Mark WASM-related packages as external for server components
    serverComponentsExternalPackages: [
      '@noir-lang/acvm_js',
      '@noir-lang/noirc_abi', 
      '@noir-lang/noir_js',
      '@aztec/bb.js',
    ],
  },
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Server-specific configuration to avoid WASM bundling issues
    if (isServer) {
      // Add fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };

      // Prevent bundling of problematic WASM imports
      config.externals = config.externals || [];
      config.externals.push(
        // Specific WASM imports that cause issues
        '@noir-lang/acvm_js/nodejs/acvm_js.js',
        '@noir-lang/noirc_abi/nodejs/noirc_abi_wasm.js'
      );
    }

    return config;
  },
};
