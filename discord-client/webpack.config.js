module.exports = {
    resolve: {
      fallback: {
        "zlib": require.resolve("browserify-zlib"),
        "querystring": require.resolve("querystring-es3"),
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "fs": require.resolve("browserify-fs"),  // fs is not available in the browser
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "net": require.resolve("react-native-net-polyfill")
      }
    }
  };
  