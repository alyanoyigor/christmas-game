import { Popup } from 'views/popup/popup';
import { ActualData, InitNoUiSlider, SliderFromTo, ToyCardData } from 'common/interfaces';
import { NoUiSlider } from './noUiSlider/noUiSlider';
import { Page } from 'views/page/page';
import { ToyCard } from './toyCard/toyCard';
import { target, API } from 'nouislider';
import { data } from 'data/data';
import { FromToKeys } from 'common/enums';
import './index.scss';

export class ToysPage extends Page {
  private toyPageHTML: Element | null;
  private toyCardsHTML: HTMLElement | null;
  actualData: ActualData;
  private selectedCardsAmount: HTMLElement | null;
  private searchInput: HTMLInputElement | null;
  private sortSelect: HTMLSelectElement | null;
  private favCheckbox: HTMLInputElement | null;
  private noUiSlider: NoUiSlider;
  private MIN_SLIDER_COUNT: number;
  private MAX_SLIDER_COUNT: number;
  private STEP_SLIDER_COUNT: number;
  private MIN_SLIDER_YEAR: number;
  private MAX_SLIDER_YEAR: number;
  private STEP_SLIDER_YEAR: number;
  readonly START_SELECTED_NUM: number;

  constructor() {
    super();
    this.noUiSlider = new NoUiSlider();
    this.toyPageHTML = this.createHtmlElement(this.render());
    this.toyCardsHTML = this.findElement(this.toyPageHTML, '.toys-cards');
    this.selectedCardsAmount = document.querySelector('.selected-cards__amount');
    this.searchInput = this.findElement(this.toyPageHTML, '.search-input');
    this.sortSelect = this.findElement(this.toyPageHTML, '.sort-select');
    this.favCheckbox = this.findElement(this.toyPageHTML, '.fav-category__checkbox');
    this.START_SELECTED_NUM = 0;
    this.MIN_SLIDER_COUNT = 1;
    this.MAX_SLIDER_COUNT = 12;
    this.STEP_SLIDER_COUNT = 1;
    this.MIN_SLIDER_YEAR = 1940;
    this.MAX_SLIDER_YEAR = 2020;
    this.STEP_SLIDER_YEAR = 10;

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('data', JSON.stringify(this.actualData));
    });
    const localStorageData = localStorage.getItem('data');
    this.actualData = localStorageData ? JSON.parse(localStorageData) : {};
    window.addEventListener('load', () => {
      this.setLocalStorageCardsData();
    });
  }

  changeCheckboxAfterUpdate(selector: string) {
    const selectedCheckboxes = this.actualData[selector as keyof ActualData] as String[];
    this.toyPageHTML
      ?.querySelectorAll<HTMLInputElement>(`.${selector}-category__checkbox`)
      .forEach((checkbox) => {
        selectedCheckboxes.includes(checkbox.value)
          ? checkbox.setAttribute('checked', 'true')
          : null;
      });
  }

  setLocalStorageCardsData() {
    if (this.actualData.sort) {
      this.sortSelect ? (this.sortSelect.value = this.actualData.sort) : null;
    }
    if (this.actualData.shape) {
      this.changeCheckboxAfterUpdate('shape');
    }
    if (this.actualData.color) {
      this.changeCheckboxAfterUpdate('color');
    }
    if (this.actualData.size) {
      this.changeCheckboxAfterUpdate('size');
    }
    if (this.actualData.isFav) {
      this.favCheckbox ? (this.favCheckbox.checked = true) : null;
    }
    if (this.actualData.search) {
      this.searchInput ? (this.searchInput.value = this.actualData.search) : null;
    }
    if (this.actualData.selectedNumCards) {
      this.selectedCardsAmount
        ? (this.selectedCardsAmount.textContent =
            this.actualData.selectedNumCards.length.toString())
        : null;
    }
  }

  searchToyCards() {
    const searchBtn = this.findElement(this.toyPageHTML, '.search-btn');
    window.addEventListener('load', () => {
      this.searchInput?.focus();
    });
    const setSearchData = () => {
      this.actualData.search = this.searchInput?.value.toLowerCase();
      this.changeDataCards(this.actualData);
    };
    searchBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      setSearchData();
    });
    this.searchInput?.addEventListener('input', setSearchData);
  }

  draw() {
    this.changeDataCards(this.actualData);
    this.filterToyCards();
    this.searchToyCards();
    const main = document.querySelector('.main');
    if (this.toyPageHTML) main?.append(this.toyPageHTML);
    this.createSliders();
  }

  createSliders() {
    if (this.actualData?.count?.from && this.actualData?.count?.to) {
      this.initCountSlider(this.actualData.count.from, this.actualData.count.to);
    } else {
      this.initCountSlider();
    }

    if (this.actualData?.year?.from && this.actualData?.year?.to) {
      this.initYearSlider(this.actualData.year.from, this.actualData.year.to);
    } else {
      this.initYearSlider();
    }
  }

  initCountSlider(start = this.MIN_SLIDER_COUNT, end = this.MAX_SLIDER_COUNT) {
    this.initNoUiSlider({
      selector: 'count',
      step: this.STEP_SLIDER_COUNT,
      start,
      end,
      min: this.MIN_SLIDER_COUNT,
      max: this.MAX_SLIDER_COUNT,
    });
  }

  initYearSlider(start = this.MIN_SLIDER_YEAR, end = this.MAX_SLIDER_YEAR) {
    this.initNoUiSlider({
      selector: 'year',
      step: this.STEP_SLIDER_YEAR,
      start,
      end,
      min: this.MIN_SLIDER_YEAR,
      max: this.MAX_SLIDER_YEAR,
    });
  }

  drawToyCards(data: ToyCardData[]) {
    if (this.toyCardsHTML) this.toyCardsHTML.innerHTML = '';
    data.forEach((item: ToyCardData) => {
      const toyCard = new ToyCard(item);
      const toyCardHTML = <HTMLElement>this.createHtmlElement(toyCard.render());

      toyCardHTML.addEventListener('click', (e) => {
        const curElement = e.currentTarget as HTMLElement;
        if (!this.actualData.selectedNumCards) this.actualData.selectedNumCards = [];

        curElement.classList.toggle('toy-card_active');
        if (
          curElement.classList.contains('toy-card_active') &&
          !this.actualData.selectedNumCards.some((item) => item === curElement.id)
        ) {
          if (this.actualData.selectedNumCards.length >= 20) {
            const popup = Popup.getInstance();
            const popupHTML = popup.drawPopup();
            this.toyPageHTML?.append(popupHTML ? popupHTML : '');
            setTimeout(popup.showPopup.bind(popup), 0);
            curElement.classList.toggle('toy-card_active');
            return;
          }
          this.actualData.selectedNumCards.push(item.num);
        } else {
          this.actualData.selectedNumCards = this.actualData.selectedNumCards.filter(
            (item) => item !== curElement.id
          );
        }
        this.selectedCardsAmount
          ? (this.selectedCardsAmount.innerHTML =
              this.actualData.selectedNumCards.length.toString())
          : null;
      });

      this.actualData?.selectedNumCards?.forEach((item) => {
        if (item === toyCardHTML.id) {
          toyCardHTML.classList.add('toy-card_active');
        }
      });
      this.toyCardsHTML?.append(toyCardHTML);
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
    const selectedCheckboxes = this.actualData[selector as keyof ActualData] as String[];
    return data.filter((item: ToyCardData): boolean =>
      selectedCheckboxes && selectedCheckboxes.length
        ? selectedCheckboxes.includes(item[selector as keyof ToyCardData].toString())
        : true
    );
  }
  changeDataFav(data: ToyCardData[]): ToyCardData[] {
    return data.filter((item: ToyCardData): boolean =>
      this.actualData.isFav !== undefined ? item.favorite === this.actualData.isFav : true
    );
  }
  changeDataSlider(data: ToyCardData[], selector: string): ToyCardData[] {
    const sliderData = this.actualData?.[selector as keyof ActualData] as SliderFromTo;
    return data.filter((item: ToyCardData): boolean => {
      if (sliderData?.from && sliderData?.to) {
        return (
          +item[selector as keyof ToyCardData] >= +sliderData.from &&
          +item[selector as keyof ToyCardData] <= +sliderData.to
        );
      }
      return true;
    });
  }
  changeDataSearch(data: ToyCardData[]) {
    return data.filter((item) =>
      this.actualData.search ? item.name.toLowerCase().includes(this.actualData.search) : true
    );
  }

  changeDataCards(dataObj: ActualData) {
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

    const notFound = this.findElement(this.toyPageHTML, '.not-found-card');
    if (toyCardsData.length) {
      notFound?.classList.add('hide');
    } else {
      notFound?.classList.remove('hide');
    }
    this.drawToyCards(toyCardsData);
  }

  changeUiCheckbox(e: Event, selector: string) {
    const target = e.target as HTMLInputElement;
    let selectedCheckboxes = this.actualData?.[selector as keyof ActualData] as String[];
    if (!selectedCheckboxes) selectedCheckboxes = [];
    if (target.checked) {
      selectedCheckboxes?.push(target.value);
    } else {
      selectedCheckboxes = selectedCheckboxes?.filter((item) => item !== target.value);
    }

    (this.actualData[selector as keyof ActualData] as String[]) = selectedCheckboxes;
    this.changeDataCards(this.actualData);
  }

  filterToyCards() {
    this.sortSelect?.addEventListener('change', (e) => {
      this.actualData.sort = (e.target as HTMLSelectElement).value;
      this.changeDataCards(this.actualData);
    });
    this.findElement(this.toyPageHTML, '.shape-categories')?.addEventListener('change', (e) => {
      this.changeUiCheckbox(e, 'shape');
    });
    this.findElement(this.toyPageHTML, '.color-categories')?.addEventListener('change', (e) => {
      this.changeUiCheckbox(e, 'color');
    });

    this.findElement(this.toyPageHTML, '.size-categories')?.addEventListener('change', (e) => {
      this.changeUiCheckbox(e, 'size');
    });

    this.findElement(this.toyPageHTML, '.fav-category')?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.actualData.isFav = target.checked;
      this.changeDataCards(this.actualData);
    });

    this.findElement(this.toyPageHTML, '.default-settings-btn')?.addEventListener('click', () => {
      this.setDefaultFilters();
    });
  }

  setDefaultFilters() {
    this.actualData = {};

    if (this.selectedCardsAmount)
      this.selectedCardsAmount.textContent = this.START_SELECTED_NUM.toString();
    if (this.searchInput) this.searchInput.value = '';

    this.toyPageHTML
      ?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach((item) => (item.checked = false));
    const defaultOption: HTMLOptionElement | null = this.findElement(
      this.toyPageHTML,
      'option[value="default"]'
    );
    if (defaultOption) defaultOption.selected = true;

    const sliders: NodeListOf<target> | null = this.toyPageHTML
      ? this.toyPageHTML.querySelectorAll<HTMLElement>('.noUiSlider')
      : null;
    sliders?.forEach((item) => {
      const max = item.querySelector('.noUi-handle-upper')?.getAttribute('aria-valuemax');
      const min = item.querySelector('.noUi-handle-lower')?.getAttribute('aria-valuemin');
      const noUiItem: API | undefined = item.noUiSlider;
      noUiItem?.set([`${min}`, `${max}`]);
    });

    this.changeDataCards(this.actualData);
  }

  initNoUiSlider({ selector, step, start, end, min, max }: InitNoUiSlider) {
    const customSlider: target | null = document.querySelector(`#${selector}-slider`);
    const lowerValue: HTMLElement | null = document.querySelector(`#skip-value-${selector}__lower`);
    const upperValue: HTMLElement | null = document.querySelector(`#skip-value-${selector}__upper`);
    let skipValues: HTMLElement[];
    if (lowerValue && upperValue) skipValues = [lowerValue, upperValue];
    if (customSlider && !customSlider?.noUiSlider)
      this.noUiSlider.drawSlider({ customSlider, step, start, end, min, max });
    const curValues = customSlider?.querySelectorAll<HTMLElement>('.noUi-tooltip');

    const setKeyValue = (obj: ActualData, key: keyof ActualData, handle: string, value: number) => {
      if (!obj[key]) (obj[key] as SliderFromTo) = {};
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        if (handle) (obj[key] as SliderFromTo)[handle as keyof SliderFromTo] = value;
      }
    };

    if (customSlider?.noUiSlider)
      customSlider?.noUiSlider.on('update', (arr: (string | number)[], handle: number) => {
        const curValue = curValues ? curValues[handle].innerHTML : '';
        skipValues[handle].innerHTML = curValue;
        setKeyValue(this.actualData, selector, FromToKeys[handle], +curValue);
        this.changeDataCards(this.actualData);
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
