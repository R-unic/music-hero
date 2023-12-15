import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Player } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";

import type { SongSelectController } from "client/controllers/song-select-controller";

@Component({
  tag: "PartButton",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class PartButton extends BaseComponent<{}, GuiButton> implements OnStart {
  private isSelected = false;

  public constructor(
    private readonly components: Components,
    private readonly selected: SongSelectController
  ) { super(); }

  public onStart(): void {
    const hoverTrans = 0.7;
    const selectTrans = 0.5;
    const animationInfo = new TweenInfoBuilder()
      .SetTime(0.075)
      .SetEasingStyle(Enum.EasingStyle.Quad)
      .SetEasingDirection(Enum.EasingDirection.In);

    this.instance.MouseEnter.Connect(() => {
      if (this.isSelected) return;
      tween(this.instance, animationInfo, { BackgroundTransparency: hoverTrans })
    });
    this.instance.MouseLeave.Connect(() => {
      if (this.isSelected) return;
      tween(this.instance, animationInfo, { BackgroundTransparency: 1 })
    });
    this.instance.MouseButton1Click.Connect(() => {
      if (this.instance.Name !== "Drums") return; // temp

      this.selected.selectPart(<keyof SongParts>this.instance.Name);
      for (const partButton of this.components.getAllComponents<PartButton>()) {
        const isSelected = partButton.instance.Name === this.instance.Name;
        partButton.isSelected = isSelected;
        tween(partButton.instance, animationInfo, { BackgroundTransparency: isSelected ? selectTrans : 1 });
      }
    });
  }
}