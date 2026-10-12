import React, { useEffect, useRef, useState } from "react";
import { Viro3DSceneNavigator, ViroCamera, ViroScene } from "@reactvision/react-viro";
import { RoomContent, RoomContentProps } from "./RoomContent";
import { registerMaterials } from "./materials";

registerMaterials();

type Vec3 = [number, number, number];
export type SpaceViewProps = RoomContentProps & { camera: Vec3; focal: Vec3 };

function TwinScene(props: any) {
  return (
    <ViroScene>
      <ViroCamera position={props.cam} rotation={lookAt(props.cam, props.foc)} active />
      <RoomContent {...props} />
    </ViroScene>
  );
}

const R2D = 180 / Math.PI;
/** Euler (deg) that points a Viro camera (default forward -Z) from `p` at `f`. */
function lookAt(p: Vec3, f: Vec3): Vec3 {
  const dx = f[0] - p[0], dy = f[1] - p[1], dz = f[2] - p[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  return [Math.asin(dy / len) * R2D, -Math.atan2(dx, -dz) * R2D, 0];
}

const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Web: ViroReact renders the apartment's digital twin through the Viro WASM/WebGL2 renderer. */
export default function SpaceView(props: SpaceViewProps) {
  const [cam, setCam] = useState<Vec3>(props.camera);
  const [foc, setFoc] = useState<Vec3>(props.focal);
  const cur = useRef({ cam: props.camera, foc: props.focal });

  useEffect(() => {
    const from = { ...cur.current };
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const c = lerp(from.cam, props.camera, e);
      const f = lerp(from.foc, props.focal, e);
      cur.current = { cam: c, foc: f };
      setCam(c);
      setFoc(f);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [props.camera.join(","), props.focal.join(",")]);

  // The .web navigator accepts webRendererOptions; the shared typings describe the native one.
  const Nav = Viro3DSceneNavigator as any;
  return (
    <Nav
      initialScene={{ scene: TwinScene as any }}
      viroAppProps={{ ...props, cam, foc }}
      webRendererOptions={{ assetBaseUrl: "/viro/" }}
      style={{ flex: 1 }}
    />
  );
}
