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

interface IData {
  num: string;
  name: string;
  count: string;
  year: string;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
}

export class Model {
  async getCardsData(): Promise<IData[]> {
    try {
      const requestJSON = await fetch(
        'https://raw.githubusercontent.com/alyanoyigor/christmas-task-data/main/data.json'
      );
      const data = await requestJSON.json();
      return data;
    } catch (e) {
      throw e;
    }
  }
}
