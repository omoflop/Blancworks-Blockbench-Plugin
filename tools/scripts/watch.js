import rollup from "rollup";
import options from "../../config/dev.figura-plugin.rollup.config";
import fs from "fs";
import chalk from "chalk";
const watcher = rollup.watch(options);
let shouldTransform = false;
watcher.on("event", (event) => {
  switch (event.code) {
    case "START":
      console.log(chalk.green("building..."));
      shouldTransform = true;
      break;
    case "END":
      if (shouldTransform) {
        shouldTransform = false;
        console.log(chalk.green("transforming..."));
        fs.writeFileSync(
          "./dist/figura-plugin.js",
          `(()=>{\n${fs.readFileSync(
            "./dist/figura-plugin.js",
            "utf-8"
          )}\n})();\n`
            .replace(
              /BUILD_ID/g,
              '"dbb29fae73ce8a216b2d4f4e0da42a36fd348983cae2e96587463def059fee9a"'
            )
            .replace(
              /IN_DEV/g,
              '"dbb29fae73ce8a216b2d4f4e0da42a36fd348983cae2e96587463def059fee9a"'
            )
        );
        console.log(chalk.green("done!"));
      }
      break;
    case "BUNDLE_START":
      console.log(chalk.gray(`bundling ${event.input}...`));
      break;
    case "BUNDLE_END":
      console.log(chalk.gray(`done ${event.input}...`));
      break;
    case "ERROR":
      // console.log(chalk.gray(event.error.stack));
      console.log(chalk.red(event.error.message));
      break;
  }
});
