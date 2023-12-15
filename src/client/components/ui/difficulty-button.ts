import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { SongDifficulty } from "shared/structs/song-info";
import { Player } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";

import type { SongSelectController } from "client/controllers/song-select-controller";

@Component({
  tag: "DifficultyButton",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class DifficultyButton extends BaseComponent<{}, GuiButton & { UICorner: UICorner; UIStroke: UIStroke }> implements OnStart {
  public isSelected = false;

  public constructor(
    private readonly components: Components,
    private readonly selected: SongSelectController
  ) { super(); }

  public onStart(): void {
    const cornerRadius = this.instance.UICorner.CornerRadius;
    const borderThickness = this.instance.UIStroke.Thickness;
    this.instance.UIStroke.Thickness = 0;

    const animationInfo = new TweenInfoBuilder()
      .SetTime(0.075)
      .SetEasingStyle(Enum.EasingStyle.Quad)
      .SetEasingDirection(Enum.EasingDirection.In);

    this.instance.MouseEnter.Connect(() => {
      if (this.isSelected) return;
      tween(this.instance.UIStroke, animationInfo, { Thickness: borderThickness });
    });
    this.instance.MouseLeave.Connect(() => {
      if (this.isSelected) return;
      tween(this.instance.UIStroke, animationInfo, { Thickness: 0 });
    });
    this.instance.MouseButton1Click.Connect(() => {
      if (this.instance.Name !== "Easy") return; // temp

      this.selected.selectDifficulty(SongDifficulty[<keyof typeof SongDifficulty>this.instance.Name]);
      for (const difficultyButton of this.components.getAllComponents<DifficultyButton>()) {
        const isSelected = difficultyButton.instance.Name === this.instance.Name;
        difficultyButton.isSelected = isSelected;
        tween(difficultyButton.instance.UIStroke, animationInfo, { Thickness: isSelected ? borderThickness : 0 });
        tween(difficultyButton.instance.UICorner, animationInfo, { CornerRadius: isSelected ? new UDim(1, 0) : cornerRadius });
      }
    });
  }
}