import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin, ProvidePlugin } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
import initialStorageData from "./options.extension.json";
import TerserWebpackPlugin from "terser-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader");

export default (_, env: { mode: Configuration["mode"] }) => {
  const { mode } = env;

  if (initialStorageData == null) {
    console.warn(
      `Missing initial storage data in './initial-storage-data.json', default extension options won't be available.`
    );
  }

  const srcDir = path.resolve(__dirname, "src");
  const contentScriptDir = path.join(srcDir, "content-script");
  const runtimeDir = path.join(srcDir, "runtime");
  const rendererDir = path.join(srcDir, "renderer");

  return {
    target: "web",
    mode,
    stats: "errors-warnings",
    devtool: "inline-source-map",
    entry: {
      background: path.join(runtimeDir, "background.ts"),
      "content-script": path.join(contentScriptDir, "content-script.ts"),
      options: path.join(rendererDir, "options", "index.tsx"),
      popup: path.join(rendererDir, "popup", "index.tsx")
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [new TsConfigPathsWebpackPlugin()]
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          loader: "babel-loader",
          include: srcDir,
          exclude: /(node_modules)|(dist)/
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
      new ForkTsCheckerWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(srcDir, "manifest.json"),
            to: path.join(__dirname, "dist"),
            transform: (content) => {
              const manifest = JSON.parse(content.toString());
              return JSON.stringify(
                {
                  ...manifest,
                  schema: undefined
                },
                null,
                2
              );
            }
          }
        ]
      }),
      new FaviconsWebpackPlugin({
        logo: path.join(srcDir, "assets", mode === "production" ? "logo.png" : "logo-dev.png"),
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
    externals: ["React"], // TODO: is this needed?
    optimization: {
      minimize: mode === "production",
      minimizer: [
        new TerserWebpackPlugin({
          parallel: true,
          extractComments: false,
          include: /\.js$/,
          terserOptions: {
            compress: mode === "production",
            mangle: mode === "production",
            output: {
              comments: false
            }
          }
        })
      ]
    }
  } satisfies Configuration;
};
