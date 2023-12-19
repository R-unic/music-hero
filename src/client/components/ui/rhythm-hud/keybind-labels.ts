import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { Events } from "client/network";
import { Player } from "shared/utilities/helpers";
import type { DataKey } from "shared/data-models/generic";

const { dataUpdate } = Events;

@Component({
  tag: "KeybindLabels",
  ancestorWhitelist: [ Player.WaitForChild("PlayerGui") ]
})
export class KeybindLabels extends BaseComponent<{}, Frame & { Unlisted: Folder & {  } }> implements OnStart {
  public onStart(): void {
    const keybindLabels = this.instance.GetChildren()
      .filter((instance): instance is TextLabel => instance.IsA("TextLabel"));

    dataUpdate.connect(async (key: DataKey, keybinds: string[]) => {
      if (key !== "keybinds") return;
      for (const label of keybindLabels)
        label.Text = keybinds[label.LayoutOrder - 1];
    });
  }
}