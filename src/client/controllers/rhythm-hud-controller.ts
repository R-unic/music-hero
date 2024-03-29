import { Controller } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Player } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";

@Controller()
export class RhythmHUDController {
  private readonly rhythmHUD = <ScreenGui>Player.WaitForChild("PlayerGui").WaitForChild("RhythmHUD");
  private readonly viewport = <ViewportFrame>this.rhythmHUD.WaitForChild("Board").WaitForChild("Viewport");
  private readonly finishPositions = <Frame>this.viewport.WaitForChild("FinishPositions");

  public highlightFinishPosition(position: NotePosition): void {
    const finishPosition = this.getFinishPosition(position);
    const tweenInfo = new TweenInfoBuilder()
      .SetTime(0.075)
      .SetEasingStyle(Enum.EasingStyle.Sine)
      .SetEasingDirection(Enum.EasingDirection.In)
      .SetReverses(true);

    tween(finishPosition, tweenInfo, {
      BackgroundColor3: Color3.fromRGB(255, 230, 255),
      BackgroundTransparency: 0.3
    });
  }

  private getFinishPosition(position: NotePosition): Frame {
    return <Frame>this.finishPositions.GetChildren()
      .find(instance => instance.IsA("Frame") && instance.LayoutOrder === position);
  }

  public addNoteCompletionVFX(position: NotePosition): void {
    const finishPosition = this.getFinishPosition(position);

  }

  public enable(): void {
    this.rhythmHUD.Enabled = true;
  }

  public disable(): void {
    this.rhythmHUD.Enabled = false;
  }
}