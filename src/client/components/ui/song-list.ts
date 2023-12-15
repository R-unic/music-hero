import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Assets, Player } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";


@Component({
  tag: "SongList",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class SongList extends BaseComponent<{}, ScrollingFrame> implements OnStart {
  public onStart(): void {
    for (const songData of <SongData[]>Assets.Songs.GetChildren())
      this.createCard(songData);
  }

  private createCard(songData: SongData): void {
    const card = Assets.UI.SongCard.Clone();
    this.setupCardAnimations(card);
    card.Title.BackgroundTransparency = 1;
    card.Title.TextTransparency = 1;
    card.Title.UIStroke.Transparency = 1;
    card.Title.Text = songData.Name;
    card.Image = songData.Cover.Image;
    card.Parent = this.instance;
  }

  private setupCardAnimations(card: typeof Assets.UI.SongCard): void {
    const defaultBackgroundTrans = card.Title.BackgroundTransparency;
    const defaultTextTrans = card.Title.TextTransparency;
    const defaultStrokeTrans = card.Title.UIStroke.Transparency;
    const tweenInfo = new TweenInfoBuilder()
      .SetTime(0.2)
      .SetEasingStyle(Enum.EasingStyle.Quad)
      .SetEasingDirection(Enum.EasingDirection.In);

    card.MouseEnter.Connect(() => {
      tween(card.Title, tweenInfo, {
        BackgroundTransparency: defaultBackgroundTrans,
        TextTransparency: defaultTextTrans
      });
      tween(card.Title.UIStroke, tweenInfo, {
        Transparency: defaultStrokeTrans
      });
    });
    card.MouseLeave.Connect(() => {
      tween(card.Title, tweenInfo, {
        BackgroundTransparency: 1,
        TextTransparency: 1
      });
      tween(card.Title.UIStroke, tweenInfo, {
        Transparency: 1
      });
    });
  }
}