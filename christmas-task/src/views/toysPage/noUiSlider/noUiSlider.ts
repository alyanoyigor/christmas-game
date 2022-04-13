import { SliderData } from 'common/interfaces';
import * as noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import 'nouislider/dist/nouislider.css';



export class NoUiSlider {
  drawSlider({ customSlider, step, start, end, min, max }: SliderData): void {
    noUiSlider.create(customSlider, {
      start: [start, end],
      step,
      connect: true,
      range: {
        min,
        max,
      },
      tooltips: wNumb({ decimals: 0 }),
    });
  }
}
