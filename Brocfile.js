const BroccoliCustomElements = require("broccoli-custom-elements").default;
const mergeTrees = require("broccoli-merge-trees");
const funnel = require("broccoli-funnel");
const broccoliRollup = require("broccoli-rollup");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const multiEntry = require("rollup-plugin-multi-entry");
const BroccoliRegisterElements = require("./broccoli-register-elements.js");
const concat = require("broccoli-concat");

module.exports = function(/*options*/) {

  const staticFiles = funnel("src", {
    include: [
      "index.html"
    ],
    annotation: "Static Files"
  });

  const extensions = [".ts"];

  //TODO continue experiment later  
  /*
  const registerElements = new BroccoliRegisterElements(["src"], {
    name: "Register Elements",
    annotation: "Register Elements",
  });
  */

  const rollupConfig = {
    input: [
      "custom-elements/**/*.ts",
      "register-elements.ts"
    ],
    output: [
      {
        name: "customElements",
        file: "custom-elements.iife.js",
        format: "iife",
        sourcemap: false,
        banner: "<script>",
        footer: "</script>"
      },
    ],
    plugins: [
      multiEntry(),
      commonjs(),
      resolve(extensions),
      babel({
        extensions,
        presets: [
          "@babel/preset-env",
          "@babel/preset-typescript",
        ],
        plugins: [
          "@babel/plugin-proposal-class-properties"
        ]
      }),
    ],
  }
  const js = broccoliRollup("src", {
    name: "Custom Elements JS",
    annotation: "Custom Elements JS",
    rollup: rollupConfig
  });

  const customElements = new BroccoliCustomElements("src/custom-elements");

  const bundles = mergeTrees([customElements, js]);
  const customElementsHTML = concat(bundles, {
    outputFile: "custom-elements.html",
  });

  return mergeTrees([staticFiles, customElementsHTML]);
};
