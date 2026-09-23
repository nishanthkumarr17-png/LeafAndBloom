import React, { useEffect, useMemo, useState } from "react";
import { FaCommentDots, FaLeaf, FaPaperPlane, FaTimes } from "react-icons/fa";
import plants from "./plantsData.js";
import {
  getBeginnerTip,
  getHumidityTip,
  getLightTip,
  getPetSafetyText,
  getWateringTip
} from "./plantCareUtils.js";

const ACTIVE_PLANT_STORAGE_KEY = "plantnest-active-plant";
const defaultMessages = [
  {
    role: "assistant",
    text: "I'm your Leaf & Bloom Assistant. Ask about watering, light, humidity, pet safety, or any plant in the store."
  }
];

function getStoredPlant() {
  try {
    const stored = localStorage.getItem(ACTIVE_PLANT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(ACTIVE_PLANT_STORAGE_KEY);
    return null;
  }
}

function getPlantMatch(message) {
  const normalized = message.toLowerCase();
  return plants.find((plant) => normalized.includes(plant.name.toLowerCase()));
}

function shouldUseCurrentPlant(message) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("this") ||
    normalized.includes("it") ||
    normalized.includes("current") ||
    normalized.includes("care") ||
    normalized.includes("water") ||
    normalized.includes("light") ||
    normalized.includes("sun") ||
    normalized.includes("price") ||
    normalized.includes("beginner") ||
    normalized.includes("maintain") ||
    normalized.includes("yellow") ||
    normalized.includes("brown") ||
    normalized.includes("pet") ||
    normalized.includes("humidity")
  );
}

function buildPlantAnswer(plant, message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("water")) {
    return getWateringTip(plant);
  }

  if (normalized.includes("light") || normalized.includes("sun")) {
    return `${getLightTip(plant)} Best placement: ${plant.placement}.`;
  }

  if (normalized.includes("humidity")) {
    return `${plant.name} prefers ${getHumidityTip(plant).toLowerCase()}.`;
  }

  if (normalized.includes("pet")) {
    return `${plant.name}: ${getPetSafetyText(plant)}.`;
  }

  if (normalized.includes("price") || normalized.includes("cost")) {
    return `${plant.name} is currently listed at ₹ ${plant.price}. It suits ${plant.size.toLowerCase()} spaces and usually fits best in ${plant.placement.toLowerCase()}.`;
  }

  if (normalized.includes("soil")) {
    return `${plant.name} grows best in ${plant.soil.toLowerCase()}.`;
  }

  if (normalized.includes("fertilizer") || normalized.includes("feed")) {
    return `${plant.name}: ${plant.fertilizer}.`;
  }

  if (normalized.includes("yellow")) {
    return `If ${plant.name} is getting yellow leaves, check watering first, then light consistency. ${getWateringTip(plant)}`;
  }

  if (normalized.includes("brown")) {
    return `Brown edges on ${plant.name} can point to dry air, missed watering, or light stress. ${plant.name} prefers ${getHumidityTip(plant).toLowerCase()}.`;
  }

  if (normalized.includes("beginner") || normalized.includes("care") || normalized.includes("maintain")) {
    return `${getBeginnerTip(plant)} ${getWateringTip(plant)} ${plant.name} also prefers ${getHumidityTip(plant).toLowerCase()}.`;
  }

  return `${plant.name} is a ${plant.category.toLowerCase()} plant for ${plant.size.toLowerCase()} spaces. ${getLightTip(plant)} ${getWateringTip(plant)} Pet note: ${getPetSafetyText(plant)}.`;
}

