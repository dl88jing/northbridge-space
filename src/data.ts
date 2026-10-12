export type Person = "Avery" | "Morgan" | "Both";
export type Zone = "Kitchen" | "Living" | "Entry" | "Laundry";

export type SpaceNote = {
  id: string;
  text: string;
  who: Person;
  zone: Zone;
  position: [number, number, number];
  due?: string;
  done: boolean;
  createdBy: "Avery" | "Morgan";
};

export const PERSON_COLOR: Record<Person, string> = {
  Avery: "#FF8A3D",
  Morgan: "#4CC3FF",
  Both: "#B48CFF",
};

// Room layout (metres). Floor is y = 0, room spans x [-4, 4], z [-3, 3].
export type Fixture = {
  id: string;
  label: string;
  zone: Zone;
  position: [number, number, number];
  size: [number, number, number];
  material: string;
};

export const FIXTURES: Fixture[] = [
  { id: "fridge", label: "Fridge", zone: "Kitchen", position: [-3.3, 0.95, -2.4], size: [0.9, 1.9, 0.8], material: "fridge" },
  { id: "counter", label: "Counter", zone: "Kitchen", position: [-1.7, 0.45, -2.6], size: [2.2, 0.9, 0.7], material: "counter" },
  { id: "table", label: "Dining table", zone: "Kitchen", position: [-1.9, 0.38, -0.6], size: [1.4, 0.76, 0.9], material: "wood" },
  { id: "couch", label: "Couch", zone: "Living", position: [2.0, 0.4, -2.3], size: [2.4, 0.8, 0.9], material: "couch" },
  { id: "tv", label: "TV", zone: "Living", position: [2.0, 1.3, 2.85], size: [1.8, 1.0, 0.1], material: "screen" },
  { id: "plant", label: "Monstera", zone: "Living", position: [3.5, 0.6, -0.4], size: [0.5, 1.2, 0.5], material: "plant" },
  { id: "washer", label: "Washer", zone: "Laundry", position: [-3.4, 0.45, 1.3], size: [0.8, 0.9, 0.8], material: "washer" },
  { id: "dryer", label: "Dryer", zone: "Laundry", position: [-3.4, 0.45, 2.3], size: [0.8, 0.9, 0.8], material: "washer" },
  { id: "door", label: "Front door", zone: "Entry", position: [-0.6, 1.05, 2.95], size: [1.0, 2.1, 0.08], material: "door" },
];

export function zoneFor(x: number, z: number): Zone {
  if (z > 1.6 && x > -2.6) return "Entry";
  if (x < -2.4 && z > 0.6) return "Laundry";
  if (x < 0.3) return "Kitchen";
  return "Living";
}

export const ZONES: { zone: Zone; camera: [number, number, number]; focal: [number, number, number] }[] = [
  { zone: "Kitchen", camera: [0.4, 3.0, 2.6], focal: [-2.4, 0.6, -1.6] },
  { zone: "Living", camera: [0.8, 2.4, 1.4], focal: [2.4, 0.6, -1.2] },
  { zone: "Laundry", camera: [-0.4, 2.6, 0.2], focal: [-3.3, 0.6, 1.8] },
  { zone: "Entry", camera: [0.6, 2.2, -0.8], focal: [-0.6, 1.0, 2.8] },
];

export const OVERVIEW = { camera: [0, 5.6, 5.4] as [number, number, number], focal: [0, 0, -0.5] as [number, number, number] };

export const SEED_NOTES: SpaceNote[] = [
  { id: "n1", text: "Milk + eggs low", who: "Morgan", zone: "Kitchen", position: [-3.3, 2.05, -1.95], due: "Today", done: false, createdBy: "Avery" },
  { id: "n2", text: "Descale kettle", who: "Avery", zone: "Kitchen", position: [-1.3, 1.0, -2.4], due: "Sat", done: false, createdBy: "Morgan" },
  { id: "n3", text: "Water monstera", who: "Avery", zone: "Living", position: [3.5, 1.35, -0.4], due: "Every Sun", done: false, createdBy: "Avery" },
  { id: "n4", text: "Move towels to dryer", who: "Morgan", zone: "Laundry", position: [-3.4, 1.05, 2.3], due: "6 PM", done: false, createdBy: "Avery" },
  { id: "n5", text: "Keys + gym bag", who: "Both", zone: "Entry", position: [-0.6, 2.25, 2.85], due: "Mornings", done: false, createdBy: "Morgan" },
];
