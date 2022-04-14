import { ToyCardData } from 'common/interfaces';
import './index.scss';

export class ToyCard {
  private num: string;
  private name: string;
  private count: string;
  private year: string;
  private shape: string;
  private color: string;
  private size: string;
  private favorite: boolean;

  constructor({ num, name, count, year, shape, color, size, favorite }: ToyCardData) {
    this.num = num;
    this.name = name;
    this.count = count;
    this.year = year;
    this.shape = shape;
    this.color = color;
    this.size = size;
    this.favorite = favorite;
  }

  render(): string {
    return `<div class="toy-card" id="${this.num}">
              <h3 class="toy-card__title">${this.name}</h3>
              <img src="./assets/toys/${this.num}.webp" alt="${this.name}" class="toy-card__img" />
              <p class="toy-card__text">Количество: 
                <span class="toy-card__amount">${this.count}</span>
              </p>
              <p class="toy-card__text">Год покупки: 
                <span class="toy-card__year">${this.year} год</span>
              </p>
              <p class="toy-card__text">Форма игрушки: 
                <span class="toy-card__shape">${this.shape}</span>
              </p>
              <p class="toy-card__text">Цвет игрушки: 
                <span class="toy-card__color">${this.color}</span>
              </p>
              <p class="toy-card__text">Размер игрушки: 
                <span class="toy-card__size">${this.size}</span>
              </p>
              <p class="toy-card__text">Любимая: 
                <span class="toy-card__is-fav">${this.favorite ? 'да' : 'нет'}</span>
              </p>
            </div>`;
  }
}
