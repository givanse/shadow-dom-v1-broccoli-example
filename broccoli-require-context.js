const walkSync = require("walk-sync");
const MultiFilter = require("broccoli-multifilter");
const funnel = require("broccoli-funnel");
const concat = require("broccoli-concat");
const BroccoliPlugin = require("broccoli-plugin");

/**
 * 
 * Require every file in a directory.
 * 
 */
export class BroccoliRequireContext extends MultiFilter {

  constructor(
    inputNodes,
    options = {
      name: "Require Context",
      annotation: "Require Context",
  }) {
    super(inputNodes, {
      name: options.name,
      annotation: options.annotation,
    });

    this.globs = options.globs;
    this.targetFile = options.targetFile;
    this.outputFile = options.outputFile;
  }

  findSourceFilesPaths(folderPath, globs) {
    return walkSync(folderPath, {
      directories: false,
      globs,
    });
  }

  async foobar(inputPaths, targetFile, globs) {

    const requireStatements = "/* START dynamically generated */\n";

    const {dependencies} = await this.buildAndCache(inputPaths, (inputFile, outputDirectory) => {
      //const inputPath = this.inputPaths[0];

      const sourceFilesPaths = this.findSourceFilesPaths(inputPath, globs);

      for (const sourceFilePath of sourceFilesPaths) {
        //const fullInputPath = path.join(inputPath, inputFile);
        //const fullOutputPath = path.join(outputDirectory, inputFile);
        //fs.writeFileSync(fullOutputPath, customElementsListTxt + registerCustomElementsTxt);

        dependencies.push(fullInputPath);
      }

      return {dependencies};
    });

    requireStatements += "/* END dynamically generated */\n";

    const targetSourceFile = funnel(targetFile, {
      annotation: "Target Source File",
    });

    const mergedTrees = mergeTrees([requireStatements, targetSourceFile]);

    const textResult = concat(mergedTrees, {
      //outputFile: "custom-elements.html",
    });

    const fullOutputPath = path.join(outputDirectory, targetFile);
    fs.writeFileSync(fullOutputPath, textResult);
  }

  async build() {
    //const inputPath = this.inputPaths[0];

    return foobar(this.inputPaths, this.targetFile, this.globs);
  }
}

module.exports = function broccoliRequireContext(inputNode, options) {
  return new BroccoliRequireContext(inputNode, options);
};
