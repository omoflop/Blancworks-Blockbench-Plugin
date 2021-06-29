import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import url from "@rollup/plugin-url";
import yaml from "@rollup/plugin-yaml";
export default {
  input: "src/figura-plugin.js",
  output: {
    file: "dist/figura-plugin.js",
    format: "cjs",
    compact: true,
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
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    commonjs({
      include: ["node_modules/**"],
      ignoreGlobal: false,
      sourceMap: false
    }),
    resolve({
      jsnext: true,
    }),
    babel(),
    terser(),
  ],
};
