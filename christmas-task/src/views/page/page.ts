export class Page {
  createHtmlElement(htmlString: string): ChildNode | null {
    const template = <HTMLTemplateElement>document.createElement('template');
    template.innerHTML = htmlString;
    return template.content.firstChild;
  }
}
