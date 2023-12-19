import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { Player } from "shared/utilities/helpers";

import type { ScoreController } from "client/controllers/score-controller";

interface Star extends ImageLabel {
  Progress: ImageLabel & {
    UIGradient: UIGradient;
  };
}

const { floor } = math;

@Component({
  tag: "StarsFrame",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class StarsFrame extends BaseComponent<{}, Frame> implements OnStart {
  private readonly stars = this.instance.GetChildren().filter((instance): instance is Star => instance.IsA("ImageLabel"));

  public constructor(
    private readonly score: ScoreController
  ) { super(); }

  public onStart(): void {
    this.score.starsProgressChanged.Connect(progress => this.setStarsProgress(progress));
  }

  public reset(): void {
    this.setStarsProgress(0);
  }

  private setStarsProgress(progress: number): void {
    task.spawn(() => {
      progress = math.clamp(progress, 0, 500);
      const filledStars = floor(progress / 100);
      const currentStarProgress = progress - (filledStars * 100);
      for (let i = 1; i <= filledStars; i++) {
        const star = this.stars.find(star => star.LayoutOrder === i)!;
        star.Progress.UIGradient.Transparency = new NumberSequence(0);
      }

      const currentStar = this.stars.find(star => star.LayoutOrder === filledStars + 1);
      if (!currentStar) return;
      currentStar.Progress.UIGradient.Transparency = this.getNumberSequenceFromProgress(currentStarProgress);
    });
  }

  private getNumberSequenceFromProgress(progress: number): NumberSequence {
    const fade = 0;

    if (progress === 0)
      return new NumberSequence(1);
    else if (progress === 100)
      return new NumberSequence(0);
    else
      return new NumberSequence([
        new NumberSequenceKeypoint(0, 0),
        new NumberSequenceKeypoint((progress / 100) - 0.01, 0),
        new NumberSequenceKeypoint((progress / 100) + fade, 1),
        new NumberSequenceKeypoint(1, 1)
      ]);
  }
}