
export interface Weapon {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface Aspect {
  id: string;
  weaponId: string;
  name: string;
  description: string;
  hidden?: boolean;
}

export interface BuildRecommendation {
  slot: string;
  god: string;
  boonName: string;
  description: string; // In-game text and specific stats
  explanation: string; // Strategic reasoning/synergy
  rarity?: string;
  imageUrl?: string; // Wiki image URL
}

export interface BuildGuide {
  aspectName: string;
  playstyle: string;
  boons: {
    attack: BuildRecommendation;
    special: BuildRecommendation;
    cast: BuildRecommendation;
    sprint: BuildRecommendation;
    magick: BuildRecommendation;
  };
  hammers: {
    name: string;
    description: string;
    synergy: string;
  }[];
  duos: {
    boonName: string;
    gods: string[];
    description: string; // In-game effect
    explanation: string; // Strategic reasoning/synergy
  }[];
  sources?: {
    title: string;
    uri: string;
  }[];
}

export interface RarityStats {
  common?: string;
  rare?: string;
  epic?: string;
  heroic?: string;
}

export interface StaticBoon {
  name: string;
  slot: string;
  effect: string;
  element?: string;
  values?: RarityStats;
  statLabel?: string;
}

export interface BoonDatabase {
  [godName: string]: StaticBoon[];
}