import { Controller, type OnInit } from "@flamework/core";
import { Context as InputContext } from "@rbxts/gamejoy";
import type { ActionLike, RawAction } from "@rbxts/gamejoy/out/Definitions/Types";

import { Events } from "client/network";
import { PERFECT_NOTE_RADIUS, VALID_NOTE_RADIUS } from "shared/constants";
import { SongDifficulty } from "shared/structs/song-info";
import type { DataKey } from "shared/data-models/generic";
import Log from "shared/logger";

import type { SongController } from "./song-controller";
import { RhythmHUDController } from "./rhythm-hud-controller";

const { dataUpdate } = Events;

const NOTE_WS_POSITIONS = [-6, -2, 2, 6, 10];

@Controller()
export class InputController implements OnInit {
  private readonly context = new InputContext;

  public constructor(
    private readonly rhythmHUD: RhythmHUDController,
    private readonly song: SongController
  ) {}

  public onInit(): void {
    this.context.Bind("Space", () => {}) // overdrive
    dataUpdate.connect(async (key: DataKey, keybinds: string[]) => {
      if (key !== "keybinds") return;
      this.context.UnbindAllActions();

      for (const keybind of keybinds) {
        const position = <NotePosition>(keybinds.indexOf(keybind)! + 1);
        this.context.Bind(<ActionLike<RawAction>><unknown>keybind, () => this.attemptNote(position));
      }
    });
  }

  private attemptNote(notePosition: NotePosition) {
    if (notePosition === 5 && this.song.difficulty !== SongDifficulty.Expert) return;
    if (!this.song.getCurrentNoteTrack()) return;
    this.rhythmHUD.highlightFinishPosition(notePosition);

    const [pressedNote] = this.getNotesInRadius(notePosition);
    if (!pressedNote) return;

    const perfectNote = math.abs(pressedNote.Position.Z) <= PERFECT_NOTE_RADIUS;
    pressedNote.Destroy();
    Log.info("Completed note!" + (perfectNote ? " (perfect)" : ""));
  }

  private getNotesInRadius(notePosition: NotePosition) {
    return this.getNotesInPosition(notePosition)
      .sort((noteA, noteB) => noteA.Position.Z > noteB.Position.Z)
      .filter(note => note.Position.Z > 0 ? note.Position.Z <= VALID_NOTE_RADIUS / 1.5 : note.Position.Z >= -VALID_NOTE_RADIUS);
  }

  private getNotesInPosition(notePosition: NotePosition) {
    const validPosition = NOTE_WS_POSITIONS[notePosition - 1];
    return (<Part[]>this.song.getCurrentNoteTrack()!.GetChildren())
      .filter(note => note.Position.X === validPosition);
  }
}