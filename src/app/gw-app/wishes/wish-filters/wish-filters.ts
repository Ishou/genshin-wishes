import { Params } from '@angular/router';
import { Item } from '../../../api/item';

export class WishFilters {
  freeText?: string;
  ranks: number[] = [];
  itemType?: 'Character' | 'Weapon';
  characterEvents: number[] = [];
  weaponEvents: number[] = [];

  constructor(params?: Params | WishFilters) {
    if (!params) {
      return;
    }

    this.freeText = params.freeText;
    this.ranks = []
      .concat(params.ranks ? params.ranks : [])
      .map((one: string) => +one);
    this.characterEvents = []
      .concat(params.characterEvents ? params.characterEvents : [])
      .map((one: string) => +one);
    this.weaponEvents = []
      .concat(params.weaponEvents ? params.weaponEvents : [])
      .map((one: string) => +one);
    this.itemType = params.itemType;
  }

  isEmpty(): boolean {
    return (
      !this.freeText &&
      !this.ranks.length &&
      !this.itemType &&
      !this.characterEvents.length &&
      !this.weaponEvents.length
    );
  }

  reset(): void {
    this.freeText = '';
    this.ranks = [];
    this.characterEvents = [];
    this.weaponEvents = [];
    this.itemType = undefined;
  }

  addToRouteParams(params: Params): Params {
    if (this.freeText) params.freeText = this.freeText;

    if (this.ranks.length) params.ranks = this.ranks.map((one) => one + '');

    if (this.characterEvents.length)
      params.characterEvents = this.characterEvents.map((one) => one + '');

    if (this.weaponEvents.length)
      params.weaponEvents = this.weaponEvents.map((one) => one + '');

    if (this.itemType) params.itemType = this.itemType;

    return params;
  }

  addToQueryParams(translatedItems: Item[], params: Params): Params {
    this.addToRouteParams(params);
    delete params.freeText;

    const freeText = this.freeText || '';

    if (this.freeText) {
      params.items = translatedItems
        .filter((i) => i.name.toLowerCase().includes(freeText.toLowerCase()))
        .map((i) => i.itemId + '');
    }

    return params;
  }
}
