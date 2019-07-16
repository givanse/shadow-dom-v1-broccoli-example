
interface TemplatesHash {
  [key: string]: Node;
}

const TEMPLATE_CACHE: TemplatesHash = {};

function findTemplate(templateId: string): HTMLTemplateElement {
  const parentDoc = window.document;
  const templatesLink = parentDoc.getElementById('ce-templates');

  let templates;
  if ('import' in templatesLink) { // HTML Imports, Chrome <= 80
    templates = templatesLink.import;
  }

  return templates.querySelector('#' + templateId);
}

function importTemplate(templateId: string): Node {
  const deep = true;

  const template = findTemplate(templateId);
  const node = document.importNode(template.content, deep);

  TEMPLATE_CACHE[templateId] = node;

  return TEMPLATE_CACHE[templateId];
}

class CustomElement extends HTMLElement {

  static tagName = 'custom-element';

  constructor() {
    super();
  }

  getShadowRoot(): DocumentFragment {
    throw new Error("`getShadowRoot` is an abstract method and must be overwritten by the an inheriting class");
  }

  // Specify observed attributes so that
  // attributeChangedCallback will work
  static get observedAttributes(): string[] {
    return [];
  }

  private addTemplateToRoot() {
    const root = this.getShadowRoot();
    const node = this.getTemplateNode();
    root.appendChild(node);
  }

  private getTemplateNode(): Node {
    const templateId = this.constructor.tagName;

    let node = TEMPLATE_CACHE[templateId];

    if (!node) {
      node = importTemplate(templateId);
    }

    const deep = true;
    return node.cloneNode(deep);
  }

}

// shadow dom v1
class CustomElementV0 extends CustomElement {

  constructor() {
    super();
  }

  getShadowRoot(): DocumentFragment {
    if (!this.shadowRoot) {
      this.createShadowRoot();
    }

    return this.shadowRoot;
  }

  // invoked when upgraded from a puny HTMLElement
  createdCallback() {
    this.addTemplateToRoot();
  }

  attachedCallback() {}

  detachedCallback() {}

  attributeChangedCallback(name: string, oldValue, newValue) {}
}

// shadow dom v1
//TODO: slots?
class CustomElementV1 extends CustomElement {

  constructor() {
    super();
  }

  getShadowRoot(): DocumentFragment {
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
    }

    return this.shadowRoot;
  }

  connectedCallback() {
    this.addTemplateToRoot();
  }
}

let expClass;
if (HTMLElement.prototype.createShadowRoot) {
  expClass = CustomElementV0;
} else if (HTMLElement.prototype.attachShadow) {
  expClass = CustomElementV1;
}

export default expClass;
