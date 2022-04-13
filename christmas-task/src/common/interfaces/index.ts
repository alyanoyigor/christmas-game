import * as noUiSlider from 'nouislider';

interface CustomSlider {
  customSlider: noUiSlider.target;
}

export interface SliderOptions {
  step: number;
  start: number;
  end: number;
  min: number;
  max: number;
}

export interface SliderData extends CustomSlider, SliderOptions {}

export interface ActualData {
  selectedNumCards?: String[];
  sort?: string;
  count?: SliderFromTo;
  year?: SliderFromTo;
  shape?: String[];
  color?: String[];
  size?: String[];
  isFav?: boolean;
  search?: string;
}

export interface InitNoUiSlider extends SliderOptions {
  selector: keyof ActualData;
}

export interface SliderFromTo {
  from?: number;
  to?: number;
}

export interface ToyCardData {
  num: string;
  name: string;
  count: string;
  year: string;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
}
