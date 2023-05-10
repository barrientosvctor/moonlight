export interface IClashRoyaleDeckData {
  name: string;
  id: number;
  level: number;
  startLevel: number;
  maxLevel: number;
  count: number;
  iconUrls: { medium: string; };
}

export interface IClashRoyalePlayerUpcomingChests {
  index: number;
  name: string;
}
