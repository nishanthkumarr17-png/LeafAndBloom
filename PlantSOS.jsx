import React, { useState } from "react";
import {
  FaLeaf,
  FaTint,
  FaSun,
  FaBug,
  FaCloudRain,
  FaArrowRight
} from "react-icons/fa";

const problems = [
  {
    id: "yellow",
    icon: <FaLeaf />,
    title: "Yellow Leaves",
    description: "Leaves are turning yellow or pale.",
    advice:
      "Check the soil before watering. Yellow leaves can happen when the soil stays too wet for too long. Let the top layer of soil dry before watering again."
  },
  {
    id: "brown",
    icon: <FaSun />,
    title: "Brown Leaves",
    description: "Leaf edges or tips are becoming brown.",
    advice:
      "Check humidity, watering, and direct sunlight. Keep the plant away from harsh direct sunlight and avoid letting the soil become completely dry."
  },
  {
    id: "drooping",
    icon: <FaTint />,
    title: "Drooping",
    description: "Leaves or stems are hanging down.",
    advice:
      "Check the soil moisture first. If the soil is very dry, water thoroughly. If the soil is already wet, avoid adding more water and check the roots and drainage."
  },
  {
    id: "pests",
    icon: <FaBug />,
    title: "Pests",
    description: "You can see insects or small bugs.",
    advice:
      "Move the affected plant away from other plants. Inspect both sides of the leaves and stems. Clean affected areas gently and continue checking the plant regularly."
  },
  {
    id: "overwatered",
    icon: <FaCloudRain />,
    title: "Overwatering",
    description: "The soil stays wet for a long time.",
    advice:
      "Pause watering and make sure the pot has drainage holes. Allow excess water to drain completely and let the soil dry appropriately before watering again."
  },
  {
    id: "dry",
    icon: <FaTint />,
    title: "Too Dry",
    description: "The soil is very dry and leaves look weak.",
    advice:
      "Check the soil depth before watering. If the soil is dry, water the plant thoroughly until some water drains from the bottom of the pot."
  }
];

function PlantSOS() {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const selected = problems.find(
    (problem) => problem.id === selectedProblem
  );

  return (
    <div className="page-shell">
      <div className="section-heading sos-heading">
        <p className="section-kicker">Plant SOS</p>

        <h1>Something wrong with your plant?</h1>

        <p className="section-subcopy">
          Tell us what you are noticing and Leaf & Bloom will give you
          simple care steps to help your plant recover.
        </p>
      </div>

      <section className="sos-card">
        <div className="sos-card-header">
          <div>
            <p className="section-kicker">Choose a problem</p>
            <h2>What is happening?</h2>
          </div>

          <div className="sos-icon">
            <FaLeaf />
          </div>
        </div>

        <div className="sos-problem-grid">
          {problems.map((problem) => (
            <button
              type="button"
              key={problem.id}
              className={`sos-problem ${
                selectedProblem === problem.id ? "active" : ""
              }`}
              onClick={() => setSelectedProblem(problem.id)}
            >
              <span className="sos-problem-icon">{problem.icon}</span>

              <span className="sos-problem-content">
                <strong>{problem.title}</strong>
                <small>{problem.description}</small>
              </span>

              <FaArrowRight className="sos-arrow" />
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <section className="sos-result">
          <div className="sos-result-icon">
            {selected.icon}
          </div>

          <div className="sos-result-content">
            <p className="section-kicker">Care recommendation</p>

            <h2>{selected.title}</h2>

            <p>{selected.advice}</p>

            <div className="sos-next-step">
              <FaLeaf />
              <span>
                Monitor the plant for the next few days and adjust care
                gradually.
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default PlantSOS;