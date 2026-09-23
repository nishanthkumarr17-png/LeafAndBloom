import React, { useMemo, useState } from "react";
import { FaHeart, FaPaperPlane, FaSeedling, FaUsers } from "react-icons/fa";
import communitySeedPosts from "./communitySeedData.js";
import CommunityPostCard from "./components/CommunityPostCard.jsx";

const COMMUNITY_STORAGE_KEY = "plantnest-community-posts";

function readCommunityPosts() {
  try {
    const saved = JSON.parse(localStorage.getItem(COMMUNITY_STORAGE_KEY));
    return Array.isArray(saved) && saved.length > 0 ? saved : communitySeedPosts;
  } catch {
    localStorage.removeItem(COMMUNITY_STORAGE_KEY);
    return communitySeedPosts;
  }
}

function formatPostTime(value) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date(value));
  } catch {
    return "Recently";
  }
}

function Community() {
  const [posts, setPosts] = useState(readCommunityPosts);
  const [form, setForm] = useState({
    plantName: "",
    mood: "Happy",
    location: "",
    caption: "",
    image: ""
  });

  const author = localStorage.getItem("username") || "Plant Friend";

  const communityStats = useMemo(() => {
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const imagePosts = posts.filter((post) => post.image).length;

    return {
      members: "1.2k+",
      stories: posts.length,
      likes: totalLikes,
      imagePosts: imagePosts
    };
  }, [posts]);

  const formattedPosts = useMemo(
    () =>
      posts.map((post) => ({
        ...post,
        formattedDate: formatPostTime(post.createdAt)
      })),
    [posts]
  );

  function updatePosts(nextPosts) {
    setPosts(nextPosts);
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(nextPosts));
  }

  function handleChange(e) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: typeof reader.result === "string" ? reader.result : ""
      }));
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setForm((current) => ({
      ...current,
      image: ""
    }));
  }

  function handleShare() {
    if (form.caption.trim() === "") {
      alert("Write a short update before sharing.");
      return;
    }

    const nextPost = {
      id: `post-${Date.now()}`,
      author,
      location: form.location.trim() || "PlantNest Community",
      plantName: form.plantName.trim() || "My Plant Journey",
      mood: form.mood,
      caption: form.caption.trim(),
      image: form.image,
      likes: 0,
      comments: 0,
      tags: [form.mood, form.plantName.trim() || "Plant update"],
      createdAt: new Date().toISOString()
    };

    updatePosts([nextPost, ...posts]);
    setForm({
      plantName: "",
      mood: "Happy",
      location: "",
      caption: "",
      image: ""
    });
  }

  function handleLike(id) {
    const nextPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    updatePosts(nextPosts);
  }

  return (
    <div className="page-shell community-page">
      <section className="community-hero">
        <div className="community-copy">
          <p className="section-kicker">PlantNest community</p>
          <h1>A place for plant lovers to grow together.</h1>
          <p className="section-subcopy">
            Share your plant journey, celebrate new leaves, talk about setbacks,
            and enjoy the small joys that come with growing something green.
          </p>
        </div>

        <div className="community-stat-grid">
          <div className="community-stat-card">
            <FaUsers />
            <strong>{communityStats.members}</strong>
            <span>plant lovers here</span>
          </div>
          <div className="community-stat-card">
            <FaSeedling />
            <strong>{communityStats.stories}</strong>
            <span>stories shared</span>
          </div>
          <div className="community-stat-card">
            <FaHeart />
            <strong>{communityStats.likes}</strong>
            <span>likes given</span>
          </div>
          <div className="community-stat-card">
            <FaPaperPlane />
            <strong>{communityStats.imagePosts}</strong>
            <span>posts with images</span>
          </div>
        </div>
      </section>

      <section className="community-layout">
        <div className="community-composer">
          <div className="composer-header">
            <div>
              <p className="section-kicker">Share your joy</p>
              <h2>Post an update</h2>
            </div>
            <span className="composer-avatar">{author.slice(0, 1).toUpperCase()}</span>
          </div>

          <div className="composer-grid">
            <div className="form-group">
              <label>Plant Name</label>
              <input
                name="plantName"
                placeholder="Ex: Monstera Deliciosa"
                value={form.plantName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mood</label>
              <select name="mood" value={form.mood} onChange={handleChange}>
                <option>Happy</option>
                <option>Proud</option>
                <option>Grateful</option>
                <option>Relieved</option>
                <option>Hopeful</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              placeholder="Ex: Hyderabad"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Your Story</label>
            <textarea
              name="caption"
              placeholder="Tell the community what happened, what you learned, or what made you smile."
              rows={5}
              value={form.caption}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Add a Plant Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {form.image && (
              <div className="community-image-preview">
                <img src={form.image} alt="Selected community upload" />
                <button type="button" className="clear-upload-btn" onClick={clearImage}>
                  Remove image
                </button>
              </div>
            )}
          </div>

          <button type="button" className="community-submit" onClick={handleShare}>
            <FaPaperPlane />
            Share with Community
          </button>
        </div>

        <div className="community-feed">
          {formattedPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Community;
