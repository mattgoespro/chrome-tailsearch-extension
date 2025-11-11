/**
 * @type { import("babel-core").TransformOptions }
 */
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-object-rest-spread",
    "@babel/plugin-transform-destructuring",
    "@babel/plugin-transform-class-properties"
  ]
};
