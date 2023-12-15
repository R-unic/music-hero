import { Controller, OnStart, type OnRender } from "@flamework/core";
import type { Components } from "@flamework/components";
import { CollectionService, StarterGui } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Assets } from "shared/utilities/helpers";
import { SongDifficulty, type SongInfo } from "shared/structs/song-info";
import Log from "shared/logger";

import type { RhythmBoard } from "client/components/rhythm-board";
import type { BeatVisualizer } from "client/components/ui/beat-visualizer";
import type { BeatController } from "./beat-controller";

@Controller()
export class SongController implements OnStart, OnRender {
  private readonly songJanitor = new Janitor;

  private elapsed = 0;
  private difficulty = SongDifficulty.Expert;
  private part: keyof SongParts = "Lead";
  private rhythmBoard?: RhythmBoard;

  public constructor(
    private readonly components: Components,
    private readonly beatController: BeatController
  ) {}

  public async onStart(): Promise<void> {
    task.wait(5)
    const boardModel = <Part>CollectionService.GetTagged("RhythmBoard").find(instance => !instance.IsDescendantOf(StarterGui));
    this.rhythmBoard = await this.components.waitForComponent<RhythmBoard>(boardModel);

    const beatVisualizerFrame = <Frame>CollectionService.GetTagged("BeatVisualizer").find(instance => !instance.IsDescendantOf(StarterGui));
    const beatVisualizer = await this.components.waitForComponent<BeatVisualizer>(beatVisualizerFrame);
    this.beatController.onBeat.Connect(() => beatVisualizer.visualizeBeat());
    this.beatController.start();
    this.beatController.currentSong?.Instance.Audio.Ended.Once(() => this.cleanup());
  }

  public onRender(dt: number): void {
    if (!this.beatController.active || !this.rhythmBoard) return;

    this.rhythmBoard.update(this.elapsed);
    this.elapsed += dt;
  }

  public set(songName: ExtractKeys<typeof Assets.Songs, SongData>): void {
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

    Log.info(`Assigned part "${partName}" on "${difficultyName}"`);
    this.rhythmBoard!.setNoteTrack(noteTrack);
    this.part = partName;
  }

  public getCurrentNoteTrack(): Maybe<Model> {
    return this.rhythmBoard?.noteTrack;
  }

  private getSongInfo(songName: ExtractKeys<typeof Assets.Songs, SongData>): SongInfo {
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