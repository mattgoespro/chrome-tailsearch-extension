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

if (initialStorageData == null) {
  console.warn(
    `Missing initial storage data in './initial-storage-data.json', data won\`t be set.`
  );
}

function getMode(mode: "development" | "production" | "none" | undefined) {
  switch (mode) {
    case undefined:
    case "none":
    case "development":
      return "development";
    case "production":
      return "production";
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

export default (_, env: { mode: "development" | "production" | "none" | undefined }) => {
  const mode = getMode(env.mode);

  return {
    target: "web",
    mode,
    stats: "errors-warnings",
    entry: {
      background: path.join(__dirname, "src", "runtime", "background.ts"),
      "content-script": path.join(__dirname, "src", "content-script", "content-script.ts"),
      settings: path.join(__dirname, "src", "renderer", "options", "index.tsx"),
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
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
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
            {
              loader: "sass-loader",
              options: {
                implementation: sass,
                sassOptions: {
                  includePaths: []
                }
              }
            },
            "postcss-loader"
          ],
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
          exclude: /node_modules/
        }
      ]
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
      // new TerserWebpackPlugin({
      //   include: /\.js$/,
      //   exclude: /node_modules/,
      //   parallel: true,
      //   terserOptions: {
      //     compress: false,
      //     mangle: false,
      //     sourceMap: true,
      //     format: {
      //       comments: false
      //     }
      //   },
      //   extractComments: false
      // }),
      new MiniCssExtractWebpackPlugin({
        filename: "css/[name].css"
      }),
      new HtmlWebpackPlugin({
        filename: "settings.html",
        template: path.join(__dirname, "public", "settings.html"),
        inject: "body",
        chunks: ["settings"],
        scriptLoading: "defer",
        hash: false
      }),
      new HtmlWebpackPlugin({
        filename: "popup.html",
        template: path.join(__dirname, "public", "popup.html"),
        inject: "body",
        chunks: ["popup"],
        scriptLoading: "defer",
        hash: false
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
            from: path.join(__dirname, "public", "manifest.json"),
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
        logo: path.join(__dirname, "public", "assets", "logo.png"),
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
            manifest: path.join(__dirname, "public", "manifest.json"),
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
