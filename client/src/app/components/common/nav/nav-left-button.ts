import { Type } from "@angular/core";

export class LeftNavButton {
  constructor(public component: Type<any>, public data: { label: string, callback(): void }) { }
}
