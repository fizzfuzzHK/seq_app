const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path')

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/client/index.html",
  filename: "./index.html"
});
 module.exports = {
  entry: {
    main: "./src/client/index.js",
    worker:"./src/client/worker.js"
 },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ["@babel/react", {
                  useBuiltIns: "entry",
                  corejs: 2
                }]
                ]
              }
            },
    
      ]},
      {
        test: /\.wav$/,
        use: [
          {
              loader: 'file-loader',
              options: {
                
              }
          }
      ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [htmlWebpackPlugin]
}; 