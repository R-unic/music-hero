import { Component, BaseComponent } from "@flamework/components";

import { Player } from "shared/utilities/helpers";
import { NORMAL_NOTE_COLOR, OVERDRIVE_NOTE_COLOR, VALID_NOTE_RADIUS } from "shared/constants";
import Log from "shared/logger";

import type { ScoreController } from "client/controllers/score-controller";

const BEAT_STUD_LENGTH = 12;
const NOTE_COMPLETION_POSITION = 0 + VALID_NOTE_RADIUS;

@Component({
  tag: "RhythmBoard",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class RhythmBoard extends BaseComponent<{}, Part & { Grid: Texture }> {
  public beatDuration = 0;
  public noteTrack?: Model;
  private defaultNoteTrackPivot?: CFrame;
  private readonly viewport = <ViewportFrame>this.instance.Parent;

  public constructor(
    private readonly score: ScoreController
  ) { super(); }

  public setNoteTrack(noteTrack: Model): void {
    this.viewport.FindFirstChild("Notes")?.Destroy();
    noteTrack.Name = "Notes";
    noteTrack.Parent = this.viewport;
    this.defaultNoteTrackPivot = noteTrack.GetPivot();
    this.noteTrack = noteTrack;
  }

  public update(elapsed: number): void {
    const lerpPosition = (elapsed / this.beatDuration) * BEAT_STUD_LENGTH;
    this.instance.Grid.OffsetStudsV = lerpPosition;
    this.noteTrack!.PivotTo(this.defaultNoteTrackPivot!.add(new Vector3(0, 0, lerpPosition)));

    const allNotes = this.noteTrack!.GetDescendants()
      .filter((instance): instance is MeshPart => instance.IsA("MeshPart"));

    for (const note of allNotes)
      task.spawn(() => {
        if (note.Position.Z >= NOTE_COMPLETION_POSITION) {
          Log.info("Failed note!");
          if (note.Color === OVERDRIVE_NOTE_COLOR) {
            const overdriveGroup = note.Parent!;
            for (const otherNote of <Part[]>overdriveGroup.GetChildren()) {
              otherNote.Color = NORMAL_NOTE_COLOR;
              otherNote.Parent = overdriveGroup.Parent;
            }
            overdriveGroup.Destroy();
          }

          this.score.resetMultiplier();
          note.Destroy();
        }
      });
  }
}