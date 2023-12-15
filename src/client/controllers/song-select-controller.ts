import { Controller } from "@flamework/core";

import { SongDifficulty } from "shared/structs/song-info";
import Log from "shared/logger";

@Controller()
export class SongSelectController {
  public song?: SongName;
  public difficulty?: SongDifficulty;
  public part?: keyof SongParts;

  public deselectAll(): void {
    this.song = undefined;
    this.difficulty = undefined;
    this.part = undefined;
  }

  public selectSong(song: SongName): void {
    Log.info(`Selected song "${song}"`);
    this.song = song;
  }

  public selectDifficulty(difficulty: SongDifficulty): void {
    Log.info(`Selected difficulty "${SongDifficulty[difficulty]}"`);
    this.difficulty = difficulty;
  }

  public selectPart(part: keyof SongParts): void {
    Log.info(`Selected part "${part}"`);
    this.part = part;
  }
}