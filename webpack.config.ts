import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
import MiniCssExtractWebpackPlugin from "mini-css-extract-plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader");
export default {
  target: "web",
  stats: "errors-warnings",
  devtool: "cheap-module-source-map",
  entry: {
    background: path.join(__dirname, "src", "runtime", "background.ts"),
    "content-script": path.join(__dirname, "src", "content-script", "content-script.ts"),
    "settings-page": path.join(__dirname, "src", "renderer", "index.tsx")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "webextension-polyfill-ts": path.resolve(
        path.join(__dirname, "node_modules", "webextension-polyfill-ts")
      )
    },
    plugins: [new TsConfigPathsWebpackPlugin()]
  },
  module: {
    rules: [
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
              implementation: require("sass"),
              sassOptions: {
                includePaths: [path.resolve(__dirname, "src/webview/styles")]
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
      },
      {
        test: /\.[tj]sx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin({
      "process.env.TARGET_BROWSER": JSON.stringify(process.env.TARGET_BROWSER)
    }),
    new CleanWebpackPlugin({
      verbose: true
    }),
    new MiniCssExtractWebpackPlugin({
      filename: "css/[name].css"
    }),
    new HtmlWebpackPlugin({
      filename: "options.html",
      template: path.join(__dirname, "public", "settings-page.html"),
      inject: "body",
      chunks: ["settings-page"],
      hash: false
    }),
    new ForkTsCheckerWebpackPlugin({
      formatter: "basic"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "public", "manifest.json"),
          to: path.join(__dirname, "dist"),
          transform: (content: Buffer) => {
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
      cache: true,
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
    new ExtensionReloaderWebpackPlugin({
      port: 9090,
      reloadPage: true,
      manifest: path.join(__dirname, "public", "manifest.json"),
      entries: {
        background: "background",
        manifest: "manifest",
        contentScript: "content-script"
      }
    })
  ]
} satisfies Configuration;
