export interface IClashRoyaleDeckData {
  name: string;
  id: number;
  level: number;
  startLevel: number;
  maxLevel: number;
  count: number;
  iconUrls: { medium: string };
}

export interface IClashRoyalePlayerUpcomingChests {
  index: number;
  name: string;
}

export interface IClashRoyaleItemsClanData {
  tag: string;
  name: string;
  type: string;
  badgeId: number;
  clanScore: number;
  clanWarTrophies: number;
  location: { id: number; name: string; isCountry: boolean };
  requiredTrophies: number;
  donationsPerWeek: number;
  clanChestLevel: number;
  clanChestMaxLevel: number;
  members: number;
}

export interface IClashRoyaleClanMemberData {
  tag: string;
  name: string;
  role: string;
  lastSeen: string;
  expLevel: number;
  trophies: number;
  arena: { id: number; name: string; },
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  clanChestPoints: number;
}

export interface IClashRoyaleClanData extends IClashRoyaleItemsClanData {
  description: string;
  clanChestStatus: string;
  memberList: IClashRoyaleClanMemberData[];
}

export interface IClashRoyaleTournamentItemData {
  tag: string;
  type: string;
  name: string;
  status: string;
  creatorTag: string;
  levelCap: number;
  firstPlaceCardPrize: number;
  capacity: number;
  maxCapacity: number;
  preparationDuration: number;
  duration: number;
  createdTime: string;
}

export interface IClashRoyaleTournamentMemberData {
  tag: string;
  name: string;
  score: number;
  rank: number;
  clan: { tag: string; name: string; };
}

export interface IClashRoyaleTournamentData extends IClashRoyaleTournamentItemData {
  startedTime: string;
  membersList: IClashRoyaleTournamentMemberData[];
}
