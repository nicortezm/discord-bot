import Abilities from "./Ability.json";

// Explicitly type the Abilities import
type AbilityLevel = {
  desc: string | null;
  values: number[] | null;
};

type Ability = {
  id: number;
  name: string | null;
  // icon: string | null;
  levels: Record<string, AbilityLevel>;
  // featureType: string;
  // isEngrave: boolean;
  // isPenalty: boolean;
};

type AbilitiesType = {
  [key: string]: Ability;
};

const typedAbilities = Abilities as AbilitiesType;

export function getAbilityName(id: number): string | null  {
  return typedAbilities[id.toString()].name;
}
