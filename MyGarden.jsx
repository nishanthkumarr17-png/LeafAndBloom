import React, { useEffect, useState } from "react";
import { FaLeaf, FaTint, FaSun, FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MyGarden() {
  const [garden, setGarden] = useState([]);
  const [wateredDates, setWateredDates] = useState({});
  const [wateringHistory, setWateringHistory] = useState({});
  const navigate = useNavigate();
  const [reminderDays, setReminderDays] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
  if ("Notification" in window) {
    const enabled = Notification.permission === "granted";

    setNotificationsEnabled(enabled);

    if (enabled) {
      subscribeToPushNotifications();
    }
  }
}, []);

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

     const savedHistory =
     JSON.parse(localStorage.getItem("my-garden-watering-history")) || {};

     setWateringHistory(savedHistory);

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

   if (wateredDates[id] === today) {
  alert("This plant has already been marked as watered today. 🌿");
  return;
}
    const updatedWatering = {
      ...wateredDates,
      [id]: today
    };

    setWateredDates(updatedWatering);

    localStorage.setItem(
      "my-garden-watering",
      JSON.stringify(updatedWatering)
    );
    const updatedHistory = {
  ...wateringHistory,
  [id]: Array.from(
    new Set([...(wateringHistory[id] || []), today])
  )
};
   setWateringHistory(updatedHistory);

   localStorage.setItem(
  "my-garden-watering-history",
  JSON.stringify(updatedHistory)
);
  }
  function setPlantReminder(id, days) {
  const updatedReminders = {
    ...reminderDays,
    [id]: days
  };

  setReminderDays(updatedReminders);

  localStorage.setItem(
    "my-garden-reminders",
    JSON.stringify(updatedReminders)
  );
}

async function savePushReminder(plant, days) {
  try {
    if (!days) return;

    const registration = await navigator.serviceWorker.ready;
    const subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log("No push subscription found.");
      return;
    }

    const reminderDate = new Date();

    reminderDate.setHours(0, 0, 0, 0);
    reminderDate.setDate(
      reminderDate.getDate() + Number(days)
    );

    const formattedDate = reminderDate
      .toISOString()
      .split("T")[0];

    const response = await fetch(
      "https://leafandbloom.onrender.com/api/plant-reminder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          plantId: String(plant.id),
          plantName: plant.name,
          reminderDate: formattedDate
        })
      }
    );

    const result = await response.json();

    console.log(result);
  } catch (error) {
    console.error("Failed to save plant reminder:", error);
  }
}

function getNextWateringDate(id) {
  const days = Number(reminderDays[id]);

  if (!days) return null;

  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getReminderText(plant) {
  const days = reminderDays[plant.id];

  if (!days) {
    return "No watering reminder set";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderDate = new Date();
  reminderDate.setHours(0, 0, 0, 0);
  reminderDate.setDate(reminderDate.getDate() + Number(days));

  const difference =
    Math.round((reminderDate - today) / (1000 * 60 * 60 * 24));

  if (difference <= 0) {
    return `${plant.name} needs a watering check today.`;
  }

  if (difference === 1) {
    return `${plant.name} needs a watering check tomorrow.`;
  }

  return `Next watering check: ${getNextWateringDate(plant.id)}`;
}

async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;

    const response = await fetch("https://leafandbloom.onrender.com/api/push/public-key");
    const data = await response.json();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });

    await fetch("https://leafandbloom.onrender.com/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    console.log("Push notification subscription saved.");
  } catch (error) {
    console.error("Push subscription failed:", error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4); 
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function sendCareNotification(plant) {
  if (!notificationsEnabled) return;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("🌿 Plant Care Reminder", {
      body: `${plant.name} needs a watering check.`,
    });
  }
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

                <div className="smart-reminder">
                <span>🔔</span>
                  <div>
                   <strong>Care Reminder</strong>
                <p>{getReminderText(plant)}</p>
                </div>
                 </div>

                 {!notificationsEnabled && (
                 <button
                  type="button"
                  className="notification-btn"
                  onClick={async () => {
                  if ("Notification" in window) {
                   const permission = await Notification.requestPermission();

                   if (permission === "granted") {
                   setNotificationsEnabled(true);

                   await subscribeToPushNotifications();

                  new Notification("Leaf & Bloom 🌱", {
                  body: "Plant care notifications are now enabled!",
          });
        }
      }
    }}
  >
    🔔 Enable Plant Care Notifications
  </button>
)}

                <div className="care-progress">
                <div className="care-progress-header">
                  <strong>Care Progress</strong>
                <span>Good</span>
                </div>

                  <div className="care-prog-ress-bar">
                  <div className="care-progress-fill"></div>
                  </div>

                <small>Your plant is on track. Keep following its care routine.</small>
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
    onChange={(event) => {
  const days = event.target.value;

  setPlantReminder(plant.id, days);
  savePushReminder(plant, days);
}}
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
                    onClick={() => {
                      markAsWatered(plant.id);
                      sendCareNotification(plant);
                    }}
                  >
                    <FaTint />
                    Mark as Watered
                  </button>

                </div>
                {wateringHistory[plant.id]?.length > 0 && (
                <div className="watering-history">
                   <strong>💧 Watering History</strong>

                <div className="watering-history-list">
                {wateringHistory[plant.id]
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((date, index) => (
                <div className="watering-history-item" key={`${date}-${index}`}>
                <span>Watered</span>
               <span>{date}</span>
               </div>
                 ))}
               </div>
               </div>
            )}

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