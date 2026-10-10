import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaGift, FaHome, FaLeaf, FaPaw, FaSun, FaTint } from "react-icons/fa";
import plants from "./plantsData.js";
import { getPlantImageProps } from "./plantImageUtils.js";
import PlantCard from "./components/PlantCard.jsx";

function setActivePlant(plant) {
  localStorage.setItem("plantnest-active-plant", JSON.stringify(plant));
  window.dispatchEvent(new CustomEvent("plantnest:set-active-plant", { detail: plant }));
}

function getSortLabel(sortBy) {
  switch (sortBy) {
    case "price-low-high":
      return "Price: Low to High";
    case "price-high-low":
      return "Price: High to Low";
    case "name-a-z":
      return "Name: A to Z";
    case "name-z-a":
      return "Name: Z to A";
    default:
      return "Featured";
  }
}

function Plants() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedLight, setSelectedLight] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [imageSearchStatus, setImageSearchStatus] = useState("");
  const [recognizedLabel, setRecognizedLabel] = useState("");
  const [imageSearchMatch, setImageSearchMatch] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [tfModel, setTfModel] = useState(null);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(saved);
    } catch {
      localStorage.removeItem("wishlist");
      setWishlist([]);
    }
  }, []);

  const categories = useMemo(
    () => [...new Set(plants.map((plant) => plant.category))].slice(0, 6),
    []
  );

  const sizes = useMemo(
    () => ["All", ...new Set(plants.map((plant) => plant.size))],
    []
  );

  const lightLevels = useMemo(
    () => ["All", ...new Set(plants.map((plant) => plant.light))],
    []
  );

  const roomCollections = [
    {
      title: "Bright living rooms",
      copy: "Large, sculptural greens for open corners and seating areas.",
      searchValue: "bright",
      icon: FaSun
    },
    {
      title: "Compact work desks",
      copy: "Compact plants that fit desks, shelves, and study tables.",
      searchValue: "desk",
      icon: FaLeaf
    },
    {
      title: "Calm bedrooms",
      copy: "Soft, steady plants for restful rooms and lower-light corners.",
      searchValue: "low",
      icon: FaHome
    }
  ];

  const browseCollections = [
    {
      title: "Flowering Plants",
      description: "Blooming picks for instant color.",
      searchValue: "flowering",
      icon: FaLeaf
    },
    {
      title: "Gift Sets",
      description: "Easy plants for thoughtful gifting.",
      searchValue: "gift",
      icon: FaGift
    },
    {
      title: "Low Light",
      description: "For softer indoor corners.",
      searchValue: "low",
      icon: FaHome
    },
    {
      title: "Palms",
      description: "Airy tropical silhouettes.",
      searchValue: "palm",
      icon: FaSun
    },
    {
      title: "Pet Friendly",
      description: "Safer homes with cats and dogs.",
      searchValue: "pet-friendly-only",
      icon: FaPaw
    },
    {
      title: "Statement Plants",
      description: "Bold focal plants.",
      searchValue: "statement",
      icon: FaLeaf
    },
    {
      title: "Succulents",
      description: "Low-fuss sunny-window plants.",
      searchValue: "succulent",
      icon: FaTint
    },
    {
      title: "Trailing Plants",
      description: "Vines for shelves and hooks.",
      searchValue: "hanging",
      icon: FaArrowRight
    }
  ];

  const storePromises = [
    "Browse by room or category",
    "Open any plant for care tips",
    "Pet safety and light needs shown clearly"
  ];

  const priceRanges = [
    { label: "All prices", value: "All" },
    { label: "Under ₹500", value: "under-500" },
    { label: "₹500 to ₹800", value: "500-800" },
    { label: "₹800 to ₹1200", value: "800-1200" },
    { label: "Above ₹1200", value: "above-1200" }
  ];

  function toggleWishlist(item) {
    const exists = wishlist.find((plant) => plant.id === item.id);
    const updatedWishlist = exists
      ? wishlist.filter((plant) => plant.id !== item.id)
      : [...wishlist, item];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  }

  function isInWishlist(id) {
    return wishlist.some((plant) => plant.id === id);
  }

  function matchesPriceRange(price) {
    if (selectedPriceRange === "All") {
      return true;
    }

    if (selectedPriceRange === "under-500") {
      return price < 500;
    }

    if (selectedPriceRange === "500-800") {
      return price >= 500 && price <= 800;
    }

    if (selectedPriceRange === "800-1200") {
      return price > 800 && price <= 1200;
    }

    return price > 1200;
  }


  async function ensureModelLoaded() {
    if (tfModel) {
      return tfModel;
    }

    setIsLoadingModel(true);
    try {
      await import("@tensorflow/tfjs");
      const mobilenet = await import("@tensorflow-models/mobilenet");
      const loadedModel = await mobilenet.load();
      setTfModel(loadedModel);
      return loadedModel;
    } catch (error) {
      console.error(error);
      setImageSearchStatus(
        "Camera recognition failed to load. Please refresh the page or try again later."
      );
      return null;
    } finally {
      setIsLoadingModel(false);
    }
  }

  async function handleStartCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setImageSearchStatus("Camera is not available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setImageSearchStatus("Camera active. Tap capture when ready.");
      await ensureModelLoaded();
    } catch (error) {
      console.error(error);
      setImageSearchStatus("Unable to access the camera. Check permissions and try again.");
      setCameraActive(false);
    }
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      const tracks = Array.from(videoRef.current.srcObject.getTracks());
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }

  function findBestPlantMatch(label) {
    const normalized = label.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();
    const terms = normalized.split(/\s+/).filter((term) => term.length >= 3);

    return plants.find((plant) => {
      const name = plant.name.toLowerCase();
      const id = plant.id.toLowerCase();
      if (name.includes(normalized) || id.includes(normalized)) {
        return true;
      }
      return terms.some((term) => name.includes(term) || id.includes(term));
    });
  }

  async function handleCapturePhoto() {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const model = await ensureModelLoaded();
    if (!model) {
      return;
    }

    setRecognizedLabel("");
    setImageSearchMatch(false);
    setImageSearchStatus("Recognizing plant from camera capture...");
    try {
      const results = await model.classify(canvas);
      if (!results || results.length === 0) {
        setRecognizedLabel("");
        setImageSearchMatch(false);
        setImageSearchStatus("No plant was recognized. Try a clearer shot.");
        return;
      }

      const topLabel = results[0].className;
      const normalizedLabel = topLabel.split(",")[0].trim();
      const matchedPlant = findBestPlantMatch(normalizedLabel);
      setRecognizedLabel(normalizedLabel);

      if (matchedPlant) {
        setImageSearchMatch(true);
        setSearch(matchedPlant.name);
        setImageSearchStatus(`Recognized “${normalizedLabel}”. Showing ${matchedPlant.name}.`);
      } else {
        setImageSearchMatch(false);
        setSearch(normalizedLabel);
        setImageSearchStatus(
          `Recognized “${normalizedLabel}”. No exact catalog match found; showing related results.`
        );
      }
    } catch (error) {
      console.error(error);
      setImageSearchStatus("Recognition failed. Please try again with better lighting.");
    }
  }

  function clearImageSearch() {
    stopCamera();
    setImageSearchStatus("");
    setRecognizedLabel("");
    setImageSearchMatch(false);
    setSearch("");
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  function resetFilters() {
    setSearch("");
    setSelectedSize("All");
    setSelectedLight("All");
    setSelectedPriceRange("All");
    setSortBy("featured");
    clearImageSearch();
  }

  const filteredPlants = useMemo(() => {
    const nextPlants = plants.filter((item) => {
      const term = search.toLowerCase();
     const matchesSearch =
     term === "pet-friendly-only"
    ? item.petSafety.toLowerCase().includes("pet safe") &&
      !item.petSafety.toLowerCase().includes("not pet safe")
    : !term ||
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.light.toLowerCase().includes(term) ||
      item.petSafety.toLowerCase().includes(term) ||
      item.difficulty.toLowerCase().includes(term) ||
      item.placement.toLowerCase().includes(term);
      const matchesSize = selectedSize === "All" || item.size === selectedSize;
      const matchesLight = selectedLight === "All" || item.light === selectedLight;
      const matchesPrice = matchesPriceRange(item.price);

      return matchesSearch && matchesSize && matchesLight && matchesPrice;
    });

    const sortedPlants = [...nextPlants];

    if (sortBy === "price-low-high") {
      sortedPlants.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      sortedPlants.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-a-z") {
      sortedPlants.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-z-a") {
      sortedPlants.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sortedPlants;
  }, [search, selectedSize, selectedLight, selectedPriceRange, sortBy]);

  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <div className="catalog-copyblock">
          <p className="catalog-eyebrow">Curated indoor greens</p>
          <h1>Leaf &amp; Bloom for calmer homes and brighter corners.</h1>
          <p className="catalog-copy">
            Leaf &amp; Bloom combines easy-care houseplants, premium gifting ideas,
            and care-first delivery into one clean shopping experience.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary"
              onClick={() => {
                const grid = document.querySelector(".catalog-section");
                if (grid) {
                  grid.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              Explore Plants
              <FaArrowRight />
            </button>

            <button
              type="button"
              className="hero-secondary"
              onClick={() => navigate("/care-guide")}
            >
              Care Guide
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{plants.length}</strong>
              <span>plants in collection</span>
            </div>
            <div>
              <strong>4.8/5</strong>
              <span>customer rating</span>
            </div>
            <div>
              <strong>24 hrs</strong>
              <span>dispatch promise</span>
            </div>
          </div>
        </div>

        <div className="catalog-visual">
          <div className="visual-main-card">
            <img {...getPlantImageProps(plants[0].image, plants[0].name, plants[0].imagePosition)} />
            <div className="visual-card-copy">
              <span>Best for living rooms</span>
              <h3>{plants[0].name}</h3>
              <p>{plants[0].description}</p>
            </div>
          </div>

          <div className="visual-side-stack">
            <div className="mini-panel">
              <FaLeaf />
              <div>
                <strong>Fresh arrivals weekly</strong>
                <span>Handpicked foliage with care tips included</span>
              </div>
            </div>
            <div className="mini-panel">
              <FaTint />
              <div>
                <strong>Low-maintenance options</strong>
                <span>Plants filtered for real homes and busy schedules</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-story-grid">
        <article className="story-panel story-panel-large">
          <p className="section-kicker">Shop by room</p>
          <h2>Choose plants the way real homes work.</h2>
          <p className="section-subcopy">
            Start with where the plant will live. We will narrow the catalog by the
            space, light, and daily routine that fit that room.
          </p>
        </article>

        {roomCollections.map((collection) => {
          const Icon = collection.icon;

          return (
            <button
              key={collection.title}
              type="button"
              className="story-panel room-panel"
              onClick={() => setSearch(collection.searchValue)}
            >
              <Icon />
              <strong>{collection.title}</strong>
              <span>{collection.copy}</span>
            </button>
          );
        })}
      </section>

      <section className="category-section">
        <div className="category-head">
          <div>
            <p className="section-kicker">Shop by category</p>
            <h2>Pick the plant style you want</h2>
          </div>
          <p className="section-subcopy">
            Categories are quick filters for mood, maintenance, and placement. Select
            one to update the collection below.
          </p>
        </div>

        <div className="category-grid">
          {browseCollections.map((collection) => {
            const Icon = collection.icon;

            return (
              <button
                key={collection.title}
                type="button"
                className="category-card"
                onClick={() => {
                 setSearch(collection.title === "Pet Friendly" ? "pet-friendly-only" : collection.searchValue);
                 setSelectedSize("All");
                 setSelectedLight("All");
                 setSelectedPriceRange("All");
}}
              >
                <Icon />
                <strong>{collection.title}</strong>
                <span>{collection.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="trust-strip">
        {storePromises.map((item) => (
          <div className="trust-pill" key={item}>
            <FaLeaf />
            <span>{item}</span>
          </div>
        ))}
      </section>

      <section className="chip-row">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="filter-chip"
            onClick={() => setSearch(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="catalog-section">
        <div className="catalog-toolbar">
          <div className="toolbar-copy">
            <p className="toolbar-label">Plant collection</p>
            <h2>{filteredPlants.length} plants ready to ship</h2>
          </div>

          <div className="toolbar-controls">
              <div className="toolbar-search">
              <input
                type="text"
                placeholder="Search plants by name, type, light, or pet safety..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="toolbar-image-card">
              <div className="toolbar-image-card-header">
                <strong>Search by camera</strong>
                <span>Use your device camera to recognize plants from a live view.</span>
              </div>

              <div className="camera-actions">
                <button
                  type="button"
                  className="camera-button"
                  onClick={cameraActive ? stopCamera : handleStartCamera}
                >
                  {cameraActive ? "Stop camera" : "Use camera to scan"}
                </button>
                {cameraActive && (
                  <button
                    type="button"
                    className="camera-button"
                    onClick={handleCapturePhoto}
                    disabled={isLoadingModel}
                  >
                    {isLoadingModel ? "Loading model..." : "Capture and recognize"}
                  </button>
                )}
              </div>

              {cameraActive && (
                <div className="camera-preview">
                  <video ref={videoRef} autoPlay playsInline muted />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              )}

              {imageSearchStatus && <p className="image-search-status">{imageSearchStatus}</p>}

              {recognizedLabel && (
                <div className={`image-search-result ${imageSearchMatch ? "match" : "no-match"}`}>
                  <strong>Predicted:</strong>
                  <span>{recognizedLabel}</span>
                  {!imageSearchMatch && (
                    <span>No exact catalog match found for this image.</span>
                  )}
                </div>
              )}
            </div>

            <div className="toolbar-filters">
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size === "All" ? "All sizes" : size}
                  </option>
                ))}
              </select>

              <select value={selectedLight} onChange={(e) => setSelectedLight(e.target.value)}>
                {lightLevels.map((light) => (
                  <option key={light} value={light}>
                    {light === "All" ? "All light levels" : light}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>

              <button type="button" className="clear-filters" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="catalog-results-head">
          <p className="toolbar-label">Showing now</p>
          <span>{getSortLabel(sortBy)}</span>
        </div>

        {filteredPlants.length === 0 && <h2 className="empty-results">No plants found</h2>}

        <div className="product-grid">
          {filteredPlants.map((item) => (
            <div key={item.id} onMouseEnter={() => setActivePlant(item)}>
              <PlantCard
                plant={item}
                isWishlisted={isInWishlist(item.id)}
                onToggleWishlist={toggleWishlist}
                onOpenDetails={(selectedPlant) => {
                  setActivePlant(selectedPlant);
                  navigate(`/plants/${selectedPlant.id}`);
                }}
                onBuyNow={(selectedPlant) => {
                  setActivePlant(selectedPlant);
                  navigate("/checkout", { state: selectedPlant });
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Plants;
