import { HTMLElementEvent } from 'common/types';
import { Page } from 'views/page/page';
import './index.scss';

export class Popup extends Page {
  public popupHTML: Element | null;
  private static instance: Popup;

  constructor() {
    super();

    this.popupHTML = this.createHtmlElement(this.render());
    const popupClose = this.popupHTML?.querySelector('.close-btn');

    popupClose?.addEventListener('click', (e) => {
      e.preventDefault;
      this.removePopup();
    });

    this.popupHTML?.addEventListener('click', (e: HTMLElementEvent<Event, HTMLElement>) => {
      const target = e.target;
      if (target instanceof HTMLElement)
        target.classList.contains('popup-wrapper') ? this.removePopup() : null;
    });
  }

  public static getInstance(): Popup {
    if (!Popup.instance) {
      Popup.instance = new Popup();
    }
    return Popup.instance;
  }

  drawPopup() {
    return this.popupHTML;
  }

  showPopup() {
    this.popupHTML?.classList.add('active');
  }

  removePopup() {
    this.popupHTML?.classList.remove('active');
  }

  render() {
    return `<div class="popup-wrapper">
              <div class="popup">
                <button class="close-btn"></button>
                <img class="warning-img" src="./assets/svg/warning.svg" alt="">
                <h4 class="popup__message">Извините, все слоты заняты!</h4>
              </div>
            </div>`;
  }
}
