import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { Player } from "shared/utilities/helpers";

import type { ScoreController } from "client/controllers/score-controller";
import { tween } from "shared/utilities/ui";

@Component({
  tag: "OverdriveBar",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class OverdriveBar extends BaseComponent<{}, Frame & { Progress: Frame }> implements OnStart {
  public constructor(
    private readonly score: ScoreController
  ) { super(); }

  public onStart(): void {
    this.instance.Progress.Size = UDim2.fromScale(0, 1);
    this.score.overdriveProgressChanged.Connect(progress => tween(this.instance.Progress, new TweenInfo(0.1), {
      Size: UDim2.fromScale(progress / 100, 1)
    }));
  }
}