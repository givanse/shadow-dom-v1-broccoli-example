
interface TemplatesHash {
  [key: string]: Node;
}

const TEMPLATE_CACHE: TemplatesHash = {};

function importTemplate(templateId: string): Node {
  const templatesLink = window.document.getElementById('ce-templates');

  //const ceHead = document.currentScript.ownerDocument.head;

  let templates;
  if ('import' in templatesLink) { // HTML Imports, Chrome <= 80
    templates = templatesLink.import;
  }

  const template = templates.querySelector('#' + templateId);
  //const template = ceHead.querySelector(`template#${templateId}`);
  const deep = true;
  const node = document.importNode(template.content, deep);

  TEMPLATE_CACHE[templateId] = node;

  return TEMPLATE_CACHE[templateId];
}

export default class CustomElement extends HTMLElement {

  static tagName = 'custom-element';

  // Specify observed attributes so that
  // attributeChangedCallback will work
  static get observedAttributes(): string[] {
    return [];
  }

  constructor() {
    super();
  }

  createdCallback() {
    this.addShadowRoot();
  }

  connectedCallback() {
    this.addShadowRoot();
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name: string, oldValue, newValue) {}

  private addShadowRoot() {
    if (this.shadowRoot) {
      return;
    }

    if (this.attachShadow) { // shadow dom v1
      this.attachShadow({mode: 'open'});
    } else if (this.createShadowRoot) { // shadow dom v0
      this.createShadowRoot();
    }
    
    const node = this.getTemplateNode();
    this.shadowRoot.appendChild(node);

    console.log(`${this.constructor.tagName} connected`, this.shadowRoot);
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
