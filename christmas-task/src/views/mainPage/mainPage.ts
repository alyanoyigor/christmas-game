import { Page } from './../page/page';
import './index.scss';

export class MainPage extends Page {
  mainPageHTML: HTMLElement;
  constructor() {
    super();
    this.mainPageHTML = <HTMLElement>this.createHtmlElement(this.render());
  }
  draw() {
    (document.querySelector('.main') as HTMLElement).append(this.mainPageHTML);
  }

  render(): string {
    return `<div class="page-main">
              <div class="main-toy main-toy-1"></div>
              <div class="main-toy main-toy-2"></div>
              <div class="start-message">
                <h1 class="start-message__title">Помогите бабушке<br>нарядить ёлку</h1>
                <a class="start-message__button to-toys-page">Начать</a>
              </div>
            </div>`;
  }
}
