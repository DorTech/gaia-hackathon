const path = require("path");

module.exports = (args) => ({
  ...args,
  output: {
    libraryTarget: "commonjs2",
  },
  resolve: {
    ...args.resolve,
    alias: {
      ...args.resolve.alias,
      "class-transformer/cjs/storage": path.resolve(
        "../../node_modules/class-transformer/cjs/storage"
      ),
      "class-transformer": path.resolve(
        "../../node_modules/class-transformer/cjs"
      ),
    },
  },
  plugins: (args.plugins || []).filter(
    (plugin) => plugin.constructor?.name !== "ForkTsCheckerWebpackPlugin"
  ),
});
