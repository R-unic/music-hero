import { Controller } from "@flamework/core";
import { Player } from "shared/utilities/helpers";

@Controller()
export class MenuController {
  private readonly menuUI = <ScreenGui>Player.WaitForChild("PlayerGui").WaitForChild("Menu");

  public enable(): void {
    this.menuUI.Enabled = true;
  }

  public disable(): void {
    this.menuUI.Enabled = false;
  }

  public setPage(pageName: string): void {
    for (const page of <GuiObject[]>this.menuUI.GetChildren())
      page.Visible = page.Name === pageName;
  }
}