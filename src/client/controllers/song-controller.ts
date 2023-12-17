import { Controller, OnStart, type OnRender } from "@flamework/core";
import type { Components } from "@flamework/components";
import { CollectionService, StarterGui, SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import Signal from "@rbxts/signal";

import { Assets } from "shared/utilities/helpers";
import { SongDifficulty, type SongInfo } from "shared/structs/song-info";
import Log from "shared/logger";

import type { RhythmBoard } from "client/components/rhythm-board";
import type { BeatController } from "./beat-controller";
import type { ScoreController } from "./score-controller";

@Controller()
export class SongController implements OnStart, OnRender {
  public readonly partChanged = new Signal<(newPart: keyof SongParts) => void>;
  public difficulty = SongDifficulty.Expert;

  private readonly songJanitor = new Janitor;
  private rhythmBoard?: RhythmBoard;
  private part: keyof SongParts = "Lead";
  private elapsed = 0;

  public constructor(
    private readonly components: Components,
    private readonly beatController: BeatController,
    private readonly score: ScoreController
  ) {}

  public async onStart(): Promise<void> {
    const boardModel = <Part>CollectionService.GetTagged("RhythmBoard").find(instance => !instance.IsDescendantOf(StarterGui));
    this.rhythmBoard = await this.components.waitForComponent<RhythmBoard>(boardModel);
  }

  public onRender(dt: number): void {
    if (!this.beatController.active || !this.rhythmBoard) return;

    this.rhythmBoard.update(this.elapsed);
    this.elapsed += dt;
  }

  public start(): void {
    this.playIntroMetronome();
    this.beatController.start(() => this.cleanup());
  }

  public set(songName: SongName): void {
    this.score.setSong(songName);
    this.beatController.currentSong = this.getSongInfo(songName);
    this.rhythmBoard!.beatDuration = this.beatController.getBeatDuration();
  }

  public setDifficulty(difficulty: SongDifficulty): void {
    this.difficulty = difficulty;
    this.assignPart(this.part);
  }

  public assignPart(partName: keyof SongParts): void {
    const difficultyName = this.getDifficultyName();
    const songParts = this.beatController.currentSong!.Instance.Parts;
    const noteTrack = this.songJanitor.Add(songParts[difficultyName][partName].Clone());

    this.score.setTotalNotes(noteTrack.GetChildren().size());
    this.rhythmBoard!.setNoteTrack(noteTrack);
    this.part = partName;
    this.partChanged.Fire(this.part);
  }

  public getCurrentNoteTrack(): Maybe<Model> {
    return this.rhythmBoard?.noteTrack;
  }

  private playIntroMetronome(): void {
    const beatDuration = this.beatController.getBeatDuration();
    Sound.Tick.Play();
    task.wait(beatDuration * 2);
    Sound.Tick.Play();
    task.wait(beatDuration * 2);
    Sound.Tick.Play();
    task.wait(beatDuration);
    Sound.Tick.Play();
    task.wait(beatDuration);
    Sound.Tick.Play();
    task.wait(beatDuration);
    Sound.Tick.Play();
    task.wait(beatDuration);
  }

  private getSongInfo(songName: SongName): SongInfo {
    const song = Assets.Songs[songName];
    const tempo = <number>song.GetAttribute("Tempo");

    return {
      Instance: song,
      Tempo: tempo
    };
  }

  private cleanup(): void {
    Log.info("Cleaned up song");
    this.songJanitor.Cleanup();
    this.beatController.stop();
    this.elapsed = 0;
  }

  private getDifficultyName(): keyof typeof SongDifficulty {
    return <keyof typeof SongDifficulty>SongDifficulty[this.difficulty];
  }
}