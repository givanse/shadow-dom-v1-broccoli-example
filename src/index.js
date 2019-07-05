import FooBar from './custom-elements/foo-bar/index.js';
import LoremIpsum from './custom-elements/lorem-ipsum/index.js';

function registerCustomElement(CustomElement) {
  try {
    window.customElements.define(CustomElement.name, CustomElement);
  } catch(e) {
  }
}

//TODO: automate
const customElements = [
  FooBar,
  LoremIpsum,
];

for (const CustomElement of customElements) {
  registerCustomElement(CustomElement);
}
