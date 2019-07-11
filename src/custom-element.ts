
interface TemplatesHash {
  [key: string]: Node;
}

const TEMPLATE_CACHE: TemplatesHash = {};

function importTemplate(templateId: string): void {
  const templatesLink = window.document.getElementById('ce-templates');

  let templates;
  if ('import' in templatesLink) { // HTML Imports, Chrome <= 80
    templates = templatesLink.import;
  }
  const template = templates.querySelector('#' + templateId);
  const deep = true;
  const node = document.importNode(template.content, deep);
  TEMPLATE_CACHE[templateId] = node;
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
    
    this.addShadowRoot();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name: string, oldValue, newValue) {}

  private addShadowRoot() {
    if (this.shadowRoot) {
      return;
    }

    const shadowRoot = this.attachShadow({mode: 'open'});
    const node = this.getTemplateNode();
    shadowRoot.appendChild(node);
  }

  private getTemplateNode(): Node {
    const templateId = this.constructor.tagName;

    if (!TEMPLATE_CACHE[templateId]) {
      importTemplate(templateId);
    }

    const node = TEMPLATE_CACHE[templateId];

    const deep = true;
    return node.cloneNode(deep);
  }

}
