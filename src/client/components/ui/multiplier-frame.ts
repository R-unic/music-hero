import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { Player } from "shared/utilities/helpers";

import type { ScoreController } from "client/controllers/score-controller";
import { tween } from "shared/utilities/ui";
import { TweenInfoBuilder } from "@rbxts/builders";

@Component({
  tag: "MultiplierFrame",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class MultiplierFrame extends BaseComponent<{}, Frame & { Label: TextLabel & { Border: UIStroke } }> implements OnStart {
  private currentProgress = 0;

  public constructor(
    private readonly score: ScoreController
  ) { super(); }

  public onStart(): void {
    this.updateProgressBar();
    this.instance.GetPropertyChangedSignal("AbsoluteSize")
      .Connect(() => this.updateProgressBar());

    this.score.multiplierChanged.Connect(multiplier => this.instance.Label.Text = `${multiplier}x`);
    this.score.nextMultiplierProgressChanged.Connect(progress => {
      this.currentProgress = progress / 100;
      this.updateProgressBar();
    });
  }

  private updateProgressBar(): void {
    const borderThickness = this.calculateBorderThickness() * this.currentProgress;
    const tweenInfo = new TweenInfoBuilder()
      .SetTime(0.06)
      .SetEasingStyle(Enum.EasingStyle.Sine)
      .SetEasingDirection(Enum.EasingDirection.In);

    tween(this.instance.Label.Border, tweenInfo, { Thickness: borderThickness });
  }

  private calculateBorderThickness(): number {
    const absoluteSize = this.instance.AbsoluteSize.Magnitude / 2;
    const labelAbsoluteSize = this.instance.Label.AbsoluteSize.Magnitude / 2;
    const difference = absoluteSize - labelAbsoluteSize;
    const conversionRatio = 1.621;
    return difference / conversionRatio;
  }
}