import { classesMap } from "./classes";

export interface InputData {
  type: string;
  nodes: (null | NodeData)[];
}

export interface NodeData {
  type: string;
  data: any[];
  uses: {
    params: string[];
    parent?: number;
  };
}

export interface TransformedData {
  header: {
    world: string;
    rosterLevel: number;
    stronghold: string;
    guild: string;
  };
  roster: RosterCharacter[];
}

export interface RosterCharacter {
  name: string;
  class: string;
  ilvl: number;
  lastUpdate: string;
}

// transformer.ts
export class DataTransformer {
  private static getValueByIndex(data: any[], index: number): any {
    if (typeof index === "number" && index >= 0 && index < data.length) {
      return data[index];
    }
    return index;
  }

  private static getStrongholdName(data: any[], strongholdObj: any): string {
    if (typeof strongholdObj === "object" && strongholdObj !== null) {
      return this.getValueByIndex(data, strongholdObj.name);
    }
    return strongholdObj;
  }

  private static getGuildName(data: any[], guildObj: any): string {
    if (typeof guildObj === "object" && guildObj !== null) {
      return this.getValueByIndex(data, guildObj.name);
    }
    return guildObj;
  }

  public static transform(inputData: InputData): TransformedData {
    const headerNode = inputData.nodes[1]?.data;
    const rosterNode = inputData.nodes[2]?.data;

    if (!headerNode || !rosterNode) {
      throw new Error("Invalid input data structure");
    }

    // Get header mapping
    const headerMapping = headerNode[1] as Record<string, number>;

    // Get raw stronghold and guild objects
    const strongholdRaw = this.getValueByIndex(
      headerNode,
      headerMapping.stronghold
    );
    const guildRaw = this.getValueByIndex(headerNode, headerMapping.guild);

    // Transform header data
    const header = {
      world: this.getValueByIndex(headerNode, headerMapping.world),
      rosterLevel: this.getValueByIndex(headerNode, headerMapping.rosterLevel),
      stronghold: this.getStrongholdName(headerNode, strongholdRaw),
      guild: this.getGuildName(headerNode, guildRaw),
    };

    // Transform roster data
    const rosterIndices = rosterNode[1] as number[];
    const roster: RosterCharacter[] = rosterIndices
      .map((charIndex) => {
        const charData = rosterNode[charIndex] as Record<string, number>;

        return {
          name: this.getValueByIndex(rosterNode, charData.name),
          class: classesMap[this.getValueByIndex(rosterNode, charData.class)],
          ilvl:
            Math.round(this.getValueByIndex(rosterNode, charData.ilvl) * 100) /
            100,
          lastUpdate: `<t:${this.getValueByIndex(
            rosterNode,
            charData.lastUpdate
          )}:R>`,
        };
      })
      .filter((char): char is RosterCharacter => char !== null);

    return {
      header,
      roster,
    };
  }
}
