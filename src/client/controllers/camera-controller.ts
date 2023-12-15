import { Controller, type OnStart } from "@flamework/core";
import { Workspace as World } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";

import { tween } from "shared/utilities/ui";

@Controller()
export class CameraController implements OnStart {
  public onStart(): void {
    task.delay(2, () => {
      const camera = World.CurrentCamera!;
      const cameraPositions = (<Part[]>World.Cameras.GetChildren())
      .sort((a, b) => <number>a.GetAttribute("Order") < <number>b.GetAttribute("Order"));

      const tweenInfo = new TweenInfoBuilder()
        .SetTime(1.75)
        .SetEasingStyle(Enum.EasingStyle.Sine)
        .SetEasingDirection(Enum.EasingDirection.Out);

      tweenInfo.SetDelayTime(3);
      camera.CameraType = Enum.CameraType.Scriptable;
      camera.CFrame = cameraPositions[0].CFrame;

      do {
        for (const cameraPosition of cameraPositions)
          tween(camera, tweenInfo, { CFrame: cameraPosition.CFrame })
            .Completed.Wait();
      } while (true);
    });
  }
}