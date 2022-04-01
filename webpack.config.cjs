const path = require("path");

module.exports = {
  entry: "./src/OogyControllerManager.ts",
  mode: "none",
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
    filename: "oogy_controller_manager.js",
    path: path.resolve(__dirname, "dist"),
  },
};
