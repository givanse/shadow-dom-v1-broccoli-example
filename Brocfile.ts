import BroccoliCustomElements from "broccoli-custom-elements";
import rollup from "broccoli-rollup";
const mergeTrees = require("broccoli-merge-trees");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const funnel = require("broccoli-funnel");
const commonjs = require("rollup-plugin-commonjs");

export default function(/*options*/) {

  const staticFiles = funnel("src", {
    include: [
      "index.html"
    ]
  });

  const ce = new BroccoliCustomElements("src/custom-elements");

  const extensions = [".js", ".ts"];

  const js = rollup(".", {
    rollup: {
      input: "src/index.ts",
      output: [
        {
          file: "bundle.iife.js",
          name: "customElements",
          format: "iife",
          sourcemap: true,
        },
      ],
      plugins: [
        commonjs(),
        resolve({extensions}),
        babel({extensions})
      ],
    }
  });

  return mergeTrees([staticFiles, js, ce]);
}
