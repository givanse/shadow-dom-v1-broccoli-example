
export default class CustomElement extends HTMLElement {

  static name = 'abstract-custom-element';

  constructor() {
    super();

    const templates = window.document.getElementById('ce-templates').import;
    const templateId = this.constructor.name;
    const template = templates.getElementById(templateId);

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

}
