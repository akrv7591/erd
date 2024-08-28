import {ITools} from "@/types/entity-node.ts";
import React from "react";

export interface EntityControl {
  label: string
  value: ITools
  icon: any
  onDragStart?: React.DragEventHandler<HTMLButtonElement>
  allowOnDisabled: boolean
}