function getGeneralAnswer(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("beginner")) {
    return "For beginners, start with Snake Plant, Spider Plant, Pothos, ZZ Plant, or Baby Rubber Plant. They handle imperfect routines better than most plants.";
  }

  if (normalized.includes("pet")) {
    return "If you have pets, safer choices in this store include Spider Plant, Parlor Palm, Baby Rubber Plant, Hoya Carnosa, Boston Fern, and Nerve Plant.";
  }

  if (normalized.includes("humidity")) {
    return "If your room is dry, choose plants that tolerate average humidity. If your room is humid, ferns, calatheas, and nerve plants will usually feel more comfortable.";
  }

  if (normalized.includes("water")) {
    return "A good beginner rule is to check the soil before watering. If the top layer is still damp, wait another day or two.";
  }

  if (normalized.includes("light") || normalized.includes("sun")) {
    return "Most indoor plants here prefer bright indirect light. That usually means near a bright window, but not under harsh afternoon sun.";
  }

  if (normalized.includes("yellow") || normalized.includes("droop") || normalized.includes("brown")) {
    return "Yellow leaves often suggest overwatering, drooping can mean thirst or root stress, and brown crispy edges usually point to dry air, underwatering, or harsh sun.";
  }

  if (normalized.includes("recommend") || normalized.includes("suggest")) {
    return "If you want easy options, try Snake Plant, Spider Plant, ZZ Plant, or Pothos. If you want something bolder, Monstera, Fiddle Leaf Fig, or Bird of Paradise are stronger statement picks.";
  }

  return "Ask me about a plant by name, for example: 'How do I care for Monstera Deliciosa?' or 'Is Snake Plant pet safe?'";
}

function PlantAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentPlant, setCurrentPlant] = useState(getStoredPlant);
  const [messages, setMessages] = useState(defaultMessages);

  useEffect(() => {
    function handleActivePlant(event) {
      setCurrentPlant(event.detail || null);
    }

    window.addEventListener("plantnest:set-active-plant", handleActivePlant);
    return () => {
      window.removeEventListener("plantnest:set-active-plant", handleActivePlant);
    };
  }, []);

  const quickPrompts = useMemo(() => {
    if (currentPlant) {
      return [
        `How do I care for ${currentPlant.name}?`,
        `How much light does ${currentPlant.name} need?`,
        `Is ${currentPlant.name} pet safe?`,
        "How often should I water this plant?"
      ];
    }

    return [
      "Is Snake Plant good for beginners?",
      "How do I care for Monstera Deliciosa?",
      "What plant needs low light?",
      "Which plants are pet safe?"
    ];
  }, [currentPlant]);

  function handleClose() {
    setOpen(false);
    setInput("");
    setMessages(defaultMessages);
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const namedPlant = getPlantMatch(trimmed);
    const activePlantAnswer = !namedPlant && currentPlant && shouldUseCurrentPlant(trimmed);
    const reply = namedPlant
      ? buildPlantAnswer(namedPlant, trimmed)
      : activePlantAnswer
        ? buildPlantAnswer(currentPlant, trimmed)
        : getGeneralAnswer(trimmed);

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: reply }
    ]);
    setInput("");
    setOpen(true);
  }

  return (
    <div className="plant-assistant">
      {open && (
        <div className="assistant-panel">
          <div className="assistant-header">
            <div>
              <p className="section-kicker">Leaf & Bloom helper</p>
              <h3>Leaf & Bloom Assistant</h3>
            </div>
            <button type="button" className="assistant-close" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>

          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`assistant-message ${message.role === "user" ? "user" : "assistant"}`}
              >
                {message.role === "assistant" && <FaLeaf />}
                <span>{message.text}</span>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="assistant-quick-prompts">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="assistant-input-row">
            <input
              type="text"
              placeholder={
                currentPlant
                  ? `Ask about ${currentPlant.name}...`
                  : "Ask about watering, light, pet safety, or a specific plant..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(input);
                }
              }}
            />
            <button type="button" className="assistant-send" onClick={() => sendMessage(input)}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button type="button" className="assistant-toggle" onClick={() => setOpen(true)}>
          <FaCommentDots />
          Leaf & Bloom Assistant
        </button>
      )}
    </div>
  );
}

export default PlantAssistant;
