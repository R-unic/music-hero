import { Controller } from "@flamework/core";
import { Player } from "shared/utilities/helpers";

@Controller()
export class RhythmHUDController {
  private readonly rhythmHUD = <ScreenGui>Player.WaitForChild("PlayerGui").WaitForChild("RhythmHUD");

  public enable(): void {
    this.rhythmHUD.Enabled = true;
  }

  public disable(): void {
    this.rhythmHUD.Enabled = false;
  }
}