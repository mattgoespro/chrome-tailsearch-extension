import path from "path";
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

export default (_: unknown, env: { mode: Configuration["mode"] }) => {
  const { mode } = env;

  if (initialStorageData == null) {
    console.warn(
      `Missing initial storage data in './initial-storage-data.json', default extension options won't be available.`
    );
  }

  const srcDir = path.resolve(__dirname, "src");
  const runtimeDir = path.join(srcDir, "runtime");
  const rendererDir = path.join(srcDir, "renderer");
  const outputDir = path.resolve(__dirname, "out");

  return {
    target: "web",
    mode,
    stats: "errors-warnings",
    devtool: mode === "development" ? "cheap-module-source-map" : false,
    entry: {
      background: path.join(runtimeDir, "background.ts"),
      "content-script": path.join(runtimeDir, "content-script.ts"),
      options: path.join(rendererDir, "options", "index.tsx"),
      popup: path.join(rendererDir, "popup", "index.tsx")
    },
    output: {
      path: outputDir,
      filename: "js/[name].js",
      clean: true
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
    plugins: [
      new EnvironmentPlugin({
        EXTENSION_STORAGE_INITIAL_DATA: JSON.stringify(initialStorageData)
      }),
      new ProvidePlugin({
        React: "react"
      }),
      new HtmlWebpackPlugin({
        filename: "options.html",
        template: path.join(rendererDir, "options", "index.html"),
        chunks: ["options"],
        excludeChunks: ["popup"],
        inject: "body",
        minify: mode === "production"
      }),
      new HtmlWebpackPlugin({
        filename: "popup.html",
        template: path.join(rendererDir, "popup", "index.html"),
        chunks: ["popup"],
        excludeChunks: ["options"],
        inject: "body",
        minify: mode === "production"
      }),
      new ForkTsCheckerWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(srcDir, "manifest.json"),
            to: outputDir,
            transform: (content) => {
              const manifestContent = JSON.parse(content.toString());
              delete manifestContent.$schema;

              if (mode === "development") {
                manifestContent.name += " (Dev)";
                manifestContent.description += " (Development Build)";
              }

              return JSON.stringify(manifestContent, null, 2);
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
    optimization:
      mode === "production"
        ? {
            minimize: true,
            minimizer: [
              new TerserWebpackPlugin({
                parallel: true,
                extractComments: true,
                terserOptions: {
                  compress: true
                }
              })
            ],
            splitChunks: {}
          }
        : undefined,
    performance:
      mode === "production" ? { maxEntrypointSize: 512000, maxAssetSize: 512000 } : undefined,
    cache: true
  } satisfies Configuration;
};
