import { ToyCardData } from './toysPage/toyCard/toyCard';
import { MainPage } from './mainPage/mainPage';
import { ToysPage } from './toysPage/toysPage';

export class AppView {
  private toysPage: ToysPage;
  private mainPage: MainPage;
  private nav: HTMLElement;
  private headerToMainPageBtn: HTMLElement;
  private headerToToysPageBtn: HTMLElement;
  private mainToToysPageBtn: HTMLElement;
  private navLink: HTMLElement;

  constructor() {
    this.toysPage = new ToysPage();
    this.mainPage = new MainPage();
    this.nav = document.querySelector('.nav') as HTMLElement;
    this.headerToMainPageBtn = this.nav.querySelector('.to-main-page') as HTMLElement;
    this.headerToToysPageBtn = this.nav.querySelector('.to-toys-page') as HTMLElement;
    this.mainToToysPageBtn = this.mainPage.mainPageHTML.querySelector(
      '.to-toys-page'
    ) as HTMLElement;
    this.navLink = this.nav.querySelectorAll<HTMLElement>('.nav__link')[0];

    this.headerToMainPageBtn.addEventListener('click', () => this.drawMainPage());
    this.headerToToysPageBtn.addEventListener('click', () => this.drawToysPage());
    this.mainToToysPageBtn.addEventListener('click', () => {
      this.drawToysPage();
      this.navLink.classList.add('active-link');
    });
    this.nav.addEventListener('click', this.updateActiveLink);
  }
  updateActiveLink(e: Event) {
    const target = e.target as HTMLElement;
    document.querySelector('.active-link')?.classList.remove('active-link');
    if (target.classList.contains('nav__link')) {
      target.classList.add('active-link');
    }
  }

  drawMainPage(): void {
    this.removeMainContent();
    this.mainPage.draw();
  }

  drawToysPage(): void {
    this.removeMainContent();
    this.toysPage.draw();
  }

  removeMainContent(): void {
    (document.querySelector('.main') as HTMLElement).innerHTML = '';
  }
}
