import * as noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import '../../../../node_modules/nouislider/dist/nouislider.css';

interface SliderData {
  customSlider: noUiSlider.target;
}

export interface CreateSliderData {
  step: number;
  start: number;
  end: number;
  min: number;
  max: number;
}

interface DrawSliderData extends SliderData, CreateSliderData {}

export class NoUiSlider {
  drawSlider({ customSlider, step, start, end, min, max }: DrawSliderData): void {
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
