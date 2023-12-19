import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";

import { Assets, Player } from "shared/utilities/helpers";

import type { SongCard } from "./song-card";

@Component({
  tag: "SongList",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class SongList extends BaseComponent<{}, ScrollingFrame> implements OnStart {
  public constructor(
    private readonly components: Components
  ) { super(); }

  public onStart(): void {
    for (const songData of <SongData[]>Assets.Songs.GetChildren())
      this.createCard(songData);
  }

  private createCard(songData: SongData): void {
    const card = Assets.UI.SongCard.Clone();
    card.Title.Text = songData.Name;
    this.components.addComponent<SongCard>(card);

    card.Title.BackgroundTransparency = 1;
    card.Title.TextTransparency = 1;
    card.Title.UIStroke.Transparency = 1;
    card.Image = songData.Cover.Image;

    card.Parent = this.instance;
  }
}