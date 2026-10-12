import React from "react";
import {
  ViroARPlaneSelector,
  ViroARScene,
  ViroARSceneNavigator,
  ViroQuad,
} from "@reactvision/react-viro";
import { RoomContent, RoomContentProps } from "./RoomContent";
import { registerMaterials } from "./materials";

registerMaterials();

type Vec3 = [number, number, number];
export type SpaceViewProps = RoomContentProps & { camera: Vec3; focal: Vec3 };

/**
 * iOS / Android / Quest: the same notes, but anchored in the real room.
 * Tap a detected plane to pin a note where it physically belongs; the digital
 * twin geometry is hidden because the camera feed *is* the room.
 */
function ARRoomScene(props: any) {
  return (
    <ViroARScene>
      <ViroARPlaneSelector alignment="Horizontal" minHeight={0.2} minWidth={0.2}>
        <ViroQuad
          rotation={[-90, 0, 0]}
          width={2}
          height={2}
          materials={["ghost"]}
          opacity={0.01}
          onClick={(pos: any) => props.onSurfaceTap?.([pos[0], pos[1] + 0.25, pos[2]])}
        />
      </ViroARPlaneSelector>
      <RoomContent {...props} showRoom={false} />
    </ViroARScene>
  );
}

export default function SpaceView(props: SpaceViewProps) {
  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{ scene: ARRoomScene as any }}
      viroAppProps={props}
      style={{ flex: 1 }}
    />
  );
}
