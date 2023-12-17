import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { Player } from "shared/utilities/helpers";
import { commaFormat } from "shared/util";

import type { ScoreController } from "client/controllers/score-controller";
import type { SongController } from "client/controllers/song-controller";

@Component({
  tag: "ScoreFrame",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class ScoreFrame extends BaseComponent<{}, Frame & { Title: TextLabel; Value: TextLabel }> implements OnStart {
  public constructor(
    private readonly score: ScoreController,
    private readonly song: SongController
  ) { super(); }

  public onStart(): void {
    this.song.partChanged.Connect(part => {
      this.instance.Title.Text = `${part.upper()} SCORE`;
      this.instance.Value.Text = "0";
    });
    this.score.changed.Connect(score => this.instance.Value.Text = commaFormat(score));
  }
}