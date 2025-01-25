import ArkPassives from "../../lib/lostark/ArkPassives.json";

type ArkPassiveLevel = {
  name: string;
  desc: string;
  icon: string;
};

type ArkPassive = {
  id: number;
  levels: Record<string, ArkPassiveLevel>;
};

type ArkPassivesType = {
  [key: string]: ArkPassive;
};

const typedArkPassives = ArkPassives as ArkPassivesType;

export function getArkPassiveInfo(
  id: number,
  level: number
): { name: string; level: number } {
  const passive = typedArkPassives[id.toString()];
  return {
    name: passive.levels[level.toString()].name,
    level: level,
  };
}
