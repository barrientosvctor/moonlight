import jsonData from "../util/data.json" with { type: "json" };

type JSONKey = keyof typeof jsonData;

export class JSONWrapper {
  private static __instance: JSONWrapper;
  private readonly data;

  private constructor() {
    this.data = jsonData;
  }

  static get Instance(): JSONWrapper {
    if (!JSONWrapper.__instance)
      JSONWrapper.__instance = new JSONWrapper();

    return JSONWrapper.__instance;
  }

  get<ItemType extends string>(key: JSONKey, item: ItemType) {
    const index = Object.keys(this.data[key]).indexOf(item);
    return Object.values(this.data[key])[index];
  }
}
