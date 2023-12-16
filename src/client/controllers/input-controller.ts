import { Controller, type OnInit } from "@flamework/core";
import { Context as InputContext } from "@rbxts/gamejoy";
import type { ActionLike, RawActionEntry } from "@rbxts/gamejoy/out/Definitions/Types";

import { Events } from "client/network";
import { PERFECT_NOTE_RADIUS, VALID_NOTE_RADIUS } from "shared/constants";
import { SongDifficulty } from "shared/structs/song-info";
import type { DataKey } from "shared/data-models/generic";

import type { RhythmHUDController } from "./rhythm-hud-controller";
import type { SongController } from "./song-controller";
import type { ScoreController } from "./score-controller";

const { dataUpdate } = Events;

const NOTE_WS_POSITIONS = [-6, -2, 2, 6, 10];

@Controller()
export class InputController implements OnInit {
  private readonly context = new InputContext;
  private bindedKeys: string[] = [];

  public constructor(
    private readonly rhythmHUD: RhythmHUDController,
    private readonly song: SongController,
    private readonly score: ScoreController
  ) {}

  public onInit(): void {
    this.context.Bind("Space", () => this.score.activateOverdrive());
    dataUpdate.connect(async (key: DataKey, keybinds: string[]) => {
      if (key !== "keybinds") return;
      for (const keybind of this.bindedKeys)
        this.context.Unbind(<ActionLike<RawActionEntry>>keybind);

      this.bindedKeys = keybinds;
      for (const keybind of keybinds) {
        const position = <NotePosition>(keybinds.indexOf(keybind)! + 1);
        this.context.Bind(<ActionLike<RawActionEntry>>keybind, () => {
          task.spawn(() => this.attemptNote(position));
        });
      }
    });
  }

  private attemptNote(notePosition: NotePosition) {
    if (notePosition === 5 && this.song.difficulty !== SongDifficulty.Expert) return;
    if (!this.song.getCurrentNoteTrack()) return;
    this.rhythmHUD.highlightFinishPosition(notePosition);

    const [pressedNote] = this.getNotesInRadius(notePosition);
    if (!pressedNote) return;

    const isPerfect = math.abs(pressedNote.Position.Z) <= PERFECT_NOTE_RADIUS;
    const lastOfOverdriveGroup = pressedNote.Parent!.Name === "OverdriveGroup" && pressedNote.Parent!.GetChildren().size() === 1;
    this.score.addCompletedNote(lastOfOverdriveGroup, isPerfect, 1 / pressedNote.Position.Z);
    pressedNote.Destroy();
  }

  private getNotesInRadius(notePosition: NotePosition) {
    return this.getNotesInPosition(notePosition)
      .sort((noteA, noteB) => noteA.Position.Z > noteB.Position.Z)
      .filter(note => note.Position.Z > 0 ? note.Position.Z <= VALID_NOTE_RADIUS / 1.5 : note.Position.Z >= -VALID_NOTE_RADIUS);
  }

  private getNotesInPosition(notePosition: NotePosition) {
    const validPosition = NOTE_WS_POSITIONS[notePosition - 1];
    return this.getAllNotes()
      .filter(note => note.Position.X === validPosition);
  }

  private getAllNotes(): MeshPart[] {
    return this.song.getCurrentNoteTrack()!
      .GetDescendants()
      .filter((instance): instance is MeshPart => instance.IsA("MeshPart"));
  }
}