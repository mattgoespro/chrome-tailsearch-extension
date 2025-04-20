import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin, ProvidePlugin } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
import MiniCssExtractWebpackPlugin from "mini-css-extract-plugin";
import sass from "sass";
import { Issue } from "fork-ts-checker-webpack-plugin/lib/issue";
import initialStorageData from "./initial-storage-data.json";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader");

export default (_, env: { mode: "development" | "production" | "none" | undefined }) => {
  const { mode } = env;

  if (initialStorageData == null) {
    console.warn(
      `Missing initial storage data in './initial-storage-data.json', data won\`t be set.`
    );
  }

  const srcDir = path.resolve(__dirname, "src");
  const runtimeDor = path.join(srcDir, "runtime");
  const rendererDir = path.join(srcDir, "renderer");

  return {
    target: "web",
    mode,
    stats: "errors-warnings",
    devtool: mode === "development" ? "cheap-module-source-map" : false,
    entry: {
      background: path.join(__dirname, "src", "runtime", "background.ts"),
      "content-script": path.join(__dirname, "src", "content-script", "content-script.ts"),
      options: path.join(__dirname, "src", "renderer", "options", "index.tsx"),
      popup: path.join(__dirname, "src", "renderer", "popup", "index.tsx")
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      fallback: {
        crypto: false
      },
      plugins: [new TsConfigPathsWebpackPlugin()]
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          loader: "babel-loader",
          include: srcDir,
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractWebpackPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]"
                }
              }
            },
            "postcss-loader"
          ],
          include: srcDir,
          exclude: /node_modules/
        }
      ]
    },
    cache: {
      type: "filesystem",
      cacheDirectory: path.resolve(__dirname, ".buildcache")
    },
    plugins: [
      new EnvironmentPlugin({
        EXTENSION_STORAGE_INITIAL_DATA: JSON.stringify(initialStorageData)
      }),
      new ProvidePlugin({
        React: "react"
      }),
      new CleanWebpackPlugin({
        verbose: true
      }),
      new MiniCssExtractWebpackPlugin({
        filename: "css/[name].css"
      }),
      new HtmlWebpackPlugin({
        filename: "options.html",
        template: path.join(rendererDir, "options", "index.html"),
        inject: "body",
        chunks: ["options"],
        scriptLoading: "defer"
      }),
      new HtmlWebpackPlugin({
        filename: "popup.html",
        template: path.join(rendererDir, "popup", "index.html"),
        inject: "body",
        chunks: ["popup"],
        scriptLoading: "defer"
      }),
      new ForkTsCheckerWebpackPlugin({
        formatter: (issue: Issue) => {
          const { file, severity, code, message } = issue;
          return `${file} (${severity}): ${code} - ${message}`;
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(srcDir, "manifest.json"),
            to: path.join(__dirname, "dist"),
            transform: (content) => {
              const manifest = JSON.parse(content.toString());
              delete manifest["$schema"];
              return JSON.stringify(manifest, null, 2);
            }
          }
        ]
      }),
      new FaviconsWebpackPlugin({
        logo: path.join(srcDir, "assets", "logo.png"),
        mode: "webapp",
        favicons: {
          icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            windows: false,
            yandex: false,
            favicons: true
          }
        }
      }),
      mode === "development"
        ? new ExtensionReloaderWebpackPlugin({
            port: 9090,
            reloadPage: true,
            manifest: path.join(srcDir, "manifest.json"),
            entries: {
              background: "background",
              manifest: "manifest",
              contentScript: "content-script"
            }
          })
        : false
    ],
    externals: ["React"] // TODO: is this needed?
  } satisfies Configuration;
};
