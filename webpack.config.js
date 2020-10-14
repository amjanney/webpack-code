const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    modules: ["./node_modules", "./myLoaders"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "replaceLoader",
          },
          {
            loader: "replaaceLoaderAsync",
            options: {
              name: "Davy!!!",
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};
