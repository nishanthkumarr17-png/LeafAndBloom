import React, { useEffect, useMemo, useState } from "react";
import { FaLeaf, FaStar } from "react-icons/fa";

function readReviews(storageKey) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : [];
  } catch {
    localStorage.removeItem(storageKey);
    return [];
  }
}

function ReviewSection({ plantId, plantName }) {
  const storageKey = `plantnest-reviews-${plantId}`;
  const username = localStorage.getItem("username") || "Plant Friend";
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    author: username,
    rating: 5,
    note: ""
  });

  useEffect(() => {
    setReviews(readReviews(storageKey));
  }, [storageKey]);

  const summary = useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, total: 0 };
    }

    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return {
      average: (total / reviews.length).toFixed(1),
      total: reviews.length
    };
  }, [reviews]);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit() {
    if (form.note.trim() === "") {
      alert("Write a short review before sharing.");
      return;
    }

    const nextReview = {
      id: `review-${Date.now()}`,
      author: form.author.trim() || "Plant Friend",
      rating: Number(form.rating),
      note: form.note.trim(),
      createdAt: new Date().toISOString()
    };

    const nextReviews = [nextReview, ...reviews];
    setReviews(nextReviews);
    localStorage.setItem(storageKey, JSON.stringify(nextReviews));
    setForm((current) => ({
      ...current,
      note: "",
      rating: 5
    }));
  }

  return (
    <section className="detail-section reviews-section">
      <div className="detail-section-head">
        <div>
          <p className="section-kicker">Plant reviews</p>
          <h2>What plant parents are saying</h2>
        </div>
        <div className="review-summary">
          <strong>{summary.total === 0 ? "New" : `${summary.average}/5`}</strong>
          <span>{summary.total === 0 ? `Be the first to review ${plantName}` : `${summary.total} reviews`}</span>
        </div>
      </div>

      <div className="reviews-layout">
        <div className="review-composer">
          <div className="form-group">
            <label>Your Name</label>
            <input name="author" value={form.author} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <select name="rating" value={form.rating} onChange={handleChange}>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              name="note"
              rows={5}
              placeholder={`Share how ${plantName} is doing in your space.`}
              value={form.note}
              onChange={handleChange}
            />
          </div>

          <button type="button" className="community-submit" onClick={handleSubmit}>
            <FaLeaf />
            Share Review
          </button>
        </div>

        <div className="review-list">
          {reviews.length === 0 ? (
            <div className="review-card review-card-empty">
              <h3>No reviews yet</h3>
              <p>This plant is waiting for its first home story.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-top">
                  <div>
                    <strong>{review.author}</strong>
                    <div className="review-stars">
                      {Array.from({ length: Number(review.rating) }).map((_, index) => (
                        <FaStar key={`${review.id}-${index}`} />
                      ))}
                    </div>
                  </div>
                  <small>{new Date(review.createdAt).toLocaleDateString("en-IN")}</small>
                </div>
                <p>{review.note}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewSection;
