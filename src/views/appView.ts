import { HTMLElementEvent } from 'common/types';
import { TreePage } from './treePage/treePage';
import { MainPage } from './mainPage/mainPage';
import { ToysPage } from './toysPage/toysPage';

export class AppView {
  private toysPage: ToysPage;
  private mainPage: MainPage;
  private treePage: TreePage;
  private nav: HTMLElement | null;
  private headerToMainPageBtn: HTMLElement | null;
  private headerToToysPageBtn: HTMLElement | null;
  private headerToTreePageBtn: HTMLElement | null;
  private mainToToysPageBtn: HTMLElement | null;
  private navLink: HTMLElement | null;

  constructor() {
    this.toysPage = new ToysPage();
    this.mainPage = new MainPage();
    this.treePage = new TreePage();
    this.nav = document.querySelector('.nav');
    this.headerToMainPageBtn = document.querySelector('.to-main-page');
    this.headerToToysPageBtn = document.querySelector('.to-toys-page');
    this.headerToTreePageBtn = document.querySelector('.to-tree-page');
    const mainPageHTML = this.mainPage.mainPageHTML;
    this.mainToToysPageBtn = mainPageHTML ? mainPageHTML?.querySelector('.to-toys-page') : null;
    this.navLink = document.querySelector('.nav__link');

    this.headerToMainPageBtn?.addEventListener('click', this.drawMainPage.bind(this));
    this.headerToTreePageBtn?.addEventListener('click', () =>
      this.drawTreePage(this.toysPage.actualData.selectedNumCards)
    );
    this.headerToToysPageBtn?.addEventListener('click', this.drawToysPage.bind(this));
    this.mainToToysPageBtn?.addEventListener('click', () => {
      this.drawToysPage();
      if (this.navLink) this.navLink.classList.add('active-link');
    });
    this.nav?.addEventListener('click', (e: HTMLElementEvent<Event, HTMLElement>) =>
      this.updateActiveLink(e)
    );
  }

  updateActiveLink(e: HTMLElementEvent<Event, HTMLElement>) {
    const target = e.target;
    document.querySelector('.active-link')?.classList.remove('active-link');

    if (target instanceof HTMLElement)
      target.classList.contains('nav__link') ? target.classList.add('active-link') : null;
  }

  removeMainContent(): void {
    const main = document.querySelector('.main');
    if (main) main.innerHTML = '';
  }

  drawMainPage(): void {
    this.removeMainContent();
    this.mainPage.draw();
  }

  drawTreePage(selectedNumCards: String[] = []): void {
    this.removeMainContent();
    this.treePage.draw(selectedNumCards);
  }

  drawToysPage(): void {
    this.removeMainContent();
    this.toysPage.draw();
  }
}
