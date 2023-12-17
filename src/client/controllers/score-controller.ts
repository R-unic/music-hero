import { Controller, OnStart } from "@flamework/core";
import Signal from "@rbxts/signal";

import { Events, Functions } from "client/network";
import type SongScoreTable from "shared/data-models/song-score-table";
import Log from "shared/logger";

const { incrementData, setData } = Events;
const { getData } = Functions;
const { round, floor, clamp } = math;

const MAX_MULTIPLIER = 16;

@Controller()
export class ScoreController implements OnStart {
  public readonly overdriveProgressChanged = new Signal<(newProgress: number) => void>;
  public readonly nextMultiplierProgressChanged = new Signal<(newProgress: number) => void>;
  public readonly multiplierChanged = new Signal<(newMultiplier: number) => void>;
  public readonly changed = new Signal<(newScore: number) => void>;

  private currentSong?: SongName;
  private inOverdrive = false;
  private overdriveProgress = 0;
  private current = 0;
  private multiplier = 1;
  private nextMultiplierProgress = 0;
  private completedNotes = 0;
  private perfectNotes = 0;
  private totalNotes = 0;

  public onStart(): void {
    this.multiplierChanged.Fire(this.multiplier);
    this.overdriveProgressChanged.Fire(this.overdriveProgress);
    this.nextMultiplierProgressChanged.Fire(this.nextMultiplierProgress);
  }

  public setSong(songName: SongName): void {
    this.currentSong = songName;
  }

  public setTotalNotes(totalNotes: number): void {
    this.totalNotes = totalNotes;
  }

  public add(amount: number): void {
    if (!this.currentSong) return;
    this.current += amount * this.multiplier * (this.inOverdrive ? 2 : 1);
    this.changed.Fire(this.current);
  }

  public addCompletedNote(lastOfOverdriveGroup: boolean, perfect: boolean, accuracy: number): void {
    if (!this.currentSong) return;
    if (lastOfOverdriveGroup)
      this.addOverdriveProgress(25);

    this.addMultiplierProgress(round(30 / (this.multiplier / 2.5)))
    const baseScore = 10 + (perfect ? 5 : 0);
    this.add(floor(baseScore * accuracy));
    this[perfect ? "perfectNotes" : "completedNotes"]++;
    Log.info("Completed note" + (perfect ? " (perfect)" : "") + "!")
  }

  public async saveResult(): Promise<void> {
    if (!this.currentSong) return;
    const scorecard: SongScoreTable = {
      goodNotes: this.completedNotes,
      perfectNotes: this.perfectNotes,
      missedNotes: this.totalNotes - this.perfectNotes - this.completedNotes,
      points: this.current,
      stars: this.calculateStars()
    };

    const songScores = <Record<SongName, SongScoreTable[]>>await getData("songScores");
    if (!songScores[this.currentSong])
      songScores[this.currentSong] = [];

    songScores[this.currentSong].push(scorecard);
    await setData("songScores", songScores);
    incrementData("stars", scorecard.stars);

    this.reset();
  }

  public activateOverdrive(): void {
    if (!this.currentSong) return;
    if (this.inOverdrive) return;
    if (this.overdriveProgress === 0) return;

    this.inOverdrive = true;
    task.spawn(() => {
      while (this.overdriveProgress > 0) {
        task.wait(0.1);
        this.addOverdriveProgress(-1);
      }
      this.inOverdrive = false;
    });
  }

  public resetMultiplier(): void {
    this.multiplier = 1;
    this.multiplierChanged.Fire(this.multiplier);
    this.nextMultiplierProgress = 0;
  }

  private nextMultiplier(): void {
    if (this.multiplier === MAX_MULTIPLIER) return;
    this.multiplier = math.min(this.multiplier * 2, MAX_MULTIPLIER);
    this.multiplierChanged.Fire(this.multiplier);
    this.nextMultiplierProgress = 0;
    this.nextMultiplierProgressChanged.Fire(this.nextMultiplierProgress);
  }

  private addMultiplierProgress(progress: number): void {
    if (!this.currentSong) return;
    if (this.multiplier === MAX_MULTIPLIER) return;
    this.setMultiplierProgress(this.nextMultiplierProgress + progress);
  }

  private setMultiplierProgress(progress: number): void {
    if (!this.currentSong) return;
    if (progress >= 100) {
      const residual = progress - 100;
      this.nextMultiplier();
      this.addMultiplierProgress(residual)
    } else
      this.nextMultiplierProgress = clamp(progress, 0, 100);

    this.nextMultiplierProgressChanged.Fire(this.nextMultiplierProgress);
  }

  private addOverdriveProgress(progress: number): void {
    if (!this.currentSong) return;
    this.setOverdriveProgress(this.overdriveProgress + progress);
  }

  private setOverdriveProgress(progress: number): void {
    if (!this.currentSong) return;
    this.overdriveProgress = clamp(progress, 0, 100);
    this.overdriveProgressChanged.Fire(this.overdriveProgress);
  }

  private reset(): void {
    this.resetMultiplier();
    this.current = 0;
    this.changed.Fire(this.current);
    this.setOverdriveProgress(0);
    this.completedNotes = 0;
    this.perfectNotes = 0;
    this.totalNotes = 0;
    this.currentSong = undefined;
  }

  private calculateStars(): 0 | 1 | 2 | 3 | 4 | 5 {
    if (this.current >= 95)
      return 5;
    else if (this.current >= 90)
      return 4;
    else if (this.current >= 80)
      return 3;
    else if (this.current >= 70)
      return 2;
    else if (this.current >= 40)
      return 1;
    else
      return 0;
  }
}