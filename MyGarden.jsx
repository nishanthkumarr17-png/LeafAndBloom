import React, { useEffect, useState } from "react";
import { FaLeaf, FaTint, FaSun, FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MyGarden() {
  const [garden, setGarden] = useState([]);
  const [wateredDates, setWateredDates] = useState({});
  const navigate = useNavigate();
  const [reminderDays, setReminderDays] = useState({});

function getPlantStatus(id) {
  if (!wateredDates[id]) {
    return {
      text: "Needs watering",
      className: "status-warning"
    };
  }

  const lastWatered = new Date(wateredDates[id]);
  const today = new Date();

  const difference =
    (today - lastWatered) / (1000 * 60 * 60 * 24);

  if (difference <= 2) {
    return {
      text: "Recently watered",
      className: "status-good"
    };
  }

  if (difference <= 5) {
    return {
      text: "Watering may be due",
      className: "status-warning"
    };
  }

  return {
    text: "Needs attention",
    className: "status-danger"
  };
}

  useEffect(() => {
    try {
      const savedGarden =
        JSON.parse(localStorage.getItem("my-garden")) || [];

      const savedWatering =
        JSON.parse(localStorage.getItem("my-garden-watering")) || {};

      const savedReminders =
         JSON.parse(localStorage.getItem("my-garden-reminders")) || {};

      setGarden(savedGarden);
      setWateredDates(savedWatering);
      setReminderDays(savedReminders);
    } catch {
      localStorage.removeItem("my-garden");
      localStorage.removeItem("my-garden-watering");
      setGarden([]);
      setWateredDates({});
      setReminderDays({});
    }
  }, []);

  function removePlant(id) {
    const updatedGarden = garden.filter(
      (plant) => plant.id !== id
    );

    setGarden(updatedGarden);

    localStorage.setItem(
      "my-garden",
      JSON.stringify(updatedGarden)
    );

    const updatedWatering = { ...wateredDates };
    delete updatedWatering[id];

    setWateredDates(updatedWatering);

    localStorage.setItem(
      "my-garden-watering",
      JSON.stringify(updatedWatering)
    );
  }

  function markAsWatered(id) {
    const today = new Date().toISOString().split("T")[0];

    const updatedWatering = {
      ...wateredDates,
      [id]: today
    };

    setWateredDates(updatedWatering);

    localStorage.setItem(
      "my-garden-watering",
      JSON.stringify(updatedWatering)
    );
  }
  function setPlantReminder(id, days) {
  const updatedReminders = {
    ...reminderDays,
    [id]: Number(days)
  };

  setReminderDays(updatedReminders);

  localStorage.setItem(
    "my-garden-reminders",
    JSON.stringify(updatedReminders)
  );
}
function getNextWateringDate(id) {
  const days = reminderDays[id];

  if (!days) return null;

  const date = new Date();
  date.setDate(date.getDate() + Number(days));

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

  return (
    <div className="page-shell">

      <div className="section-heading">
        <p className="section-kicker">Your plants</p>

        <h1>My Garden</h1>

        <p className="section-subcopy">
          Keep the plants you own in one place and stay on top of their care.
        </p>
      </div>

      <div className="garden-summary">

  <div className="garden-summary-card">
    <span className="garden-summary-icon">🌱</span>
    <div>
      <strong>{garden.length}</strong>
      <span>{garden.length === 1 ? "Plant" : "Plants"}</span>
    </div>
  </div>

  <div className="garden-summary-card">
    <span className="garden-summary-icon">🟢</span>
    <div>
      <strong>
        {garden.filter(
          (plant) =>
            getPlantStatus(plant.id).className === "status-good"
        ).length}
      </strong>
      <span>Recently Watered</span>
    </div>
  </div>

  <div className="garden-summary-card">
    <span className="garden-summary-icon">🔴</span>
    <div>
      <strong>
        {garden.filter(
          (plant) =>
            getPlantStatus(plant.id).className === "status-danger"
        ).length}
      </strong>
      <span>Needs Attention</span>
    </div>
  </div>

</div>

      {garden.length === 0 ? (

        <div className="empty-wishlist">

          <div className="heart-icon-big">
            <FaLeaf />
          </div>

          <h2>Your garden is empty</h2>

          <p>
            Add plants to your garden and keep their care information close by.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Explore Plants
          </button>

        </div>

      ) : (

        <div className="garden-grid">

          {garden.map((plant) => (

            <article
              className="garden-card"
              key={plant.id}
            >

              <img
                src={plant.image}
                alt={plant.name}
                className="garden-plant-image"
              />

              <div className="garden-card-content">

                <div className="garden-title-row">

                  <div>

                    <p className="section-kicker">
                      {plant.category}
                    </p>

                    <h2>{plant.name}</h2>

                  </div>

                </div>

                <div className="garden-info-grid">

                  <div className="garden-info">

                    <FaSun />

                    <div>
                      <strong>Light</strong>

                      <span>
                        {plant.light}
                      </span>
                    </div>

                  </div>

                  <div className="garden-info">

                    <FaTint />

                    <div>
                      <strong>Watering</strong>

                      <span>
                        {plant.wateringFrequency}
                      </span>
                    </div>

                  </div>

                </div>

                <div className={`plant-status ${getPlantStatus(plant.id).className}`}>
                <span className="status-dot"></span>
                <span>{getPlantStatus(plant.id).text}</span>
                </div>

                <div className="watering-panel">

                  <div>

                    <strong>💧 Watering check</strong>

                    {wateredDates[plant.id] ? (

                      <p>
                        <FaCheck /> Last watered:{" "}
                        {wateredDates[plant.id]}
                      </p>

                    ) : (

                      <p>
                        No watering recorded yet.
                      </p>

                    )}

                  </div>

                  <div className="reminder-control">
  <label htmlFor={`reminder-${plant.id}`}>
    Next watering check
  </label>

  <select
    id={`reminder-${plant.id}`}
    value={reminderDays[plant.id] || ""}
    onChange={(event) =>
      setPlantReminder(plant.id, event.target.value)
    }
  >
    <option value="">Choose</option>
    <option value="1">Tomorrow</option>
    <option value="2">In 2 days</option>
    <option value="3">In 3 days</option>
    <option value="5">In 5 days</option>
    <option value="7">In 7 days</option>
 </select>

    {reminderDays[plant.id] && (
     <p className="next-watering-date">
    🔔 Next watering: {getNextWateringDate(plant.id)}
    </p>
)}

</div>

                  <button
                    type="button"
                    onClick={() => markAsWatered(plant.id)}
                  >
                    <FaTint />
                    Mark as Watered
                  </button>

                </div>

                <div className="garden-actions">

                  <button
                    type="button"
                    className="details-btn"
                    onClick={() =>
                      navigate(`/plants/${plant.id}`)
                    }
                  >
                    View Care
                  </button>

                  <button
                    type="button"
                    className="delete-icon-btn"
                    onClick={() => removePlant(plant.id)}
                    aria-label={`Remove ${plant.name} from My Garden`}
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyGarden;