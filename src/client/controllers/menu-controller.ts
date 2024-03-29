import { Controller, type OnStart } from "@flamework/core";
import { Player } from "shared/utilities/helpers";

@Controller()
export class MenuController implements OnStart {
  private readonly menuUI = <ScreenGui>Player.WaitForChild("PlayerGui").WaitForChild("Menu");

  public onStart(): void {
    this.enable();
  }

  public enable(): void {
    this.menuUI.Enabled = true;
  }

  public disable(): void {
    this.menuUI.Enabled = false;
  }

  public setPage(pageName: string): void {
    const pages = this.menuUI.WaitForChild("Pages")
      .GetChildren()
      .filter((page): page is Frame => page.IsA("Frame"));

    for (const page of pages)
      page.Visible = page.Name === pageName;
  }
}