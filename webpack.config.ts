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

export default (_, env: { mode: Configuration["mode"] }) => {
  const { mode } = env;

  if (initialStorageData == null) {
    console.warn(
      `Missing initial storage data in './initial-storage-data.json', default extension options won't be available.`
    );
  }

  const srcDir = path.resolve(__dirname, "src");
  const runtimeDir = path.join(srcDir, "runtime");
  const rendererDir = path.join(srcDir, "renderer");

  return {
    target: "web",
    mode,
    stats: "errors-warnings",
    devtool: mode === "development" ? "source-map" : false,
    entry: {
      background: path.join(runtimeDir, "background.ts"),
      "content-script": path.join(runtimeDir, "content-script.ts"),
      options: path.join(rendererDir, "options", "index.tsx"),
      popup: path.join(rendererDir, "popup", "index.tsx")
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].js",
      clean: mode === "production"
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
    externals: ["React"], // TODO: is this needed?
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
        chunks: ["options", "renderer.shared"],
        excludeChunks: ["popup"],
        inject: "body",
        minify: mode === "production"
      }),
      new HtmlWebpackPlugin({
        filename: "popup.html",
        template: path.join(rendererDir, "popup", "index.html"),
        chunks: ["popup", "renderer.shared"],
        excludeChunks: ["options"],
        inject: "body",
        minify: mode === "production"
      }),
      new ForkTsCheckerWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(srcDir, "manifest.json"),
            to: path.join(__dirname, "dist"),
            transform: (content) => {
              const manifestContent = JSON.parse(content.toString());

              return JSON.stringify(
                {
                  ...manifestContent,
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
    optimization:
      mode === "production"
        ? {
            minimize: true,
            minimizer: [
              new TerserWebpackPlugin({
                parallel: true,
                extractComments: false,
                include: /\.js$/,
                terserOptions: {
                  compress: true,
                  mangle: true,
                  format: {
                    braces: true,
                    max_line_len: 1000
                  }
                }
              })
            ],
            concatenateModules: true,
            splitChunks: {
              chunks: "all",
              cacheGroups: {
                default: false,
                vendors: false,
                rendererShared: {
                  name: "renderer.shared",
                  test: /[\\/]renderer[\\/]shared[\\/]/,
                  chunks: "all",
                  enforce: true
                },
                renderer: {
                  name: "renderer",
                  test: /[\\/]renderer[\\/]/,
                  chunks: "all",
                  enforce: true
                },
                mui: {
                  name: "mui",
                  test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
                  chunks: "all",
                  enforce: true
                },
                react: {
                  name: "react",
                  test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                  chunks: "all",
                  enforce: true // Ensure React and ReactDOM are in a separate chunk
                }
              }
            }
          }
        : undefined,
    cache: {
      type: "filesystem",
      cacheDirectory: path.resolve(__dirname, ".buildcache")
    }
  } satisfies Configuration;
};
