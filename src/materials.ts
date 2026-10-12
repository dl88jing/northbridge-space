import { ViroMaterials } from "@reactvision/react-viro";
import { PERSON_COLOR } from "./data";

let done = false;
export function registerMaterials() {
  if (done) return;
  done = true;
  ViroMaterials.createMaterials({
    floor: { diffuseColor: "#2A2F3A", lightingModel: "Lambert" },
    floorHot: { diffuseColor: "#33405A", lightingModel: "Lambert" },
    wall: { diffuseColor: "#E9E4DA", lightingModel: "Lambert" },
    wallDark: { diffuseColor: "#CFC8BB", lightingModel: "Lambert" },
    fridge: { diffuseColor: "#DADFE6", lightingModel: "Blinn" },
    counter: { diffuseColor: "#8C7B6A", lightingModel: "Lambert" },
    wood: { diffuseColor: "#A0703F", lightingModel: "Lambert" },
    couch: { diffuseColor: "#4E6A8F", lightingModel: "Lambert" },
    screen: { diffuseColor: "#14161C", lightingModel: "Blinn" },
    plant: { diffuseColor: "#3E8E57", lightingModel: "Lambert" },
    washer: { diffuseColor: "#F2F2F2", lightingModel: "Blinn" },
    door: { diffuseColor: "#7A5233", lightingModel: "Lambert" },
    rug: { diffuseColor: "#6B4E71", lightingModel: "Lambert" },
    card: { diffuseColor: "#FFFDF6", lightingModel: "Constant" },
    cardDone: { diffuseColor: "#9AA3AE", lightingModel: "Constant" },
    cardSelected: { diffuseColor: "#FFF3B0", lightingModel: "Constant" },
    ghost: { diffuseColor: "#FFFFFF66", lightingModel: "Constant" },
    reticle: { diffuseColor: "#FFD84D", lightingModel: "Constant" },
    pinAvery: { diffuseColor: PERSON_COLOR.Avery, lightingModel: "Constant" },
    pinMorgan: { diffuseColor: PERSON_COLOR.Morgan, lightingModel: "Constant" },
    pinBoth: { diffuseColor: PERSON_COLOR.Both, lightingModel: "Constant" },
    pinDone: { diffuseColor: "#7D8794", lightingModel: "Constant" },
  });
}
