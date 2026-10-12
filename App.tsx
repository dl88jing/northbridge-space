import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SpaceView from "./src/SpaceView";
import { OVERVIEW, PERSON_COLOR, Person, SEED_NOTES, SpaceNote, ZONES, Zone, zoneFor, FIXTURES } from "./src/data";

const STORE_KEY = "northbridge-space/notes/v1";
type Vec3 = [number, number, number];

export default function App() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [notes, setNotes] = useState<SpaceNote[]>(SEED_NOTES);
  const [loaded, setLoaded] = useState(false);
  const [me, setMe] = useState<"Avery" | "Morgan">("Avery");
  const [focusZone, setFocusZone] = useState<Zone | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [who, setWho] = useState<Person>("Morgan");
  const [due, setDue] = useState("Tonight");
  const [placing, setPlacing] = useState(false);
  const [ghost, setGhost] = useState<Vec3 | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [touring, setTouring] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORE_KEY).then((v) => {
      if (v) try { setNotes(JSON.parse(v)); } catch {}
      setLoaded(true);
    });
  }, []);
  useEffect(() => { if (loaded) AsyncStorage.setItem(STORE_KEY, JSON.stringify(notes)); }, [notes, loaded]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  const view = focusZone ? ZONES.find((z) => z.zone === focusZone)! : null;
  const camera = (view ? view.camera : OVERVIEW.camera) as Vec3;
  const focal = (view ? view.focal : OVERVIEW.focal) as Vec3;

  // "Walk-through": simulates walking room to room; each zone surfaces only what is pinned there.
  useEffect(() => {
    if (!touring) return;
    const order: Zone[] = ["Entry", "Kitchen", "Laundry", "Living"];
    let i = 0;
    const step = () => {
      const z = order[i];
      setFocusZone(z);
      const open = notes.filter((n) => n.zone === z && !n.done && (n.who === me || n.who === "Both"));
      setToast(open.length ? `${me} entered ${z} · ${open.length} for you: ${open.map((n) => n.text).join(", ")}` : `${me} entered ${z} · nothing pinned for you here`);
      i++;
    };
    step();
    const iv = setInterval(() => { if (i >= order.length) { clearInterval(iv); setTouring(false); return; } step(); }, 3200);
    return () => clearInterval(iv);
  }, [touring]);

  const onSurfaceTap = (p: Vec3, fixtureId?: string) => {
    if (!placing) { setSelectedId(null); return; }
    const text = draft.trim() || "New note";
    const zone = fixtureId ? FIXTURES.find((f) => f.id === fixtureId)!.zone : zoneFor(p[0], p[2]);
    const n: SpaceNote = { id: `n${Date.now()}`, text, who, zone, position: p, due, done: false, createdBy: me };
    setGhost(p);
    setTimeout(() => setGhost(null), 900);
    setNotes((ns) => [...ns, n]);
    setPlacing(false);
    setDraft("");
    setSelectedId(n.id);
    const fx = fixtureId ? FIXTURES.find((f) => f.id === fixtureId)!.label : zone;
    setToast(`Pinned "${text}" on ${fx} for ${who}`);
  };

  const onNoteTap = (id: string) => setSelectedId((s) => (s === id ? null : id));
  const toggleDone = (id: string) => setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, done: !n.done } : n)));
  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const counts = useMemo(() => {
    const open = notes.filter((n) => !n.done);
    return { avery: open.filter((n) => n.who !== "Morgan").length, morgan: open.filter((n) => n.who !== "Avery").length, done: notes.length - open.length };
  }, [notes]);

  const listed = notes.filter((n) => !focusZone || n.zone === focusZone);

  const panel = (
    <View style={[styles.panel, wide ? styles.panelWide : styles.panelNarrow]}>
      <Text style={styles.h2}>Pin a note</Text>
      <TextInput
        testID="draft"
        value={draft}
        onChangeText={setDraft}
        placeholder="e.g. Take out recycling"
        placeholderTextColor="#7D8794"
        style={styles.input}
      />
      <View style={styles.row}>
        {(["Avery", "Morgan", "Both"] as Person[]).map((p) => (
          <Chip key={p} label={p} active={who === p} color={PERSON_COLOR[p]} onPress={() => setWho(p)} />
        ))}
      </View>
      <View style={styles.row}>
        {["Tonight", "Tomorrow", "Weekly"].map((d) => (
          <Chip key={d} label={d} active={due === d} onPress={() => setDue(d)} />
        ))}
      </View>
      <Pressable testID="place" onPress={() => setPlacing((v) => !v)} style={[styles.cta, placing && styles.ctaActive]}>
        <Text style={styles.ctaText}>{placing ? "Tap a surface in the room…" : "Place in room"}</Text>
      </Pressable>

      <View style={styles.divider} />
      <Text style={styles.h2}>{focusZone ? `${focusZone} notes` : "All notes"} · {listed.filter((n) => !n.done).length} open</Text>
      <ScrollView style={{ flex: 1 }}>
        {listed.map((n) => (
          <Pressable testID={`item-${n.id}`} key={n.id} onPress={() => onNoteTap(n.id)} style={[styles.item, selectedId === n.id && styles.itemSel]}>
            <View style={[styles.dot, { backgroundColor: n.done ? "#7D8794" : PERSON_COLOR[n.who] }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemText, n.done && styles.strike]}>{n.text}</Text>
              <Text style={styles.meta}>{n.zone} · {n.who} · {n.due} · by {n.createdBy}</Text>
            </View>
            <Pressable testID={`check-${n.id}`} onPress={() => toggleDone(n.id)} style={[styles.check, n.done && styles.checkOn]}>
              <Text style={styles.checkText}>{n.done ? "✓" : ""}</Text>
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <View>
          <Text style={styles.brand}>Northbridge Space</Text>
          <Text style={styles.sub}>Spatial notes for Avery & Morgan's apartment · ViroReact</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.sub}>Viewing as</Text>
          {(["Avery", "Morgan"] as const).map((p) => (
            <Chip key={p} label={p} active={me === p} color={PERSON_COLOR[p]} onPress={() => setMe(p)} />
          ))}
        </View>
      </View>

      <View style={[styles.body, { flexDirection: wide ? "row" : "column" }]}>
        <View style={styles.stage}>
          <SpaceView
            notes={notes}
            selectedId={selectedId}
            focusZone={focusZone}
            placing={placing}
            ghost={ghost}
            onSurfaceTap={onSurfaceTap}
            onNoteTap={onNoteTap}
            camera={camera}
            focal={focal}
          />
          <View style={styles.zoneBar} pointerEvents="box-none">
            <Chip label="Overview" active={!focusZone} onPress={() => setFocusZone(null)} />
            {ZONES.map((z) => (
              <Chip key={z.zone} label={z.zone} active={focusZone === z.zone} onPress={() => setFocusZone(z.zone)} />
            ))}
            <Chip label={touring ? "Walking…" : "▶ Walk-through"} active={touring} onPress={() => setTouring(true)} />
          </View>
          <View style={styles.stats} pointerEvents="none">
            <Stat n={counts.avery} label="Avery" color={PERSON_COLOR.Avery} />
            <Stat n={counts.morgan} label="Morgan" color={PERSON_COLOR.Morgan} />
            <Stat n={counts.done} label="Done" color="#9AA3AE" />
          </View>
          {placing && (
            <View style={styles.banner} pointerEvents="none">
              <Text style={styles.bannerText}>Placement mode · tap the fridge, a counter, the floor… anywhere it belongs</Text>
            </View>
          )}
          {selected && (
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>{selected.text}</Text>
              <Text style={styles.meta}>{selected.zone} · for {selected.who} · {selected.due} · pinned by {selected.createdBy}</Text>
              <Text style={styles.meta}>Anchor ({selected.position.map((v) => v.toFixed(2)).join(", ")}) m</Text>
              <View style={styles.row}>
                <Chip label={selected.done ? "Reopen" : "Mark done"} active onPress={() => toggleDone(selected.id)} />
                <Chip label={`Fly to ${selected.zone}`} onPress={() => setFocusZone(selected.zone)} />
              </View>
            </View>
          )}
          {toast && (
            <View style={styles.toast} pointerEvents="none">
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          )}
        </View>
        {panel}
      </View>
      {Platform.OS === "web" && (
        <Text style={styles.foot}>Web build renders the apartment's digital twin with ViroReact's WebGL2 renderer · on iOS/Android/Quest the same scene is anchored to real surfaces with ViroARSceneNavigator.</Text>
      )}
    </View>
  );
}

function Chip({ label, active, color, onPress }: { label: string; active?: boolean; color?: string; onPress?: () => void }) {
  return (
    <Pressable testID={`chip-${label}`} onPress={onPress} style={[styles.chip, active && { backgroundColor: color ?? "#FFD84D", borderColor: color ?? "#FFD84D" }]}>
      <Text style={[styles.chipText, active && { color: "#14161C" }]}>{label}</Text>
    </Pressable>
  );
}

function Stat({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statN, { color }]}>{n}</Text>
      <Text style={styles.statL}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0E1016" },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#1E2230", flexWrap: "wrap", gap: 8 },
  brand: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", letterSpacing: 0.3 },
  sub: { color: "#9AA3AE", fontSize: 13, marginRight: 4 },
  body: { flex: 1 },
  stage: { flex: 1, minHeight: 360, position: "relative", backgroundColor: "#151924" },
  zoneBar: { position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  stats: { position: "absolute", bottom: 14, left: 14, flexDirection: "row", gap: 10 },
  stat: { backgroundColor: "#0E1016CC", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, alignItems: "center" },
  statN: { fontSize: 20, fontWeight: "800" },
  statL: { color: "#9AA3AE", fontSize: 11 },
  banner: { position: "absolute", top: 60, alignSelf: "center", backgroundColor: "#FFD84D", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  bannerText: { color: "#14161C", fontWeight: "700" },
  detail: { position: "absolute", right: 14, bottom: 14, width: 300, backgroundColor: "#0E1016EE", borderRadius: 16, padding: 14, gap: 6, borderWidth: 1, borderColor: "#2A3042" },
  detailTitle: { color: "#fff", fontSize: 17, fontWeight: "800" },
  toast: { position: "absolute", top: 104, alignSelf: "center", maxWidth: "80%", backgroundColor: "#1E2230F2", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "#FFD84D" },
  toastText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  panel: { backgroundColor: "#0E1016", padding: 16, gap: 10 },
  panelWide: { width: 360, borderLeftWidth: 1, borderLeftColor: "#1E2230" },
  panelNarrow: { height: 380 },
  h2: { color: "#fff", fontSize: 15, fontWeight: "700" },
  input: { backgroundColor: "#1A1E29", color: "#fff", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, borderWidth: 1, borderColor: "#2A3042" },
  row: { flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: "#3A4256", paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#1A1E29E6" },
  chipText: { color: "#E6E9EF", fontWeight: "600", fontSize: 13 },
  cta: { backgroundColor: "#FFD84D", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  ctaActive: { backgroundColor: "#FF8A3D" },
  ctaText: { color: "#14161C", fontWeight: "800", fontSize: 15 },
  divider: { height: 1, backgroundColor: "#1E2230", marginVertical: 4 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 9, paddingHorizontal: 8, borderRadius: 10 },
  itemSel: { backgroundColor: "#1E2230" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  strike: { textDecorationLine: "line-through", color: "#7D8794" },
  meta: { color: "#9AA3AE", fontSize: 12 },
  check: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: "#3A4256", alignItems: "center", justifyContent: "center" },
  checkOn: { backgroundColor: "#4CD787", borderColor: "#4CD787" },
  checkText: { color: "#14161C", fontWeight: "900" },
  foot: { color: "#5A6270", fontSize: 11, paddingHorizontal: 20, paddingVertical: 6 },
});
