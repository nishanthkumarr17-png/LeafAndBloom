import React from "react";
import { FaHeart, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import { getPlantImageProps } from "../plantImageUtils.js";

function CommunityPostCard({ post, onLike }) {
  return (
    <article className="community-post">
      <div className="post-top">
        <div className="post-identity">
          <span className="post-avatar">{post.author.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{post.author}</strong>
            <div className="post-meta-line">
              <span><FaMapMarkerAlt /> {post.location}</span>
              <span><FaLeaf /> {post.plantName}</span>
            </div>
          </div>
        </div>

        <div className="post-side-meta">
          <span className="post-mood">{post.mood}</span>
          <small>{post.formattedDate}</small>
        </div>
      </div>

      <p className="post-caption">{post.caption}</p>

      {post.image && (
        <div className="community-post-image">
          <img {...getPlantImageProps(post.image, post.plantName || "Community plant")} />
        </div>
      )}

      <div className="post-tags">
        {post.tags.map((tag) => (
          <span key={`${post.id}-${tag}`}>#{tag}</span>
        ))}
      </div>

      <div className="post-actions">
        <button type="button" className="post-like" onClick={() => onLike(post.id)}>
          <FaHeart />
          {post.likes} likes
        </button>
        <span>{post.comments} comments</span>
      </div>
    </article>
  );
}

export default CommunityPostCard;
