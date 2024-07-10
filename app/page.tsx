"use client";

import { ReactFlowProvider } from "reactflow";

import { NodeContextMenu } from "@/components/node-menu";
import { ControlPanel } from "@/components/control-panel";
import { FlowEditor } from "@/components/flow-editor";
import { Toaster } from "@/components/toaster";
import KeyTimeCode from "@/components/controls/omni/timecode";

export default function Home() {
  return (
    <div className="h-screen">
      <Toaster />
      <ReactFlowProvider>
      <KeyTimeCode />
        <NodeContextMenu>
          <FlowEditor />
        </NodeContextMenu>
      </ReactFlowProvider>
      <ControlPanel />
    </div>
  );
}
