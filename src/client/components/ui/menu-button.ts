import { Dependency, type OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Player } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";

import type { MenuController } from "client/controllers/menu-controller";
import type { RhythmHUDController } from "client/controllers/rhythm-hud-controller";
import type { SongController } from "client/controllers/song-controller";
import type { SongSelectController } from "client/controllers/song-select-controller";

@Component({
  tag: "MenuButton",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class MenuButton extends BaseComponent<{}, GuiButton & { Border: UIStroke }> implements OnStart {
  public constructor(
    private readonly menu: MenuController,
    private readonly selected: SongSelectController,
    private readonly rhythmHUD: RhythmHUDController,
    private readonly song: SongController
  ) { super(); }

  public onStart(): void {
    const animationInfo = new TweenInfoBuilder()
      .SetTime(0.05)
      .SetEasingStyle(Enum.EasingStyle.Quad)
      .SetEasingDirection(Enum.EasingDirection.In);

    this.instance.MouseEnter.Connect(() => tween(this.instance.Border, animationInfo, { Thickness: 7 }));
    this.instance.MouseLeave.Connect(() => tween(this.instance.Border, animationInfo, { Thickness: 0 }));
    this.instance.MouseButton1Click.Connect(() => {
      switch(this.instance.Name) {
        case "Play": {
          this.menu.setPage("SongSelect");
          break;
        }
        case "Start": {
          if (this.selected.song === undefined) return;
          if (this.selected.difficulty === undefined) return;
          if (this.selected.part === undefined) return;

          this.rhythmHUD.enable();
          this.menu.disable();
          this.menu.setPage("Main");
          this.song.set(this.selected.song);
          this.song.setDifficulty(this.selected.difficulty);
          this.song.assignPart(this.selected.part);
          this.song.start();
          this.selected.deselectAll();

          break;
        }
      }
    });
  }
}