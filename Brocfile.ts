const WebComponents = require("broccoli-web-components");
const funnel = require("broccoli-funnel");
const mergeTrees = require("broccoli-merge-trees");
const Rollup = require("broccoli-rollup");
const babel = require("rollup-plugin-babel");

export default function(/*options*/) {

  const staticFiles = funnel("src", {
    include: [
      "index.html"
    ]
  });

  const wc = new WebComponents("src/custom-elements", {
    debugLog: true,
  });

  const js = new Rollup("src", {
    rollup: {
      input: "index.js",
      output: {
        file: "bundle.js",
        name: "customElements",
        format: "iife",
        sourcemap: true,
      },
      plugins: [
        babel({
          exclude: "node_modules/**",
          presets: [
            [
              "@babel/preset-env",
              {
                "targets": {
                  browsers: "chrome 49"
                }
              }
            ]
          ],
          plugins: ["@babel/plugin-proposal-class-properties"],
        })
      ]
    }
  });

  return mergeTrees([staticFiles, wc, js]);
}
