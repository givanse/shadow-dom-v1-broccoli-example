import FooBar from './custom-elements/foo-bar/index';
import LoremIpsum from './custom-elements/lorem-ipsum/index';
import CustomElement from './custom-element';

function registerCustomElement(CustomElement) {
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
    document.registerElement(CustomElement.tagName, CustomElement/*{
      prototype: Object.create(CustomElement.prototype)
    }*/);
  }
}

//TODO: automate
const customElements: CustomElement[] = [
  FooBar,
  LoremIpsum,
];

for (const CustomElement of customElements) {
  registerCustomElement(CustomElement);
}
