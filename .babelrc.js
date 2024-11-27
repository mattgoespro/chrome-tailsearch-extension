/**
 * @type {import("babel-core").TransformOptions}
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
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-transform-object-rest-spread",
    "@babel/plugin-transform-destructuring",
    "@babel/plugin-transform-class-properties"
  ]
};
