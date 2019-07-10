
export default class CustomElement extends HTMLElement {

  static tagName = 'custom-element';

  constructor() {
    super();
    
    this.addShadowRoot();
  }

  addShadowRoot() {
    if (this.shadowRoot) {
      return;
    }

    const templatesLink = window.document.getElementById('ce-templates');
    const templates: HTMLDocument = templatesLink.import;
    const templateId = this.constructor.tagName;
    const template: HTMLTemplateElement = templates.querySelector('#' + templateId);

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

}
