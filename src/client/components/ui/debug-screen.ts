import { Component, BaseComponent } from "@flamework/components";

import { Player } from "shared/utilities/helpers";

import type { ScoreController } from "client/controllers/score-controller";

interface DebugScreenInstance extends ScreenGui {
  Rhythm: Frame & {
    GoodNotes: TextLabel;
    PerfectNotes: TextLabel;
    CompletedNotes: TextLabel;
    FailedNotes: TextLabel;
    TotalNotes: TextLabel;
    Accuracy: TextLabel;
  };
};

@Component({
  tag: "DebugScreen",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class DebugScreen extends BaseComponent<{}, DebugScreenInstance> {
  public updateRhythmStats(score: ScoreController): void {
    task.spawn(() => {
      const rhythm = this.instance.Rhythm;
      rhythm.GoodNotes.Text = "Good Notes: " + tostring(score.goodNotes);
      rhythm.PerfectNotes.Text = "Perfect Notes: " + tostring(score.perfectNotes);
      rhythm.CompletedNotes.Text = "Completed Notes: " + tostring(score.goodNotes + score.perfectNotes);
      rhythm.FailedNotes.Text = "Failed Notes: " + tostring(score.failedNotes);
      rhythm.TotalNotes.Text = "Total Notes: " + tostring(score.totalNotes);
      rhythm.Accuracy.Text = "Accuracy: " + tostring(math.round(score.getSongAccuracy())) + "%";
    });
  }
}