import React from "react";
import { FaLeaf, FaSeedling, FaSun, FaTint, FaWind } from "react-icons/fa";

const beginnerRules = [
  {
    title: "Check the soil before watering",
    icon: FaTint,
    text: "Do not water on autopilot. Touch the top layer of soil first and water only when it starts to dry."
  },
  {
    title: "Start with bright indirect light",
    icon: FaSun,
    text: "Most beginner plants do best near a window with good daylight, but not in harsh afternoon sun."
  },
  {
    title: "Watch the leaves every week",
    icon: FaLeaf,
    text: "Yellowing, curling, or drooping leaves are early signs that the plant needs an adjustment."
  },
  {
    title: "Keep airflow gentle",
    icon: FaWind,
    text: "Plants prefer steady air and stable temperature. Avoid placing them right under AC vents or hot appliances."
  }
];

const commonProblems = [
  {
    name: "Yellow leaves",
    cause: "Usually caused by overwatering or poor drainage.",
    fix: "Let the soil dry out more between waterings and make sure the pot can drain."
  },
  {
    name: "Brown crispy edges",
    cause: "Often linked to dry air, underwatering, or strong direct sun.",
    fix: "Move the plant to softer light and keep watering more consistent."
  },
  {
    name: "Drooping plant",
    cause: "Can happen from thirst, root stress, or sudden environment changes.",
    fix: "Check the soil first, then avoid moving the plant too often while it recovers."
  },
  {
    name: "No new growth",
    cause: "Usually a sign of low light or slow seasonal growth.",
    fix: "Give the plant brighter indirect light and be patient during slower months."
  }
];

const beginnerFavorites = [
  {
    title: "Snake Plant",
    why: "Handles missed watering and low-to-bright light better than most indoor plants."
  },
  {
    title: "Spider Plant",
    why: "Fast-growing, cheerful, and very forgiving for first-time plant parents."
  },
  {
    title: "Pothos",
    why: "Easy trailing plant that adapts well and clearly shows when it needs water."
  }
];

function CareGuide() {
  return (
    <div className="page-shell care-page">
      <section className="section-heading care-heading">
        <p className="section-kicker">Plant care guide</p>
        <h1>Simple guidance for beginners</h1>
        <p className="section-subcopy">
          Healthy plants usually come from a steady routine, not constant fixing.
          Start small, observe often, and adjust one thing at a time.
        </p>
      </section>

      <section className="care-rules-grid">
        {beginnerRules.map((rule) => {
          const Icon = rule.icon;

          return (
            <article className="care-rule-card" key={rule.title}>
              <Icon />
              <h2>{rule.title}</h2>
              <p>{rule.text}</p>
            </article>
          );
        })}
      </section>

      <section className="care-layout">
        <div className="care-panel">
          <p className="section-kicker">Common plant issues</p>
          <h2>What beginners usually run into</h2>

          <div className="problem-list">
            {commonProblems.map((problem) => (
              <article className="problem-card" key={problem.name}>
                <strong>{problem.name}</strong>
                <p><span>Cause:</span> {problem.cause}</p>
                <p><span>Fix:</span> {problem.fix}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="care-panel">
          <p className="section-kicker">Best starter plants</p>
          <h2>Low-stress picks for new plant parents</h2>

          <div className="starter-list">
            {beginnerFavorites.map((item) => (
              <article className="starter-card" key={item.title}>
                <FaSeedling />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.why}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="care-note-box">
            <h3>Good beginner routine</h3>
            <p>1. Check light once when placing the plant.</p>
            <p>2. Check soil every few days before watering.</p>
            <p>3. Rotate the pot weekly for even growth.</p>
            <p>4. Clean dusty leaves and remove damaged foliage.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareGuide;
