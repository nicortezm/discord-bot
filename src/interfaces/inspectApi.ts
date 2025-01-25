export interface CharacterData {
  arkPassiveEnabled: boolean;
  arkPassiveData: ArkPassiveData;
  engravings: number[];
  gems: Gem[];
}

export interface ArkPassiveData {
  evolution: ArkPassiveGroup[];
  enlightenment: ArkPassiveGroup[];
  leap: ArkPassiveGroup[];
}

export interface ArkPassiveGroup {
  id: number;
  lv: number;
}

export interface Gem {
  tier: number;
  gemType: number;
  value: number;
  skillId: number;
}
