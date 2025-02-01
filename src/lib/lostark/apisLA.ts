import { Character, CharacterData } from "../../interfaces";
import { getAbilityName } from "./parseEngravings";
import { getArkPassiveInfo } from "./parseAP";
import { DataTransformer, InputData } from "./parseJsonMathi";
export class LostArkAPI {
  // DI
  constructor() {}
  private mathiURL = "https://uwuowo.mathi.moe/character";
  private inspectURL = "https://api.snow.xyz/inspect";

  async roster(name: string, region: string = "NAE") {
    // Implementation
    try {
      const url = `${this.mathiURL}/${region}/${name}/roster/__data.json`;
      const opts: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const api = await fetch(url, opts);
      const data = (await api.json()) as InputData;
      const transformed = DataTransformer.transform(data);
      return transformed;
    } catch (error) {
      return;
    }
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
    return "Not implemented yet";
  }
}
