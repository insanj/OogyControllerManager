const path = require("path");

module.exports = {
  entry: {
    oogycontrollermanager: "./src/index.ts",
  },
  target: "web",
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "ts",
              target: "es2021",
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "oogy_controller_manager.js",
    path: path.resolve(__dirname, "dist"),
  },
};
