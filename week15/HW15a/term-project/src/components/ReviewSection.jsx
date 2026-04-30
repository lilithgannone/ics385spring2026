import React, { useState } from "react";


function containsLink(text) {
  return /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|io|co|edu))/i.test(text);
}

function ReviewSection({ property, onReviewAdded }) {
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");

    if (containsLink(guestName) || containsLink(comment)) {
        setStatus("Links are not allowed in reviews.");
        return;
    }

    setIsSubmitting(true);

    try {
        const response = await fetch("/properties/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guestName,
          rating: Number(rating),
          comment
        })
      });

      if (!response.ok) {
        throw new Error("Unable to submit review.");
      }

      setGuestName("");
      setRating("5");
      setComment("");
      setStatus("Thanks for sharing your review.");
      await onReviewAdded();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const reviews = property.reviews || [];
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section id="reviews" className="review-section">
      <div className="review-summary-card">
        <p className="review-eyebrow">Guest Reviews</p>
        <h2>Share Your Lava Birds B&B experience</h2>
        <p className="review-summary-text">
          Tell us about your stay at Lava Birds B&B. Your feedback helps future guests and allows us to continually improve our offerings. We appreciate you taking the time to share your thoughts!
        </p>

        <div className="review-stats" aria-label="Guest review summary">
          <div className="review-stat">
            <span className="review-stat-label">Average Rating</span>
            <strong>{averageRating}</strong>
          </div>
          <div className="review-stat">
            <span className="review-stat-label">Review Count</span>
            <strong>{reviews.length}</strong>
          </div>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>
          <div className="review-form-grid">
            <label className="review-field">
              <span>Enter Your Name</span>
              <input
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </label>

            <label className="review-field">
              <span>Rating</span>
              <select
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                required
              >
                <option value="5">5</option>
                <option value="4.5">4.5</option>
                <option value="4">4</option>
                <option value="3.5">3.5</option>
                <option value="3">3</option>
                <option value="2.5">2.5</option>
                <option value="2">2</option>
                <option value="1.5">1.5</option>
                <option value="1">1</option>
              </select>
            </label>
          </div>

          <label className="review-field">
            <span>Comment</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows="4"
              placeholder="Tell future guests about your experience at Lava Birds B&B."
            />
          </label>

          <button type="submit" className="review-submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Post Review"}
          </button>

          {status ? (
            <p className="review-status" role="status">
              {status}
            </p>
          ) : null}
        </form>
      </div>

      <div className="review-list-card">
        <h3>Recent Guest Feedback</h3>

        {reviews.length ? (
          <ul className="review-list">
            {reviews.slice().reverse().slice(0, 5).map((review, index) => (
              <li className="review-item" key={`${review.guestName}-${review.date || index}`}>
                <div className="review-item-header">
                  <strong>{review.guestName}</strong>
                  <span>{Number(review.rating || 0).toFixed(1)} / 5</span>
                </div>
                <p>{review.comment || "Guest left a rating without a written comment."}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="review-empty">No guest reviews have been posted yet.</p>
        )}
      </div>
    </section>
  );
}

export default ReviewSection;
