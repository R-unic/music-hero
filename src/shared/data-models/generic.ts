import type Keybinds from "./keybinds";
import type SongScoreTable from "./song-score-table";

export interface GameDataModel {
  coins: number;
  stars: number;
  diamonds: number;
  keybinds: string[];
  songScores: Record<SongName, SongScoreTable>[];
}

export type DataValue = GameDataModel[DataKey];
export type DataKey = keyof GameDataModel;

export const DataKeys: DataKey[] = [
  "coins", "stars", "diamonds",
  "keybinds", "songScores"
];