import rollup from "rollup";
import options from "../../config/prod.figura-plugin.rollup.config";
import fs from "fs";
import crypto from "crypto";
(async () => {
  const bundle = await rollup.rollup(options);
  function makeBanner(lines) {
    const longest = Math.max(...lines.map((line) => line.length));
    const top = `/*${"*".repeat(longest)}*\\`;
    const bottom = `\\*${"*".repeat(longest)}*/`;
    const res = [
      top,
      ...lines.map((line) => {
        return `| ${line}${" ".repeat(longest - line.length)} |`;
      }),
      bottom,
    ];
    return res.join("\n");
  }
  const { output } = await bundle.generate(options.output);
  const header = fs.readFileSync("./HEADER.txt", "utf-8");
  const licence = fs.readFileSync("./LICENSE", "utf-8");
  for (const chunk of output) {
    const id = crypto.createHash("sha256").update(chunk.code).digest("hex");
    fs.writeFileSync(
      "./dist/figura-plugin.js",
      [
        "\n\n\n",
        makeBanner(licence.split("\n").map((_) => _.replace(/[\n\r]/g, ""))),
        "\n\n\n",
        "(()=>{",
        makeBanner(header.split("\n").map((_) => _.trim())),
        "\n\n\n",
        chunk.code
          .replace(/BUILD_ID/g, '"' + id + '"')
          .replace(
            /IN_DEV/g,
            '"dbb29fae73ce8a216b2d4f4e0da42a36fd348983cae2e96587463def059fee9a"'
          ),
        "})();",
      ].join("\n")
    );
    console.log("BUILD-ID:", id);
  }
})();
