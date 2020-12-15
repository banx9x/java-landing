const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: path.join(__dirname, "src", "index.js"),
    },
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname, "build"),
    },
    devServer: {
        contentBase: path.join(__dirname, "build"),
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "./src/resources", to: "resources" }],
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.js$/,
                exclude: [path.join(__dirname, "node_modules")],
                use: ["babel-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg|ico)$/,
                exclude: [path.join(__dirname, "node_modules")],
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "/resources/images",
                            publicPath: "/resources/images",
                        },
                    },
                ],
            },
        ],
    },
};
