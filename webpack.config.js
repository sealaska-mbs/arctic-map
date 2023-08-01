const ArcGISPlugin = require("@arcgis/webpack-plugin");
var webpack = require('webpack');
//
module.exports = {
  plugins: [
    new ArcGISPlugin(),
  ],
  module: {   
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-env']
            }
        }
      }
    ] 
  }
}