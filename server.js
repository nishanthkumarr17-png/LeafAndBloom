import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import webpush from "web-push";
import "dotenv/config";
import cron from "node-cron";

webpush.setVapidDetails(
  "mailto:admin@leafandbloom.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/plantdb")
  .then((isConnected) => {
    if (isConnected) {
      console.log("DB Connected");
    }
  })
  .catch((err) => {
    console.log(err);
  });

const plantOrderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  pincode: String,
  payment: String,
  title: String,
  category: String,
  size: String,
  light: String,
  price: Number,
  image: String,
  date: String
});

const plantSchema = new mongoose.Schema({
  title: String,
  category: String,
  size: String,
  light: String,
  image: String,
  price: Number
});

const plantWishlistSchema = new mongoose.Schema({
  title: String,
  category: String,
  size: String,
  light: String,
  image: String,
  price: Number
});

const PlantWishlistItem = mongoose.model("wishlist", plantWishlistSchema);
const PlantOrder = mongoose.model("orders", plantOrderSchema);
const PlantProduct = mongoose.model("Plant", plantSchema);

app.get("/greet", (req, res) => {
  res.send("Hello, this is the online plant store backend");
});

async function getPlantOrders(req, res) {
  try {
    const data = await PlantOrder.find();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching orders");
  }
}

async function createPlantOrder(req, res) {
  try {
    const newOrder = new PlantOrder(req.body);
    await newOrder.save();
    res.send("Order placed successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error placing order");
  }
}

async function addPlantWishlistItem(req, res) {
  try {
    const item = new PlantWishlistItem(req.body);
    await item.save();
    res.send("Added to wishlist");
  } catch {
    res.status(500).send("Error");
  }
}

async function getPlantWishlist(req, res) {
  const data = await PlantWishlistItem.find();
  res.json(data);
}

async function deletePlantWishlistItem(req, res) {
  await PlantWishlistItem.findByIdAndDelete(req.params.id);
  res.send("Removed");
}

app.get("/orders", getPlantOrders);
app.get("/getorders", getPlantOrders);

app.post("/orders", createPlantOrder);
app.post("/orderplace", createPlantOrder);

app.post("/wishlist-items", addPlantWishlistItem);
app.post("/addwishlist", addPlantWishlistItem);

app.get("/wishlist-items", getPlantWishlist);
app.get("/wishlist", getPlantWishlist);

app.delete("/wishlist-items/:id", deletePlantWishlistItem);
app.delete("/wishlist/:id", deletePlantWishlistItem);

app.post("/plants", (req, res) => {
  const newPlant = PlantProduct(req.body);
  newPlant
    .save()
    .then((isPlaced) => {
      if (isPlaced) {
        res.send("plant added successfully");
      } else {
        res.send("Please try again later");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/addplants", (req, res) => {
  const newPlant = PlantProduct(req.body);
  newPlant
    .save()
    .then((isPlaced) => {
      if (isPlaced) {
        res.send("plant added successfully");
      } else {
        res.send("Please try again later");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const pushSubscriptionSchema = new mongoose.Schema({
  endpoint: String,
  expirationTime: mongoose.Schema.Types.Mixed,
  keys: {
    p256dh: String,
    auth: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PushSubscription = mongoose.model(
  "PushSubscription",
  pushSubscriptionSchema
);

const plantReminderSchema = new mongoose.Schema({
  endpoint: String,
  plantId: String,
  plantName: String,
  reminderDate: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PlantReminder = mongoose.model(
  "PlantReminder",
  plantReminderSchema
);

app.get("/api/push/public-key", (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY
  });
});

app.post("/api/push/subscribe", async (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({
      message: "Invalid push subscription"
    });
  }

  try {
    const existing = await PushSubscription.findOne({
      endpoint: subscription.endpoint
    });

    if (!existing) {
      await PushSubscription.create({
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime || null,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      });
    }

    res.status(201).json({
      message: "Push subscription saved"
    });
  } catch (error) {
    console.error("Error saving push subscription:", error);

    res.status(500).json({
      message: "Failed to save push subscription"
    });
  }
});

app.post("/api/plant-reminder", async (req, res) => {
  const {
    endpoint,
    plantId,
    plantName,
    reminderDate
  } = req.body;

  if (!endpoint || !plantId || !plantName || !reminderDate) {
    return res.status(400).json({
      message: "Missing reminder information"
    });
  }

  try {
    await PlantReminder.create({
      endpoint,
      plantId,
      plantName,
      reminderDate
    });

    res.status(201).json({
      message: "Plant reminder saved"
    });
  } catch (error) {
    console.error("Error saving plant reminder:", error);

    res.status(500).json({
      message: "Failed to save plant reminder"
    });
  }
});

app.post("/api/push/test", async (req, res) => {
  const payload = JSON.stringify({
    title: "🌿 Leaf & Bloom",
    body: "Your plant care notification is working!"
  });

  try {
    const subscriptions = await PushSubscription.find();

    await Promise.all(
      subscriptions.map((subscription) =>
        webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            expirationTime: subscription.expirationTime,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth
            }
          },
          payload
        )
      )
    );

    res.json({
      message: "Test notification sent"
    });
  } catch (error) {
    console.error("Push notification failed:", error);

    res.status(500).json({
      message: "Push notification failed",
      error: error.message
    });
  }
});

cron.schedule("* * * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const reminders = await PlantReminder.find({
      reminderDate: { $lte: today }
    });

    for (const reminder of reminders) {
      const subscription = await PushSubscription.findOne({
        endpoint: reminder.endpoint
      });

      if (!subscription) {
        await PlantReminder.deleteOne({ _id: reminder._id });
        continue;
      }

      const payload = JSON.stringify({
        title: "🌿 Plant Care Reminder",
        body: `${reminder.plantName} needs a watering check today.`
      });

      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            expirationTime: subscription.expirationTime,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth
            }
          },
          payload
        );

        console.log(
          `Reminder sent for ${reminder.plantName}`
        );

        await PlantReminder.deleteOne({
          _id: reminder._id
        });
      } catch (error) {
        console.error(
          `Failed to send reminder for ${reminder.plantName}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("Reminder checker error:", error);
  }
});

const PORT = process.env.PORT || 9001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started at port ${PORT}`);
});