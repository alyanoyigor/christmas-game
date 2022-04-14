export class Page {
  createHtmlElement(htmlString: string): Element | null {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    return template.content.firstElementChild;
  }

  findElement<T extends Element>(parent: Element | null, selector: string): T | null {
    return parent ? parent.querySelector(selector) : null;
  }
}
