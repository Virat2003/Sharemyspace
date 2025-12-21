import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);
    try {
      // API endpoint: POST http://localhost:3001/contact
      const res = await axios.post('http://localhost:3001/contact', { name, email, message });
      setSuccessMsg(res.data?.message || 'Message sent successfully. We will get back to you soon.');
      setPreviewUrl(res.data?.preview || '');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send message. Please try again later.';
      setErrorMsg(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-container">
        
        {/* Heading */}
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            Have questions or want to list your space? We’d love to hear from you.
          </p>
        </div>

        <div className="contact-content">
          
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              ShareMySpace helps people rent and share unused spaces easily.
              Reach out to us for support, partnerships, or general queries.
            </p>

            <div className="info-item">
              <strong>📍 Address:</strong> India
            </div>
            <div className="info-item">
              <strong>📧 Email:</strong> sharemyspace@support.com
            </div>
            <div className="info-item">
              <strong>📞 Phone:</strong> +91 98765 43210
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>

            {successMsg && <p className="form-success">{successMsg}</p>}
            {previewUrl && (
              <p className="form-preview">Preview: <a href={previewUrl} target="_blank" rel="noreferrer">view message</a></p>
            )}
            {errorMsg && <p className="form-error">{typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}</p>}
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;
