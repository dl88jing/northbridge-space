import React from "react";
import {
  ViroAmbientLight,
  ViroBox,
  ViroDirectionalLight,
  ViroNode,
  ViroQuad,
  ViroSphere,
  ViroText,
} from "@reactvision/react-viro";
import { FIXTURES, SpaceNote, Zone } from "./data";

export type RoomContentProps = {
  notes: SpaceNote[];
  selectedId?: string | null;
  focusZone?: Zone | null;
  placing?: boolean;
  ghost?: [number, number, number] | null;
  showRoom?: boolean; // false in AR: the real room replaces the digital twin
  onSurfaceTap?: (p: [number, number, number], fixtureId?: string) => void;
  onNoteTap?: (id: string) => void;
};

function pinMaterial(n: SpaceNote) {
  if (n.done) return "pinDone";
  return n.who === "Avery" ? "pinAvery" : n.who === "Morgan" ? "pinMorgan" : "pinBoth";
}

export function NoteMarker({
  note,
  selected,
  dimmed,
  onTap,
}: {
  note: SpaceNote;
  selected: boolean;
  dimmed: boolean;
  onTap?: () => void;
}) {
  const s = selected ? 1.25 : 1;
  return (
    <ViroNode position={note.position} opacity={dimmed ? 0.35 : 1} scale={[s, s, s]}>
      <ViroSphere radius={0.07} materials={[pinMaterial(note)]} position={[0, 0, 0]} onClick={onTap} />
      <ViroBox position={[0, -0.18, 0]} width={0.015} height={0.3} length={0.015} materials={[pinMaterial(note)]} />
      <ViroNode position={[0, 0.38, 0]} transformBehaviors={["billboard"]}>
        <ViroQuad
          width={1.8}
          height={0.5}
          materials={[note.done ? "cardDone" : selected ? "cardSelected" : "card"]}
          onClick={onTap}
        />
        <ViroQuad position={[-0.875, 0, 0.002]} width={0.05} height={0.5} materials={[pinMaterial(note)]} />
        <ViroText
          text={(note.done ? "✓ " : "") + note.text}
          position={[0.04, 0.07, 0.01]}
          width={1.62}
          height={0.24}
          color="#14161C"
          style={{ fontSize: 14, textAlign: "left", textAlignVertical: "center" }}
        />
        <ViroText
          text={`${note.who} · ${note.due ?? "anytime"}`}
          position={[0.04, -0.14, 0.01]}
          width={1.62}
          height={0.18}
          color="#5A6270"
          style={{ fontSize: 11, textAlign: "left", textAlignVertical: "center" }}
        />
      </ViroNode>
    </ViroNode>
  );
}

export function RoomContent(p: RoomContentProps) {
  const showRoom = p.showRoom !== false;
  return (
    <>
      <ViroAmbientLight color="#ffffff" intensity={550} />
      <ViroDirectionalLight color="#ffffff" direction={[-0.4, -1, -0.6]} intensity={700} />
      {showRoom && (
        <>
          <ViroQuad
            position={[0, 0, 0]}
            rotation={[-90, 0, 0]}
            width={8}
            height={6}
            materials={[p.placing ? "floorHot" : "floor"]}
            onClick={(pos: any) => p.onSurfaceTap?.([pos[0], 0.9, pos[2]])}
          />
          <ViroQuad position={[2.0, 0.005, -0.8]} rotation={[-90, 0, 0]} width={2.6} height={1.8} materials={["rug"]}
            onClick={(pos: any) => p.onSurfaceTap?.([pos[0], 0.9, pos[2]])} />
          <ViroBox position={[0, 1.4, -3.05]} width={8} height={2.8} length={0.1} materials={["wall"]} />
          <ViroBox position={[-4.05, 1.4, 0]} width={0.1} height={2.8} length={6} materials={["wallDark"]} />
          <ViroBox position={[-0.25, 1.4, -1.8]} width={0.1} height={2.8} length={2.4} materials={["wallDark"]} />
          {FIXTURES.map((f) => (
            <ViroBox
              key={f.id}
              position={f.position}
              width={f.size[0]}
              height={f.size[1]}
              length={f.size[2]}
              materials={[f.material]}
              onClick={(pos: any) =>
                p.onSurfaceTap?.([pos[0], Math.min(pos[1] + 0.55, 2.4), pos[2]], f.id)
              }
            />
          ))}
        </>
      )}
      {p.ghost && (
        <ViroNode position={p.ghost}>
          <ViroSphere radius={0.09} materials={["reticle"]} />
          <ViroQuad position={[0, -p.ghost[1] + 0.01, 0]} rotation={[-90, 0, 0]} width={0.5} height={0.5} materials={["reticle"]} opacity={0.5} />
        </ViroNode>
      )}
      {p.notes.map((n) => (
        <NoteMarker
          key={n.id}
          note={n}
          selected={p.selectedId === n.id}
          dimmed={!!p.focusZone && p.focusZone !== n.zone}
          onTap={() => p.onNoteTap?.(n.id)}
        />
      ))}
    </>
  );
}
