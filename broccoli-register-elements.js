const path = require("path");
const fs = require("fs");
const MultiFilter = require("broccoli-multifilter");
const walkSync = require('walk-sync');

module.exports = class BroccoliRegisterElements extends MultiFilter {

  constructor(inputNodes, options) {
    super(inputNodes, options);
  }

  getCustomElementsPaths(folderPath) {
    return walkSync(folderPath, {
      directories: true,
      globs: ["custom-elements/**/*.ts"]
    });
  }

  generateCustomElementsList(filePaths) {
    const names = filePaths.reduce(function(acc, filePath) {
      let customElementName = filePath.match(/\/(\w*-\w*)\/index.ts/)[1];

      customElementName = customElementName.split("-").reduce(function(str, word) {
        word = word.toLowerCase();
        word = word[0].toUpperCase() + word.substring(1);
        str += word;
        return str;
      }, '');

      acc.push(customElementName);

      return acc;
    }, []);
    
    return "/* BroccoliRegisterElements: Dynamically Generated */\n" +
           `const CUSTOM_ELEMENTS = [${names.join(',')}];\n`;
  }

  build() {
    const inputFiles = ["register-elements.js"];

    return this.buildAndCache(inputFiles, (inputFile, outputDirectory) => {
      const inputPath = this.inputPaths[0];

      const fullInputPath = path.join(inputPath, inputFile);
      const fullOutputPath = path.join(outputDirectory, inputFile);

      let dependencies = this.getCustomElementsPaths(inputPath);
      dependencies = dependencies.map(function (partialPath) {
        return path.join(inputPath, partialPath);
      });

      const customElementsListTxt = this.generateCustomElementsList(dependencies);

      const registerCustomElementsTxt = fs.readFileSync('./src/register-elements.js', 'utf8');
      fs.writeFileSync(fullOutputPath, customElementsListTxt + registerCustomElementsTxt);

      dependencies.push(fullInputPath);
      return {dependencies};
    });
  }
};
