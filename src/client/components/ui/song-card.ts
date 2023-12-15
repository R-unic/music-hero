import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { tween } from "shared/utilities/ui";

import type { SongSelectController } from "client/controllers/song-select-controller";

@Component({ tag: "SongCard" })
export class SongCard extends BaseComponent<{}, ImageButton & { Checkmark: ImageLabel; Title: TextLabel & { UIStroke: UIStroke } }> implements OnStart {
  public constructor(
    private readonly components: Components,
    private readonly selected: SongSelectController
  ) { super(); }

  public onStart(): void {
    const defaultBackgroundTrans = this.instance.Title.BackgroundTransparency;
    const defaultTextTrans = this.instance.Title.TextTransparency;
    const defaultStrokeTrans = this.instance.Title.UIStroke.Transparency;
    const tweenInfo = new TweenInfoBuilder()
      .SetTime(0.2)
      .SetEasingStyle(Enum.EasingStyle.Quad)
      .SetEasingDirection(Enum.EasingDirection.In);

    this.instance.MouseButton1Click.Connect(() => {
      if (this.instance.Title.Text !== "Paradise Falls") return; // temp

      this.selected.selectSong(<SongName>this.instance.Title.Text);
      for (const songCard of this.components.getAllComponents<SongCard>())
        this.instance.Checkmark.Visible = songCard.instance.Name === this.instance.Name;
    });
    this.instance.MouseEnter.Connect(() => {
      tween(this.instance.Title, tweenInfo, {
        BackgroundTransparency: defaultBackgroundTrans,
        TextTransparency: defaultTextTrans
      });
      tween(this.instance.Title.UIStroke, tweenInfo, {
        Transparency: defaultStrokeTrans
      });
    });
    this.instance.MouseLeave.Connect(() => {
      tween(this.instance.Title, tweenInfo, {
        BackgroundTransparency: 1,
        TextTransparency: 1
      });
      tween(this.instance.Title.UIStroke, tweenInfo, {
        Transparency: 1
      });
    });
  }
}