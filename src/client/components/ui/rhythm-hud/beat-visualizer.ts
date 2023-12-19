import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";
import { BeatController } from "client/controllers/beat-controller";

import { Player } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";

@Component({
  tag: "BeatVisualizer",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class BeatVisualizer extends BaseComponent<{}, Frame & { UIStroke: UIStroke }> implements OnStart {
  public constructor(
    private readonly beatController: BeatController
  ) { super(); }

  public onStart(): void {
    this.beatController.onBeat.Connect(() => this.visualizeBeat());
  }

  public visualizeBeat(): void {
    tween(
      this.instance.UIStroke,
      new TweenInfoBuilder()
        .SetTime(0.015)
        .SetEasingStyle(Enum.EasingStyle.Sine)
        .SetEasingDirection(Enum.EasingDirection.Out)
        .SetReverses(true),
      { Thickness: 12 }
    );
  }
}