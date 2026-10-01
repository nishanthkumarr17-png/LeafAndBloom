import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaArrowRight } from "react-icons/fa";
import plants from "./plantsData.js";

function PlantFinder() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    room: "",
    light: "",
    care: "",
    pets: "",
    type: ""
  });

  const [showResults, setShowResults] = useState(false);

  function handleChange(field, value) {
    setAnswers((previous) => ({
      ...previous,
      [field]: value
    }));
  }

  const recommendations = useMemo(() => {
    if (!showResults) return [];

    let scoredPlants = plants.map((plant) => {
      let score = 0;

      if (answers.light && plant.light?.toLowerCase().includes(answers.light)) {
        score += 3;
      }

      if (
        answers.care === "easy" &&
        plant.difficulty?.toLowerCase().includes("easy")
      ) {
        score += 3;
      }

      if (
        answers.type &&
        plant.category?.toLowerCase().includes(answers.type)
      ) {
        score += 2;
      }

      if (
        answers.pets === "yes" &&
        plant.petSafety?.toLowerCase().includes("safe")
      ) {
        score += 4;
      }

      return {
        ...plant,
        score
      };
    });

    return scoredPlants
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [answers, showResults]);

 function findPlants() {
  const allAnswered =
    answers.room &&
    answers.light &&
    answers.care &&
    answers.pets &&
    answers.type;

  if (!allAnswered) {
    alert("Please answer all the questions to find your perfect plants.");
    return;
  }

  setShowResults(true);
}

  return (
    <div className="page-shell">
      <div className="section-heading finder-heading">
        <p className="section-kicker">Plant match</p>

        <h1>Find Your Perfect Plant</h1>

        <p className="section-subcopy">
          Tell us a little about your space and lifestyle, and Leaf & Bloom
          will suggest plants that match your needs.
        </p>
      </div>

      <div className="plant-finder-card">
        <div className="finder-question">
          <h3>1. Where will you keep your plant?</h3>

          <div className="finder-options">
            {["Bedroom", "Living room", "Balcony", "Office"].map((room) => (
              <button
                key={room}
                type="button"
                className={answers.room === room ? "finder-option active" : "finder-option"}
                onClick={() => handleChange("room", room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="finder-question">
          <h3>2. How much light does the space get?</h3>

          <div className="finder-options">
            {[
              { value: "low", label: "Low light" },
              { value: "medium", label: "Medium light" },
              { value: "bright", label: "Bright light" }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={
                  answers.light === item.value
                    ? "finder-option active"
                    : "finder-option"
                }
                onClick={() => handleChange("light", item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="finder-question">
          <h3>3. How much time can you spend caring for plants?</h3>

          <div className="finder-options">
            <button
              type="button"
              className={
                answers.care === "easy"
                  ? "finder-option active"
                  : "finder-option"
              }
              onClick={() => handleChange("care", "easy")}
            >
              Very little
            </button>

            <button
              type="button"
              className={
                answers.care === "regular"
                  ? "finder-option active"
                  : "finder-option"
              }
              onClick={() => handleChange("care", "regular")}
            >
              A few times a week
            </button>

            <button
              type="button"
              className={
                answers.care === "frequent"
                  ? "finder-option active"
                  : "finder-option"
              }
              onClick={() => handleChange("care", "frequent")}
            >
              Regularly
            </button>
          </div>
        </div>

        <div className="finder-question">
          <h3>4. Do you have pets?</h3>

          <div className="finder-options">
            <button
              type="button"
              className={
                answers.pets === "yes"
                  ? "finder-option active"
                  : "finder-option"
              }
              onClick={() => handleChange("pets", "yes")}
            >
              Yes
            </button>

            <button
              type="button"
              className={
                answers.pets === "no"
                  ? "finder-option active"
                  : "finder-option"
              }
              onClick={() => handleChange("pets", "no")}
            >
              No
            </button>
          </div>
        </div>

        <div className="finder-question">
          <h3>5. What kind of plant are you looking for?</h3>

          <div className="finder-options">
            {[
              { value: "foliage", label: "Decorative foliage" },
              { value: "flowering", label: "Flowering" },
              { value: "succulent", label: "Succulent" },
              { value: "palm", label: "Palm" }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={
                  answers.type === item.value
                    ? "finder-option active"
                    : "finder-option"
                }
                onClick={() => handleChange("type", item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="finder-submit"
          onClick={findPlants}
        >
          <FaLeaf />
          Find My Plants
          <FaArrowRight />
        </button>
      </div>

      {showResults && (
        <div className="finder-results">
          <div className="section-heading">
            <p className="section-kicker">Your matches</p>
            <h2>Plants for your space</h2>
          </div>

          <div className="finder-results-grid">
            {recommendations.map((plant) => (
              <article className="finder-result-card" key={plant.id}>
                <div className="finder-match-badge">
                  🌿 Match score: {plant.score}
        </div>
                <img src={plant.image} alt={plant.name} />

                <div className="finder-result-content">
                  <p className="section-kicker">{plant.category}</p>

                  <h3>{plant.name}</h3>

                  <p>{plant.light}</p>

                  <button
                    type="button"
                    onClick={() => navigate(`/plants/${plant.id}`)}
                  >
                    View Plant
                    <FaArrowRight />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantFinder;