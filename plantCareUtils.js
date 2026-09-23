export function getWateringTip(plant) {
  return plant.wateringFrequency || "Water when the top 1 to 2 inches of soil feel dry.";
}

export function getLightTip(plant) {
  return `${plant.name} does best in ${plant.light.toLowerCase()}.`;
}

export function getBeginnerTip(plant) {
  if (plant.difficulty?.toLowerCase().includes("very easy")) {
    return `${plant.name} is one of the easiest plants to start with.`;
  }

  if (
    plant.difficulty?.toLowerCase().includes("easy") ||
    plant.category === "Beginner Friendly" ||
    plant.category === "Low Maintenance" ||
    plant.category === "Desk Plant"
  ) {
    return `${plant.name} is beginner friendly when you keep its light and watering steady.`;
  }

  if (plant.category === "Flowering") {
    return `${plant.name} appreciates steady bright indirect light and a more observant routine while blooming.`;
  }

  return `${plant.name} is easiest to grow when you observe the leaves weekly and avoid sudden routine changes.`;
}

export function getPetSafetyText(plant) {
  return plant.petSafety || "Use caution around pets";
}

export function getHumidityTip(plant) {
  return plant.humidity || "Average indoor humidity is suitable.";
}
