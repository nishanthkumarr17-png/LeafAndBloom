import mongoose from "mongoose";
import cors from "cors";
import express from "express";

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

app.listen(9001, () => {
  console.log("Server started at port 9001");
});
