import { ActualData } from "common/interfaces";

export class Model {
  async getCardsData(): Promise<ActualData[]> {
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
