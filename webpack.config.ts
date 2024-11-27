import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader");

export default {
  target: "web",
  stats: "errors-warnings",
  devtool: "cheap-module-source-map",
  entry: {
    options: "src/renderer/options.ts",
    background: "src/runtime/background.ts",
    "content-script": "src/content-script/content-script.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"],
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
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(js|ts)x?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  plugins: [
    new EnvironmentPlugin({
      "process.env.TARGET_BROWSER": JSON.stringify(process.env.TARGET_BROWSER)
    }),
    new CleanWebpackPlugin({
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: "options.html",
      template: path.join(__dirname, "src", "renderer", "options.html"),
      inject: "body",
      chunks: ["options"],
      hash: false
    }),
    new ForkTsCheckerWebpackPlugin({
      formatter: "basic"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src", "manifest.json"),
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
      manifest: path.join(__dirname, "src", "manifest.json"),
      entries: {
        background: "background",
        manifest: "manifest",
        contentScript: "content-script"
      }
    })
  ]
} satisfies Configuration;
