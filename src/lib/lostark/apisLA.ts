import { Character, CharacterData } from "../../interfaces";
import { classesMap } from "./classes";
import Abilities from "../../lib/lostark/Ability.json";
import ArkPassives from "../../lib/lostark/ArkPassives.json";
import { getAbilityName } from "./parseEngravings";
import { getArkPassiveInfo } from "./parseAP";

export class LostArkAPI {
  // DI
  constructor() {}
  private mathiURL = "https://uwuowo.mathi.moe/api";
  private inspectURL = "https://api.snow.xyz/inspect";

  async roster(name: string) {
    // Implementation
    const url = `${this.mathiURL}/roster/NAE/${name}`;
    const opts: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const api = await fetch(url, opts);
    const data = (await api.json()) as Character[];
    if (data.length === 0) {
      return;
    }

    // noptsd
    const enhancedRoster = data.map((character) => {
      return {
        name: character.name,
        lastUpdate: `<t:${Math.floor(
          new Date(character.lastUpdate).getTime() / 1000
        )}:R>`,
        class: classesMap[character.class],
        ilvl: Math.round(character.ilvl * 100) / 100,
      };
    });

    return enhancedRoster;
  }

  async character(name: string) {
    // Implementation
    try {
      const url = `${this.inspectURL}`;
      const opts: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Boss: "Argeos",
          Region: "NAE",
          Version: "1.22.4",
          ClientId: "b92b3788-5d70-4596-9bc9-ced95ba873a8",
          Characters: [name],
        }),
      };
      const api = await fetch(url, opts);
      const data = (await api.json())[name] as CharacterData;
      const engravings = data.engravings.map((engravingId) => {
        return getAbilityName(engravingId);
      });
      if (!data.arkPassiveEnabled) {
        return {
          engravings,
        };
      }
      const evolution = data.arkPassiveData.evolution.map((group) => {
        return getArkPassiveInfo(group.id, group.lv);
      });

      const enlightenment = data.arkPassiveData.enlightenment.map((group) => {
        return getArkPassiveInfo(group.id, group.lv);
      });
      const leap = data.arkPassiveData.leap.map((group) => {
        return getArkPassiveInfo(group.id, group.lv);
      });

      return {
        engravings,
        arkPassiveEnabled: data.arkPassiveEnabled,
        arkpassive: { evolution, enlightenment, leap },
      };
    } catch (error) {
      console.log(error);
      return;
    }
  }
  async singleRoster(name: string) {
    // Implementation
    const url = `${this.mathiURL}/character/NAE/${name}`;
    const opts: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const api = await fetch(url, opts);
    const data = (await api.json()) as Character;

    // puede venir vacio
    if (!data) {
      return;
    }

    return {
      name: data.name,
      class: classesMap[data.class],
      ilvl: Math.round(data.ilvl * 100) / 100,
    };
  }
}
