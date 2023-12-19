import type { Components } from "@flamework/components";
import { Controller } from "@flamework/core";

import type { DebugScreen } from "client/components/ui/debug-screen";

@Controller()
export class DebugController {
  public constructor(
    private readonly components: Components
  ) {}

  public getUI(): DebugScreen {
    return this.components.getAllComponents<DebugScreen>()[0];
  }
}