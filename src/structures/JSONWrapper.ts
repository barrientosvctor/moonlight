import jsonData from "../util/data.json" with { type: "json" };

type JSONKey = keyof typeof jsonData;

export class JSONWrapper {
  private readonly data = jsonData;

  get<ItemType extends string>(key: JSONKey, item: ItemType) {
    const index = Object.keys(this.data[key]).indexOf(item);
    return Object.values(this.data[key])[index];
  }
}
