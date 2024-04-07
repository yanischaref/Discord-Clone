module.exports = {
    // ... other configuration options
    resolve: {
      fallback: {
        // Map missing Node.js core modules to their polyfills
        fs: false, // You won't need fs in a browser-only environment
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        zlib: require.resolve("browserify-zlib"),
        http: require.resolve("stream-http"),
        querystring: require.resolve("querystring-es3"),
        async_hooks: false, // Likely not needed in your case
      }
    }
  };
  