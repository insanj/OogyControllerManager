const path = require("path");

module.exports = {
  entry: "./OogyControllerManager.ts",
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "esbuild-loader",
        exclude: /node_modules/,
        options: {
          loader: "ts",
          target: "es2021",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "OogyControllerManager.js",
    path: path.resolve(__dirname, "../dist"),
  },
};
