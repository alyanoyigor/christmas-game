import { ToyCardData } from 'common/interfaces';
import { HTMLElementEvent } from 'common/types';
import { data } from 'data/data';
import { Page } from 'views/page/page';
import './index.scss';

export class TreePage extends Page {
  private treePageHTML: Element | null;
  private tree: HTMLImageElement | null;

  constructor() {
    super();
    this.treePageHTML = this.createHtmlElement(this.render());
    this.tree = this.findElement(this.treePageHTML, '.tree');
  }
  draw(selectedNumCards: String[]) {
    this.createTrees();
    this.createTreeBg();
    this.toggleMusic();
    this.addToyCards(selectedNumCards);
    this.garlandListeners();
    const main = document.querySelector('.main');
    main?.append(this.treePageHTML ? this.treePageHTML : '');
    this.targetDrag();
    this.toggleSnow();
  }
  createTrees() {
    const DEFAULT_TREES_AMOUNT = 4;
    const defaultTrees = this.findElement(this.treePageHTML, '.default-trees');
    if (defaultTrees) defaultTrees.innerHTML = '';
    for (let i = 1; i <= DEFAULT_TREES_AMOUNT; i++) {
      const defaultTree = document.createElement('button');
      defaultTree.classList.add('default-tree');
      defaultTree.style.backgroundImage = `url('assets/tree/${i}.webp')`;
      defaultTree.addEventListener('click', () => {
        if (this.tree) this.tree.src = `assets/tree/${i}.webp`;
      });
      defaultTrees?.append(defaultTree);
    }
  }
  createTreeBg() {
    const TREES_BG_AMOUNT = 8;
    const defaultTreesBg = this.findElement(this.treePageHTML, '.select-bg-trees');
    if (defaultTreesBg) defaultTreesBg.innerHTML = '';
    for (let i = 1; i <= TREES_BG_AMOUNT; i++) {
      const defaultTreeBg = document.createElement('button');
      defaultTreeBg.classList.add('select-bg-tree');
      defaultTreeBg.style.backgroundImage = `url('assets/bg/${i}.webp')`;
      defaultTreeBg.addEventListener('click', () => {
        const bgTree: HTMLImageElement | null = this.findElement(this.treePageHTML, '.bg-tree');
        if (bgTree) bgTree.style.backgroundImage = `url('assets/bg/${i}.webp')`;
      });
      defaultTreesBg?.append(defaultTreeBg);
    }
  }
  addToyCards(selectedNumCards: String[]) {
    const selectedToys = this.findElement(this.treePageHTML, '.selected-toys');
    const DEFAULT_SELECTED_TOYS_NUM = 20;
    if (selectedToys) selectedToys.innerHTML = '';
    if (selectedNumCards.length) {
      selectedNumCards.forEach((num) => {
        const toyData = data.find((obj) => obj.num === num);
        if (toyData) selectedToys?.append(this.addToyCard(toyData));
      });
    } else {
      for (let i = 1; i <= DEFAULT_SELECTED_TOYS_NUM; i++) {
        selectedToys?.append(this.addToyCard(data[i]));
      }
    }
  }
  addToyCard(toyData: ToyCardData) {
    const selectedToy = document.createElement('div');
    selectedToy.classList.add('selected-toy');
    selectedToy.dataset.toyNum = toyData.num;
    const toyAmount = document.createElement('div');
    toyAmount.dataset.toyAmountNum = toyData.num;
    toyAmount.classList.add('selected-toy__amount');
    toyAmount.textContent = toyData ? toyData.count : null;
    selectedToy.append(toyAmount);
    for (let i = 0; i < +toyData.count; i++) {
      const toyImg = document.createElement('img');
      toyImg.src = `assets/toys/${toyData.num}.webp`;
      toyImg.alt = '';
      toyImg.draggable = true;
      toyImg.id = `${toyData.num}-${i}`;
      toyImg.dataset.toyImgNum = toyData.num;
      toyImg.classList.add('selected-toy__img');
      this.dragToy(toyImg);
      selectedToy.append(toyImg);
    }
    return selectedToy;
  }
  dragToy(toyImg: HTMLElement) {
    function handleDragStart(e: DragEvent) {
      if (e.dataTransfer) {
        e.dataTransfer.setData('toy', (e.currentTarget as HTMLElement)?.id);
      }
    }

    toyImg.addEventListener('dragstart', handleDragStart);
  }
  targetDrag() {
    const handleOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDrop = (e: HTMLElementEvent<DragEvent, HTMLElement>) => {
      let draggedId = null;
      if (e instanceof DragEvent && e.dataTransfer) draggedId = e.dataTransfer.getData('toy');
      const draggedEl = draggedId ? document.getElementById(draggedId) : null;
      const num = draggedEl?.dataset.toyImgNum;

      if (draggedEl) {
        const parentEl = draggedEl.parentNode;
        const area = e.currentTarget;
        if (area instanceof HTMLElement) area?.appendChild(draggedEl);
        if (e instanceof Event) {
          draggedEl.style.top = `${e.pageY - draggedEl.offsetHeight / 2}px`;
          draggedEl.style.left = `${e.pageX - draggedEl.offsetWidth / 2}px`;
        }
        if (!draggedEl.classList.contains('dropped')) {
          const amountEl = document.querySelector(`[data-toy-amount-num="${num}"]`);
          const toysOneTypeCount = parentEl?.querySelectorAll('img');
          if (toysOneTypeCount)
            amountEl ? (amountEl.textContent = toysOneTypeCount.length.toString()) : null;
        }
        draggedEl.classList.add('dropped');
      }
    };
    const handleDragEnd = (e: HTMLElementEvent<MouseEvent, HTMLElement>) => {
      let toyX, toyY, treeRight, treeBottom, x, y;
      if (e instanceof MouseEvent) {
        toyX = e.clientX;
        toyY = e.clientY;
      }
      const tree = document.querySelector('.tree');
      const treeBoundingClientRect = tree?.getBoundingClientRect();
      const treeWidth = treeBoundingClientRect?.width;
      const treeHeight = treeBoundingClientRect?.height;

      if (treeBoundingClientRect && treeWidth) treeRight = treeBoundingClientRect?.x + treeWidth;
      if (treeBoundingClientRect && treeHeight) treeBottom = treeBoundingClientRect?.y + treeHeight;
      if (treeRight && toyX) x = treeRight - toyX;
      if (treeBottom && toyY) y = treeBottom - toyY;
      if (x && y && treeWidth && treeHeight) {
        const selectedToy = e.target instanceof HTMLElement ? e.target : null;
        if (x < 0 || y < 0) {
          toContainer(selectedToy);
        } else {
          if (treeWidth - x < 0 || treeHeight - y < 0) {
            toContainer(selectedToy);
          }
          return;
        }
      }
    };
    const toContainer = (elem: HTMLElement | null) => {
      if (elem) {
        elem.style.top = 'auto';
        elem.style.left = 'auto';
        elem.classList.remove('dropped');
      }
      const num = elem?.dataset.toyImgNum;
      const parentEl = document.querySelector(`[data-toy-num="${num}"]`);
      const amountEl = document.querySelector(`[data-toy-amount-num="${num}"]`);
      parentEl?.append(elem ? elem : '');
      const toysOneTypeCount = parentEl?.querySelectorAll('img');
      if (toysOneTypeCount)
        amountEl ? (amountEl.textContent = toysOneTypeCount.length.toString()) : null;
    };

    const target = <HTMLAreaElement>document.querySelector('.tree-area');
    document.addEventListener('dragend', handleDragEnd);
    target.addEventListener('dragover', handleOver);
    target.addEventListener('drop', handleDrop);
  }
  toggleMusic() {
    const musicBtn = this.findElement(this.treePageHTML, '.music-btn');
    const audio = new Audio('assets/audio/audio.mp3');
    let isPlaying = false;
    musicBtn?.addEventListener('click', () => {
      musicBtn.classList.toggle('animation-beat');
      isPlaying ? audio.pause() : audio.play();
    });

    audio.addEventListener('playing', () => (isPlaying = true));
    audio.addEventListener('pause', () => (isPlaying = false));
  }
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  addSnow() {
    const snowflakes = document.createElement('div');
    snowflakes.classList.add('snowflakes');
    const bgTree: HTMLElement | null = document.querySelector('.bg-tree');
    const bgTreeBoundingClientRect = bgTree ? bgTree.getBoundingClientRect() : null;
    bgTree?.append(snowflakes);
    if (bgTreeBoundingClientRect && bgTreeBoundingClientRect) {
      snowflakes.style.top = `${bgTreeBoundingClientRect.y > 0 ? bgTreeBoundingClientRect.y : 0}px`;
      snowflakes.style.left = `${bgTreeBoundingClientRect.x}px`;
    }

    const LIMIT_FLAKE = 100;
    const MIN_DIMENSION = 3;
    const MAX_DIMENSION = 9;
    const MIN_FLAKE_LEFT = 10;
    const MAX_FLAKE_LEFT = bgTree ? bgTree.offsetWidth : MIN_FLAKE_LEFT;
    setInterval(() => {
      const dimension = this.getRandomInt(MIN_DIMENSION, MAX_DIMENSION) + 'px';
      const flake =
        "<div class='drop animate' style='left:" +
        this.getRandomInt(MIN_FLAKE_LEFT, MAX_FLAKE_LEFT) +
        'px;width:' +
        dimension +
        ';height:' +
        dimension +
        "'></div>";
      if (snowflakes) snowflakes.insertAdjacentHTML('beforeend', flake);

      const list_flake: NodeListOf<Element> = document.querySelectorAll('.drop');
      if (list_flake.length > LIMIT_FLAKE) list_flake[list_flake.length - 1].remove();
    }, 200);
  }
  deleteElement(element: HTMLElement) {
    element.remove();
  }
  toggleSnow() {
    const snowBtn = document.querySelector('.snow-btn');
    snowBtn?.addEventListener('click', () => {
      snowBtn.classList.toggle('rotate');
      const snowflakes: HTMLElement | null = document.querySelector('.snowflakes');
      if (snowflakes) {
        this.deleteElement(snowflakes);
      } else {
        this.addSnow();
      }
    });
  }
  garlandListeners() {
    let curColor: string | undefined;
    const garlandCheckbox: HTMLInputElement | null = this.findElement(
      this.treePageHTML,
      '.garland-checkbox'
    );
    const garlandColors: HTMLElement | null = this.findElement(
      this.treePageHTML,
      '.garland-colors'
    );
    const garlandContainer: HTMLElement | null = this.findElement(
      this.treePageHTML,
      '.garland-container'
    );
    garlandCheckbox?.addEventListener('input', (e) => {
      garlandContainer ? (garlandContainer.innerHTML = '') : null;
      garlandContainer?.classList.toggle('hide');
      if (garlandCheckbox.checked) {
        this.addGarland(curColor);
      }
    });
    garlandColors?.addEventListener('click', (e: HTMLElementEvent<Event, HTMLElement>) => {
      garlandContainer ? (garlandContainer.innerHTML = '') : null;
      garlandContainer?.classList.remove('hide');
      garlandCheckbox ? (garlandCheckbox.checked = true) : null;
      const target = e.target;
      if (target instanceof HTMLElement) curColor = target.dataset.color;
      this.addGarland(curColor);
    });
  }
  addGarland(color?: string) {
    const colorsArr = ['red', 'green', 'blue', 'yellow', 'pink'];
    const addToGarlandContainer = (garlandLine: HTMLElement) => {
      const garlandContainer: HTMLElement | null = this.findElement(
        this.treePageHTML,
        '.garland-container'
      );
      garlandContainer ? garlandContainer.append(garlandLine) : null;
    };
    const addLine = (top: number, amount: number) => {
      const garlandLine = document.createElement('ul');
      garlandLine.classList.add('garland-line');
      garlandLine.style.top = `${top}%`;
      for (let i = 0; i < amount; i++) {
        const garlandLight = document.createElement('li');
        if (color) {
          garlandLight.classList.add(`${color}`);
        } else {
          garlandLight.classList.add(`${colorsArr[this.getRandomInt(0, colorsArr.length)]}`);
        }
        garlandLine.append(garlandLight);
      }
      addToGarlandContainer(garlandLine);
    };
    addLine(10, 4);
    addLine(25, 6);
    addLine(40, 8);
    addLine(55, 9);
    addLine(70, 10);
  }
  render() {
    return `<div class="page-tree">
              <div class="page-tree__settings">
                <div class="interact-block">
                  <button class="music-btn"></button>
                  <button class="snow-btn"></button>
                </div>
                <div class="select-tree">
                  <h3 class="title select-tree__title">Выберите Ёлку</h3>
                  <div class="default-trees"></div>
                </div>
                <div class="bg-trees-box">
                  <h3 class="title">Выберите фон</h3>
                  <div class="select-bg-trees"></div>
                </div>
                <div class="garland-box">
                  <div class="garland-title-box">
                    <h3 class="title garland-title">Гирлянда</h3>
                    <label class="garland-switch" for="garland-checkbox">
                      <input type="checkbox" class="garland-checkbox" id="garland-checkbox" />
                      <div class="garland-slider"></div>
                    </label>
                  </div>
                  <div class="garland-colors">
                    <button class="garland-color rainbow-color"></button>
                    <button class="garland-color red-color" data-color="red"></button>
                    <button class="garland-color green-color" data-color="green"></button>
                    <button class="garland-color blue-color" data-color="blue"></button>
                    <button class="garland-color yellow-color" data-color="yellow"></button>
                  </div>
                </div>
                <button class="save-tree-btn">Сохранить</button>
              </div>
              <div class="bg-tree">
                <map name="tree-map">
                  <area class="tree-area" coords="365,699,189,706,113,683,31,608,2,555,2,539,18,437,73,351,106,224,161,134,243,-1,306,75,353,144,399,221,424,359,452,459,496,550,444,664" shape="poly"></area>
                  <div class="tree-container">
                    <img usemap="#tree-map" src="assets/tree/1.webp" class="tree" alt="Tree" />
                    <div class="garland-container hide"></div>
                  </div>
                </map>
              </div>
              <div class="page-tree__toys">
                <div class="selected-toys-box">
                  <h3 class="title">Игрушки</h3>
                  <div class="selected-toys"></div>
                </div>
                <div class="decorated-trees-box">
                  <h3 class="title">Вы нарядили</h3>
                  <div class="decorated-trees">
                    <div class="decorated-tree"></div>
                    <div class="decorated-tree"></div>
                    <div class="decorated-tree"></div>
                    <div class="decorated-tree"></div>
                  </div>
                </div>
              </div>
            </div>`;
  }
}
