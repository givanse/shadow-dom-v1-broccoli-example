import BroccoliCustomElements from "broccoli-custom-elements";
const mergeTrees = require("broccoli-merge-trees");
const funnel = require("broccoli-funnel");
//const babel = require("rollup-plugin-babel");
//const resolve = require("rollup-plugin-node-resolve");
//const commonjs = require("rollup-plugin-commonjs");

export default function(/*options*/) {

  const staticFiles = funnel("src", {
    include: [
      "index.html"
    ],
    annotation: "Static Files"
  });

  //const extensions = [".js", ".ts"];

  /*const rollupConfig = {
    input: "src/index.ts",
    output: [
      {
        file: "bundle.iife.js",
        name: "customElements",
        format: "iife",
        sourcemap: false,
      },
    ],
    plugins: [
      commonjs(),
      resolve({extensions}),
      babel({extensions})
    ],
  };*/

  const customElements = new BroccoliCustomElements("src/custom-elements");

  return mergeTrees([staticFiles, customElements]);
}
