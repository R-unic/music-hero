import { Controller, type OnStart } from "@flamework/core";

import { Player } from "shared/utilities/helpers";

@Controller()
export class CharacterController implements OnStart {
  public onStart(): void {
    const humanoid = (Player.Character ?? Player.CharacterAdded.Wait()[0]).FindFirstChildOfClass("Humanoid")!;
    humanoid.WalkSpeed = 0;
    humanoid.JumpHeight = 0;
  }
}