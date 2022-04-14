import { Page } from 'views/page/page';
import './index.scss';

export class MainPage extends Page {
  mainPageHTML: Element | null;
  constructor() {
    super();
    this.mainPageHTML = this.createHtmlElement(this.render());
  }
  draw() {
    const main = document.querySelector('.main');
    if(this.mainPageHTML) main?.append(this.mainPageHTML);
  }

  render(): string {
    return `<div class="page-main">
              <div class="main-toy first-main-toy"></div>
              <div class="main-toy second-main-toy"></div>
              <div class="start-message">
                <h1 class="start-message__title">Помогите бабушке<br>нарядить ёлку</h1>
                <a class="start-message__button to-toys-page">Начать</a>
              </div>
            </div>`;
  }
}
