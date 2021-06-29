import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import url from "@rollup/plugin-url";
import yaml from "@rollup/plugin-yaml";
export default {
  input: "src/figura-plugin.js",
  output: {
    file: "dist/figura-plugin.js",
    format: "cjs",
  },
  plugins: [
    yaml(),
    url({
      include: [
        "**/*.svg",
        "**/*.png",
        "**/*.jpg",
        "**/*.gif",
        "**/*.obj",
        "**/*.css",
      ],
    }),
    commonjs({
      include: ["node_modules/**"],
      ignoreGlobal: false,
      sourceMap: false
    }),
    resolve({
      jsnext: true,
      main: true,
    }),
    babel({}),
  ],
};
