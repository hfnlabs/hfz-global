const min = !!process.env.MIN_JS;

/** @type { import('webpack').Configuration } */
module.exports = {
  entry: "./src/index.ts",
  devtool: false,
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: min,
    usedExports: true,
    concatenateModules: true,
  },
  output: {
    filename: min ? "./index.min.js" : "./index.js",
  },
};
