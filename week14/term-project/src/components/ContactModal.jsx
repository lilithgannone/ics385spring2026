import React, { useState } from "react";

function ContactModal({ buttonLabel, buttonClassName = "contact-modal-trigger" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openModal() {
    setIsOpen(true);
    setStatus("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/properties/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: guestName,
          email,
          message
        })
      });

      if (!response.ok) {
        throw new Error("Unable to send message.");
      }

      setGuestName("");
      setEmail("");
      setMessage("");
      setStatus("Your message has been sent to Lava Birds B&B. We will get back to you within 24 hours. Thank you!");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" className={buttonClassName} onClick={openModal}>
        {buttonLabel}
      </button>

      {isOpen ? (
        <div className="contact-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
          <div className="contact-modal">
            <button
              type="button"
              className="contact-modal-close"
              onClick={closeModal}
              aria-label="Close contact form"
            >
              ×
            </button>

            <p className="contact-modal-eyebrow">Lava Birds B&B</p>
            <h3 id="contact-modal-title">Contact Us</h3>

            <form className="contact-modal-form" onSubmit={handleSubmit}>
              <label className="contact-modal-field">
                <span>Name</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label className="contact-modal-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </label>

              <label className="contact-modal-field">
                <span>Message</span>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Please enter your message or request a booking here."
                  required
                />
              </label>

              <button type="submit" className="contact-modal-submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {status ? (
                <p className="contact-modal-status" role="status">
                  {status}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ContactModal;
