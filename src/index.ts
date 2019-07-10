import FooBar from './custom-elements/foo-bar/index';
import LoremIpsum from './custom-elements/lorem-ipsum/index';
import CustomElement from './custom-element';

function registerCustomElement(CustomElement) {
  if (window.customElements && window.customElements.define) {
    window.customElements.define(CustomElement.tagName, CustomElement);
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
