import { EventBuilderParameters } from "../types/eventBuilder.js";

export class EventBuilder implements EventBuilderParameters {
  name: EventBuilderParameters["name"];
  once?: EventBuilderParameters["once"];
  execute: EventBuilderParameters["execute"];

  constructor(private readonly __params: EventBuilderParameters) {
    this.name = __params.name;
    this.once = __params.once ?? false;
    this.execute = __params.execute;
  }
}
