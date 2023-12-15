import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { SongDifficulty } from "shared/structs/song-info";
import { Player } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";

import type { MenuController } from "client/controllers/menu-controller";
import type { RhythmHUDController } from "client/controllers/rhythm-hud-controller";
import type { SongController } from "client/controllers/song-controller";

@Component({
  tag: "MenuButton",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class MenuButton extends BaseComponent<{}, GuiButton> implements OnStart {
  public constructor(
    private readonly menu: MenuController,
    private readonly rhythmHUD: RhythmHUDController,
    private readonly song: SongController
  ) { super(); }

  public onStart(): void {
    const borderStroke = <UIStroke>this.instance.WaitForChild("Border");
    const animationInfo = new TweenInfoBuilder()
      .SetTime(0.05)
      .SetEasingStyle(Enum.EasingStyle.Quad)
      .SetEasingDirection(Enum.EasingDirection.In);

    this.instance.MouseEnter.Connect(() => tween(borderStroke, animationInfo, { Thickness: 7 }));
    this.instance.MouseLeave.Connect(() => tween(borderStroke, animationInfo, { Thickness: 0 }));
    this.instance.MouseButton1Click.Connect(() => {
      switch(this.instance.Name) {
        case "Play": {
          this.menu.setPage("SongSelect");
          // this.menu.disable();
          // this.rhythmHUD.enable();

          // // temp
          // this.song.set("Paradise Falls");
          // this.song.setDifficulty(SongDifficulty.Easy);
          // this.song.assignPart("Drums");
          // this.song.start();
          break;
        }
      }
    });
  }
}