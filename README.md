# Northbridge Space

**Spatial sticky notes for a shared home, built with Expo + ViroReact.**
Submission for *Ctrl+Space: An Expo × ReactVision Hackathon* (Oct 2026).

- **Live web build:** https://northbridge-space.vercel.app
- **Demo video:** see the latest [GitHub release](https://github.com/dl88jing/northbridge-space/releases)

## Problem
Avery & Morgan share an apartment. Their reminders live in a group chat, a fridge whiteboard and a calendar nobody opens. A reminder is only useful *where you can act on it*: "move towels to the dryer" belongs on the dryer, "keys + gym bag" belongs at the front door.

## Solution
Northbridge Space pins household notes to 3D anchors in the home. Each note has an owner (Avery, Morgan or Both), a due time and a place.

- **Room view.** A ViroReact scene of the apartment. Tap a room chip and the camera flies there; notes in other rooms fade back.
- **Tap-to-place.** Type a task, pick who and when, tap **Place in room**, then tap the fridge, counter, washer, door or floor. The Viro hit test returns a world-space position, and the zone is inferred from the fixture or the floor position.
- **Shared state.** Check a note off and its anchor turns grey for both people.
- **Walk-through / proximity reminders.** Switch "viewing as" to Morgan and walk entry → kitchen → laundry → living. Each space surfaces only *your* open notes for that spot.
- **Persistence.** Notes and anchor positions are saved on device (AsyncStorage) and come back after a reload.

## One codebase, three surfaces
| Platform | What renders | File |
|---|---|---|
| Web (Expo web) | ViroReact `Viro3DSceneNavigator` through `@reactvision/viro-web-renderer` (virocore compiled to WASM + WebGL2): the apartment's digital twin | `src/SpaceView.web.tsx` |
| iOS / Android / Quest | ViroReact `ViroARSceneNavigator` + `ViroARPlaneSelector`: the same notes, anchored to real detected surfaces (the twin geometry is hidden) | `src/SpaceView.tsx` |
| Shared | `RoomContent`: lights, fixtures, note markers (`ViroNode`, `ViroBox`, `ViroQuad`, `ViroSphere`, `ViroText`, billboard behaviour, click handlers) | `src/RoomContent.tsx` |

The React Native UI (composer, note list, zone chips, detail card, toasts) is shared across all platforms.

## Tech stack
Expo SDK 57 · React Native 0.86 · TypeScript · `@reactvision/react-viro` 3.0 (ViroReact) · `@reactvision/viro-web-renderer` (WASM/WebGL2) · react-native-web · AsyncStorage · Vercel (web hosting).

## Run it
```bash
npm install          # postinstall copies the Viro WASM assets into public/viro
npx expo start --web # web digital twin
npm run build:web    # static export to dist/
# native AR (needs a dev build, not Expo Go):
npx expo prebuild && npx expo run:ios   # or run:android
```

## Status / honest notes
- The web build is what the demo video shows and what is deployed.
- The native AR path (`src/SpaceView.tsx`) compiles against the same ViroReact API but was not run on a physical device during the hackathon window.
- Next: cloud anchors so both phones share the same anchor IDs, and geofenced reminders when you physically enter a room.

## License
MIT
