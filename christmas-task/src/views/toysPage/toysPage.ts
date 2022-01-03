import { Popup } from './../popup/popup';
import { NoUiSlider, CreateSliderData } from './noUiSlider/noUiSlider';
import { Page } from '../page/page';
import { ToyCard, ToyCardData } from './toyCard/toyCard';
import { target, API } from 'nouislider';
import './index.scss';
import { data } from '../../data/data';

interface InitNoUiSlider extends CreateSliderData {
  selector: string;
}

export interface FromToObj {
  0?: number;
  1?: number;
}

export interface ActualObjData {
  selectedNumCards?: String[];
  sort?: string;
  count?: FromToObj;
  year?: FromToObj;
  shape?: String[];
  color?: String[];
  size?: String[];
  isFav?: boolean;
  search?: string;
}

export class ToysPage extends Page {
  private toyPageHTML: HTMLElement;
  private toyCardsHTML: HTMLElement;
  private filterObj: ActualObjData;
  private selectedCardsAmount: HTMLElement;
  private searchInput: HTMLInputElement;
  private sortSelect: HTMLSelectElement;
  private favCheckbox: HTMLInputElement;
  private noUiSlider: NoUiSlider;
  readonly START_SELECTED_NUM: number;

  constructor() {
    super();
    this.noUiSlider = new NoUiSlider();
    this.toyPageHTML = <HTMLElement>this.createHtmlElement(this.render());

    this.toyCardsHTML = <HTMLElement>this.toyPageHTML.querySelector('.toys-cards');
    this.selectedCardsAmount = <HTMLElement>document.querySelector('.selected-cards__amount');
    this.searchInput = <HTMLInputElement>this.toyPageHTML.querySelector('.search-input');
    this.sortSelect = <HTMLSelectElement>this.toyPageHTML.querySelector('.sort-select');
    this.favCheckbox = <HTMLInputElement>this.toyPageHTML.querySelector('.fav-category__checkbox');
    this.START_SELECTED_NUM = 0;

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('data', JSON.stringify(this.filterObj));
    });
    const localStorageData = localStorage.getItem('data');
    if (localStorageData) {
      this.filterObj = JSON.parse(localStorageData);
    } else {
      this.filterObj = {};
    }
    window.addEventListener('load', () => {
      this.setLocalStorageCardsData();
    });
  }

  changeCheckboxAfterUpdate(selector: string) {
    const objProperty = this.filterObj[selector as keyof ActualObjData] as String[];

    this.toyPageHTML
      .querySelectorAll<HTMLInputElement>(`.${selector}-category__checkbox`)
      .forEach((item) => {
        objProperty.includes(item.value) ? (item.checked = true) : null;
      });
  }

  setLocalStorageCardsData() {
    if (this.filterObj.sort) {
      this.sortSelect.value = this.filterObj.sort;
    }
    if (this.filterObj.shape) {
      this.changeCheckboxAfterUpdate('shape');
    }
    if (this.filterObj.color) {
      this.changeCheckboxAfterUpdate('color');
    }
    if (this.filterObj.size) {
      this.changeCheckboxAfterUpdate('size');
    }
    if (this.filterObj.isFav) {
      this.favCheckbox.checked = true;
    }
    if (this.filterObj.search) {
      this.searchInput.value = this.filterObj.search;
    }
    if (this.filterObj.selectedNumCards) {
      this.selectedCardsAmount.textContent = this.filterObj.selectedNumCards.length.toString();
    }
  }

  searchToyCards() {
    const searchBtn = <HTMLElement>this.toyPageHTML.querySelector('.search-btn');
    window.addEventListener('load', () => {
      this.searchInput?.focus();
    });
    const setSearchData = () => {
      this.filterObj.search = this.searchInput.value;
      this.changeDataCards(this.filterObj);
    };
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setSearchData();
    });
    this.searchInput.addEventListener('input', function () {
      setSearchData();
    });
  }

  draw() {
    this.changeDataCards(this.filterObj);
    this.filterToyCards();
    this.searchToyCards();
    (document.querySelector('.main') as HTMLElement).append(this.toyPageHTML);
    this.createSliders();
  }
  
  createSliders() {
    if (this.filterObj?.count?.[0] && this.filterObj?.count?.[1]) {
      this.initCountSlider(this.filterObj.count[0], this.filterObj.count[1]);
    } else {
      this.initCountSlider();
    }

    if (this.filterObj?.year?.[0] && this.filterObj?.year?.[1]) {
      this.initYearSlider(this.filterObj.year[0], this.filterObj.year[1]);
    } else {
      this.initYearSlider();
    }
  }

  initCountSlider(start = 1, end = 12) {
    this.initNoUiSlider({
      selector: 'count',
      step: 1,
      start,
      end,
      min: 1,
      max: 12,
    });
  }

  initYearSlider(start = 1940, end = 2020) {
    this.initNoUiSlider({
      selector: 'year',
      step: 10,
      start,
      end,
      min: 1940,
      max: 2020,
    });
  }

  drawToyCards(data: ToyCardData[]) {
    this.toyCardsHTML.innerHTML = '';
    data.forEach((item: ToyCardData) => {
      const toyCard = new ToyCard(item);
      const toyCardHTML = <HTMLElement>this.createHtmlElement(toyCard.render());

      toyCardHTML.addEventListener('click', (e) => {
        const curElement = e.currentTarget as HTMLElement;
        if (!this.filterObj.selectedNumCards) this.filterObj.selectedNumCards = [];

        curElement.classList.toggle('toy-card_active');
        if (
          curElement.classList.contains('toy-card_active') &&
          !this.filterObj.selectedNumCards.some((item) => item === curElement.id)
        ) {
          if (this.filterObj.selectedNumCards.length >= 20) {
            const popup = Popup.getInstance();
            this.toyPageHTML.append(popup.drawPopup());
            setTimeout(() => popup.showPopup(), 0);
            curElement.classList.toggle('toy-card_active');
            return;
          }
          this.filterObj.selectedNumCards.push(item.num);
        } else {
          this.filterObj.selectedNumCards = this.filterObj.selectedNumCards.filter(
            (item) => item !== curElement.id
          );
        }
        this.selectedCardsAmount.innerHTML = this.filterObj.selectedNumCards.length.toString();
      });

      this.filterObj?.selectedNumCards?.forEach((item) =>
        item === toyCardHTML.id ? toyCardHTML.classList.add('toy-card_active') : null
      );
      this.toyCardsHTML.append(toyCardHTML);
    });
  }

  changeDataSelect(data: ToyCardData[], selector: string, num: number): void {
    const selectorName = selector as keyof ToyCardData;
    data.sort((a: ToyCardData, b: ToyCardData): number => {
      if (a[selectorName] > b[selectorName]) return num;
      else if (a[selectorName] < b[selectorName]) return -num;
      else return 0;
    });
  }
  changeDataCheckbox(data: ToyCardData[], selector: string): ToyCardData[] {
    const objProperty = this.filterObj[selector as keyof ActualObjData] as String[];
    return data.filter((item: ToyCardData): boolean =>
      objProperty && objProperty.length
        ? objProperty.includes(item[selector as keyof ToyCardData].toString())
        : true
    );
  }
  changeDataFav(data: ToyCardData[]): ToyCardData[] {
    return data.filter((item: ToyCardData): boolean =>
      this.filterObj.isFav !== undefined ? item.favorite === this.filterObj.isFav : true
    );
  }
  changeDataSlider(data: ToyCardData[], selector: string): ToyCardData[] {
    const objProperty = this.filterObj?.[selector as keyof ActualObjData] as FromToObj;
    return data.filter((item: ToyCardData): boolean => {
      if (objProperty?.[0] && objProperty?.[1]) {
        return (
          +item[selector as keyof ToyCardData] >= +objProperty[0] &&
          +item[selector as keyof ToyCardData] <= +objProperty[1]
        );
      } else {
        return true;
      }
    });
  }
  changeDataSearch(data: ToyCardData[]) {
    return data.filter((item) =>
      this.filterObj.search ? item.name.toLowerCase().includes(this.filterObj.search) : true
    );
  }

  changeDataCards(dataObj: ActualObjData) {
    let toyCardsData = data.concat();
    switch (dataObj.sort) {
      case 'increase-name':
        this.changeDataSelect(toyCardsData, 'name', 1);
        break;
      case 'decrease-name':
        this.changeDataSelect(toyCardsData, 'name', -1);
        break;
      case 'increase-year':
        this.changeDataSelect(toyCardsData, 'year', 1);
        break;
      case 'decrease-year':
        this.changeDataSelect(toyCardsData, 'year', -1);
        break;
      default:
        break;
    }
    toyCardsData = this.changeDataCheckbox(toyCardsData, 'shape');
    toyCardsData = this.changeDataCheckbox(toyCardsData, 'color');
    toyCardsData = this.changeDataCheckbox(toyCardsData, 'size');
    toyCardsData = this.changeDataFav(toyCardsData);
    toyCardsData = this.changeDataSlider(toyCardsData, 'count');
    toyCardsData = this.changeDataSlider(toyCardsData, 'year');
    toyCardsData = this.changeDataSearch(toyCardsData);

    const notFound = <HTMLElement>this.toyPageHTML.querySelector('.not-found-card');
    if (toyCardsData.length) {
      notFound.classList.add('hide');
    } else {
      notFound.classList.remove('hide');
    }
    this.drawToyCards(toyCardsData);
  }

  changeUiCheckbox(e: Event, selector: string) {
    const target = e.target as HTMLInputElement;
    let objProperty = this.filterObj?.[selector as keyof ActualObjData] as String[];

    if (!objProperty) objProperty = [];
    if (target.checked) {
      objProperty?.push(target.value);
    } else {
      objProperty = objProperty?.filter((item) => item !== target.value);
    }

    (this.filterObj[selector as keyof ActualObjData] as String[]) = objProperty;
    this.changeDataCards(this.filterObj);
  }

  filterToyCards() {
    this.sortSelect.addEventListener('change', (e) => {
      this.filterObj.sort = (e.target as HTMLSelectElement).value;
      this.changeDataCards(this.filterObj);
    });

    this.toyPageHTML.querySelector('.shape-categories')?.addEventListener('change', (e) => {
      this.changeUiCheckbox(e, 'shape');
    });

    this.toyPageHTML.querySelector('.color-categories')?.addEventListener('change', (e) => {
      this.changeUiCheckbox(e, 'color');
    });

    this.toyPageHTML.querySelector('.size-categories')?.addEventListener('change', (e) => {
      this.changeUiCheckbox(e, 'size');
    });

    this.toyPageHTML.querySelector('.fav-category')?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.filterObj.isFav = target.checked;
      this.changeDataCards(this.filterObj);
    });

    this.toyPageHTML.querySelector('.default-settings-btn')?.addEventListener('click', () => {
      this.setDefaultFilters();
    });
  }

  setDefaultFilters() {
    this.filterObj = {};

    this.selectedCardsAmount.textContent = this.START_SELECTED_NUM.toString();
    this.searchInput.value = '';

    this.toyPageHTML
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach((item) => (item.checked = false));

    (this.toyPageHTML.querySelector('option[value="default"]') as HTMLOptionElement).selected =
      true;

    const sliders: NodeListOf<target> =
      this.toyPageHTML.querySelectorAll<HTMLElement>('.noUiSlider');
    sliders.forEach((item) => {
      const max = item.querySelector('.noUi-handle-upper')?.getAttribute('aria-valuemax');
      const min = item.querySelector('.noUi-handle-lower')?.getAttribute('aria-valuemin');
      (item.noUiSlider as API).set([`${min}`, `${max}`]);
    });

    this.changeDataCards(this.filterObj);
  }

  initNoUiSlider({ selector, step, start, end, min, max }: InitNoUiSlider) {
    const customSlider: target = <HTMLElement>document.querySelector(`#${selector}-slider`);
    const skipValues: HTMLElement[] = [
      <HTMLElement>document.querySelector(`#skip-value-${selector}__lower`),
      <HTMLElement>document.querySelector(`#skip-value-${selector}__upper`),
    ];
    if (!customSlider.noUiSlider)
      this.noUiSlider.drawSlider({ customSlider, step, start, end, min, max });
    const curValues = customSlider.querySelectorAll<HTMLElement>('.noUi-tooltip');

    const setKeyValue = (obj: Record<string, any>, key: string, handle: number, value: string) => {
      if (!obj[key]) obj[key] = {};
      obj[key][handle] = value;
    };
    (customSlider.noUiSlider as API).on('update', (arr: (string | number)[], handle: number) => {
      const curValue = curValues[handle].innerHTML;
      skipValues[handle].innerHTML = curValue;
      setKeyValue(this.filterObj, selector, handle, curValue);
      this.changeDataCards(this.filterObj);
    });
  }

  render(): string {
    return `<div class="page-toys">
              <div class="page-toys__settings">
                <div class="interact-block">
                  <button class="music-btn"></button>
                  <button class="snow-btn"></button>
                  <form action="" class="search-bar">
                    <input type="search" class="search-input" placeholder="Поиск" autocomplete="off" />
                    <button class="search-btn" type="submit"></button>
                  </form>
                </div>
                <div class="sort-box">
                  <h3 class="title">Сортировать</h3>
                  <select class="sort-select">
                    <option value="default" selected disabled hidden>Сортировать по</option>
                    <option value="increase-name">Названию в возрастающем порядке</option>
                    <option value="decrease-name">Названию в спадающем порядке</option>
                    <option value="increase-year">Году в возрастающем порядке</option>
                    <option value="decrease-year">Году в спадающем порядке</option>
                  </select>
                </div>
                <div class="categories-box">
                  <h3 class="title">Категории</h3>
                  <div class="categories-wrapper">
                    <div class="shape-box">
                      <h4 class="category-title">Форма</h4>
                      <div class="shape-categories">
                        <div class="shape-category">
                          <input type="checkbox" class="shape-category__checkbox" id="shape-bell" name="shape-bell"
                            value="колокольчик" />
                          <label for="shape-bell" class="shape-category__label">Колокол</label>
                        </div>
                        <div class="shape-category">
                          <input type="checkbox" class="shape-category__checkbox" id="shape-ball" name="shape-ball"
                            value="шар" />
                          <label for="shape-ball" class="shape-category__label">Шар</label>
                        </div>
                        <div class="shape-category">
                          <input type="checkbox" class="shape-category__checkbox" id="shape-cone" name="shape-cone"
                            value="шишка" />
                          <label for="shape-cone" class="shape-category__label">Шишка</label>
                        </div>
                        <div class="shape-category">
                          <input type="checkbox" class="shape-category__checkbox" id="shape-snowflake" name="shape-snowflake"
                            value="снежинка" />
                          <label for="shape-snowflake" class="shape-category__label">Снежинка</label>
                        </div>
                        <div class="shape-category">
                          <input type="checkbox" class="shape-category__checkbox" id="shape-toy" name="shape-toy"
                            value="фигурка" />
                          <label for="shape-toy" class="shape-category__label">Фигурка</label>
                        </div>
                      </div>
                    </div>
                    <div class="count-box">
                      <h4 class="category-title">Количество экземпляров</h4>
                      <div class="count-wrapper slider-wrapper">
                        <div id="count-slider" class="count-slider noUiSlider"></div>
                        <div class="skip-value skip-value-count">
                          <span id="skip-value-count__lower"></span>
                          <span id="skip-value-count__upper"></span>
                        </div>
                      </div>
                    </div>
                    <div class="year-box">
                      <h4 class="category-title">Год приобретения</h4>
                      <div class="year-wrapper slider-wrapper">
                        <div id="year-slider" class="year-slider noUiSlider"></div>
                        <div class="skip-value skip-value-year">
                          <span id="skip-value-year__lower"></span>
                          <span id="skip-value-year__upper"></span>
                        </div>
                      </div>
                    </div>
                    <div class="color-box">
                      <h4 class="category-title">Цвет</h4>
                      <div class="color-categories">
                        <div class="color-category">
                          <input type="checkbox" class="color-category__checkbox" value="белый" name="color-white"
                            id="color-white" />
                          <label for="color-white" class="color-category__label"></label>
                        </div>
                        <div class="color-category">
                          <input type="checkbox" class="color-category__checkbox" value="желтый" name="color-yellow"
                            id="color-yellow" />
                          <label for="color-yellow" class="color-category__label"></label>
                        </div>
                        <div class="color-category">
                          <input type="checkbox" class="color-category__checkbox" value="красный" name="color-red"
                            id="color-red" />
                          <label for="color-red" class="color-category__label"></label>
                        </div>
                        <div class="color-category">
                          <input type="checkbox" class="color-category__checkbox" value="синий" name="color-blue"
                            id="color-blue" />
                          <label for="color-blue" class="color-category__label"></label>
                        </div>
                        <div class="color-category">
                          <input type="checkbox" class="color-category__checkbox" value="зелёный" name="color-green"
                            id="color-green" />
                          <label for="color-green" class="color-category__label"></label>
                        </div>
                      </div>
                    </div>
                    <div class="size-box">
                      <h4 class="category-title">Размер</h4>
                      <div class="size-categories">
                        <div class="box-category size-category">
                          <input type="checkbox" class="box-category__checkbox size-category__checkbox" value="большой" name="size-big" id="size-big" />
                          <label for="size-big" class="box-category__label">Большой</label>
                        </div>
                        <div class="size-category">
                          <input type="checkbox" class="box-category__checkbox size-category__checkbox" value="средний" name="size-medium"
                            id="size-medium" />
                          <label for="size-medium" class="box-category__label">Средний</label>
                        </div>
                        <div class="size-category">
                          <input type="checkbox" class="box-category__checkbox size-category__checkbox" value="малый" name="size-small"
                            id="size-small" />
                          <label for="size-small" class="box-category__label">Маленький</label>
                        </div>
                      </div>
                    </div>
                    <div class="box-category fav-category">
                      <input type="checkbox" class="box-category__checkbox fav-category__checkbox" value="любимая" name="type-fav" id="type-fav" />
                      <label for="type-fav" class="box-category__label">Только любимые</label>
                    </div>
                  </div>
                </div>
                <button class="default-settings-btn">Сбросить настройки</button>
              </div>
              <div class="page-toys__toys">
                <h2 class="page-title">Игрушки</h2>
                <div class="toys-cards">
                </div>
                <div class="not-found-card hide">
                  <h3 class="not-found-card__title">Опаньки...</h3>
                  <p class="not-found-card__subtitle">Кажется игрушек по заданым фильтрам у Деда Мороза не нашлось</p>
                  <img class="not-found-card__img" src="./assets/img/santa.png" alt="Дед Мороз разводит руками" />
                </div>
              </div>
            </div>`;
  }
}
