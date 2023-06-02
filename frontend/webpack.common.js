const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const path = require("path");
require("dotenv").config();

module.exports = {
	entry: "./src/App.tsx",
	output: {
		path: path.resolve(__dirname, "public"),
		publicPath: "auto",
		filename: "[name].[contenthash].js",
		clean: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "index.html"),
			inject: true
			// favicon: "src/images/logo.svg"
		}),
		new webpack.DefinePlugin({
			"process.env": {
				API_URL: JSON.stringify(process.env.API_URL),
				ENCRYPTION_PASSWORD: JSON.stringify(
					process.env.ENCRYPTION_PASSWORD
				)
			}
		})
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				loader: "ts-loader"
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource"
			}
		]
	},
	resolve: {
		extensions: ["*", ".js", ".jsx", ".ts", ".tsx"]
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	}
};
