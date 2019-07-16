/**
 * 
 * TODO: Requiring the JS for the custom elements is not ideal.
 *       We'll make it dynamic later.
 */
import FooBar from "./custom-elements/foo-bar/index.ts";
import LoremIpsum from "./custom-elements/lorem-ipsum/index.ts";

const CUSTOM_ELEMENTS = [FooBar, LoremIpsum];

function registerCustomElement(CustomElement) {
  const importDoc = document.currentScript.ownerDocument;

  if (false) {
    // Chrome >= 80
    // The proposal is to use ES modules, but it isn't a standard.
  } else if (window.customElements && window.customElements.define) {
    // Chrome <= 80
    // Deprecated HTML Imports
    // https://www.chromestatus.com/feature/5144752345317376
    window.customElements.define(CustomElement.tagName, CustomElement);
  } else {
    // Chrome <= 54
    // Deprecated Custom Elements V0
    // https://www.chromestatus.com/features/4642138092470272
    importDoc.registerElement(CustomElement.tagName, {
      prototype: Object.create(CustomElement.prototype)
    });
  }
}

function registerCustomElements(customElements) {
  for (const CustomElement of customElements) {
    registerCustomElement(CustomElement);
  }
}

registerCustomElements(CUSTOM_ELEMENTS);
