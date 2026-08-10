import { useEffect, useState } from "react";
import api from "./api";
import "./index.css";

function App() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [selectedContent, setSelectedContent] = useState(null);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    loadContents();
  }, []);

  async function loadContents() {
    try {
      const response = await api.get("/content");
      setContents(response.data);
    } catch (err) {
      setError("Unable to load movies and webseries.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openLogin() {
    setAuthMode("login");
    setShowAuth(true);
    setAuthMessage("");
    setAuthError("");
    setName("");
    setEmail("");
    setPassword("");
  }

  function openRegister() {
    setAuthMode("register");
    setShowAuth(true);
    setAuthMessage("");
    setAuthError("");
    setName("");
    setEmail("");
    setPassword("");
  }

  function closeAuth() {
    setShowAuth(false);
    setAuthMessage("");
    setAuthError("");
  }

  async function handleAuth(event) {
    event.preventDefault();

    setAuthMessage("");
    setAuthError("");

    try {
      if (authMode === "register") {
        const response = await api.post(
          "/auth/register",
          {
            name,
            email,
            password,
          }
        );

        setAuthMessage(
          response.data?.message ||
            "Registration successful. Please login."
        );

        setAuthMode("login");
        setName("");
        setPassword("");

        return;
      }

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const accessToken =
        response.data.access_token;

      localStorage.setItem(
        "access_token",
        accessToken
      );

      setToken(accessToken);

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setUser(response.data.user);
      }

      setAuthMessage("Login successful!");

      setTimeout(() => {
        setShowAuth(false);
        setAuthMessage("");
      }, 700);
    } catch (err) {
      console.error("AUTH ERROR:", err);

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setAuthError(detail);
      } else {
        setAuthError(
          authMode === "login"
            ? "Invalid email or password."
            : "Registration failed."
        );
      }
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    setSelectedContent(null);
    setRating(0);
    setReviewText("");
  }

  async function openReviewPanel(content) {
    setSelectedContent(content);
    setRating(0);
    setReviewText("");
    setReviewMessage("");
    setReviewError("");

    try {
      const [ratingsResponse, reviewsResponse] =
        await Promise.all([
          api.get(`/ratings/${content.id}`),
          api.get(`/reviews/${content.id}`),
        ]);

      setRatings(ratingsResponse.data);
      setReviews(reviewsResponse.data);
    } catch (err) {
      console.error(
        "Unable to load ratings/reviews:",
        err
      );

      setRatings([]);
      setReviews([]);
    }
  }

  function closeReviewPanel() {
    setSelectedContent(null);
    setRating(0);
    setReviewText("");
    setRatings([]);
    setReviews([]);
    setReviewMessage("");
    setReviewError("");
  }

  async function submitRating() {
    if (!token) {
      setReviewError("Please login to give a rating.");
      openLogin();
      return;
    }

    if (!selectedContent) {
      return;
    }

    if (rating < 1 || rating > 5) {
      setReviewError("Please select a rating from 1 to 5.");
      return;
    }

    setReviewMessage("");
    setReviewError("");

    try {
      await api.post(
        "/ratings",
        {
          content_id: selectedContent.id,
          rating: Number(rating),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewMessage("Rating submitted successfully.");

      const response = await api.get(
        `/ratings/${selectedContent.id}`
      );

      setRatings(response.data);
    } catch (err) {
      console.error("RATING ERROR:", err);

      if (err.response?.status === 401) {
        setReviewError(
          "Your login session has expired. Please login again."
        );
      } else {
        setReviewError(
          err.response?.data?.detail ||
            "Unable to submit rating."
        );
      }
    }
  }

  async function submitReview(event) {
    event.preventDefault();

    if (!token) {
      setReviewError("Please login to write a review.");
      openLogin();
      return;
    }

    if (!selectedContent) {
      return;
    }

    if (!reviewText.trim()) {
      setReviewError("Please write a review.");
      return;
    }

    setReviewLoading(true);
    setReviewMessage("");
    setReviewError("");

    try {
      await api.post(
        "/reviews",
        {
          content_id: selectedContent.id,
          review_text: reviewText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewMessage("Review submitted successfully.");
      setReviewText("");

      const response = await api.get(
        `/reviews/${selectedContent.id}`
      );

      setReviews(response.data);
    } catch (err) {
      console.error("REVIEW ERROR:", err);

      if (err.response?.status === 401) {
        setReviewError(
          "Your login session has expired. Please login again."
        );
      } else {
        setReviewError(
          err.response?.data?.detail ||
            "Unable to submit review."
        );
      }
    } finally {
      setReviewLoading(false);
    }
  }

  function calculateAverageRating() {
    if (ratings.length === 0) {
      return "No ratings yet";
    }

    const total = ratings.reduce(
      (sum, item) =>
        sum + Number(item.rating),
      0
    );

    return (
      total / ratings.length
    ).toFixed(1);
  }

  return (
    <div className="app">

      <header className="navbar">
        <div className="logo">
          CineScope
        </div>

        <nav>
          <a href="#home">
            Home
          </a>

          <a href="#movies">
            Movies
          </a>

          <a href="#webseries">
            Webseries
          </a>

          {token ? (
            <>
              <span className="welcome-user">
                {user?.name || "User"}
              </span>

              <button
                className="login-button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-button"
                onClick={openLogin}
              >
                Login
              </button>

              <button
                className="register-button"
                onClick={openRegister}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <main>

        <section
          className="hero"
          id="home"
        >
          <div className="hero-content">

            <p className="hero-label">
              MOVIES • WEBSERIES • REVIEWS
            </p>

            <h1>
              Discover.
              <br />
              Rate. Review.
            </h1>

            <p className="hero-description">
              Explore movies and webseries,
              share your ratings, and discover
              what other viewers think.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("movies")
                  .scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Content
            </button>

          </div>
        </section>

        <section
          className="content-section"
          id="movies"
        >

          <div className="section-heading">

            <div>
              <p className="section-label">
                EXPLORE
              </p>

              <h2>
                Movies & Webseries
              </h2>
            </div>

            <span>
              {contents.length} titles
            </span>

          </div>

          {loading && (
            <div className="message">
              Loading content...
            </div>
          )}

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            contents.length === 0 && (
              <div className="message">
                No movies or webseries
                available yet.
              </div>
            )}

          {!loading &&
            !error &&
            contents.length > 0 && (

            <div className="content-grid">

              {contents.map((content) => (

                <article
                  className="content-card"
                  key={content.id}
                >

                  <div className="poster">

                    {content.poster_url ? (

                      <img
                        src={content.poster_url}
                        alt={content.title}
                      />

                    ) : (

                      <div className="poster-placeholder">
                        {content.content_type}
                      </div>

                    )}

                  </div>

                  <div className="card-content">

                    <span className="content-type">
                      {content.content_type}
                    </span>

                    <h3>
                      {content.title}
                    </h3>

                    <p>
                      {content.description ||
                        "No description available."}
                    </p>

                    {content.release_date && (
                      <span className="release-date">
                        {content.release_date}
                      </span>
                    )}

                    <button
                      className="review-button"
                      onClick={() =>
                        openReviewPanel(content)
                      }
                    >
                      Rate & Review
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      <footer>
        <p>
          © 2026 CineScope — Movies & Webseries
          Review Platform
        </p>
      </footer>

      {showAuth && (

        <div
          className="auth-overlay"
          onClick={closeAuth}
        >

          <div
            className="auth-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="close-button"
              onClick={closeAuth}
            >
              ×
            </button>

            <div className="auth-header">

              <p className="section-label">
                CINE SCOPE
              </p>

              <h2>
                {authMode === "login"
                  ? "Welcome Back"
                  : "Create Account"}
              </h2>

              <p>
                {authMode === "login"
                  ? "Login to continue."
                  : "Join CineScope and start reviewing."}
              </p>

            </div>

            <form
              className="auth-form"
              onSubmit={handleAuth}
            >

              {authMode === "register" && (

                <div className="form-group">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Enter your name"
                    required
                  />

                </div>

              )}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                />

              </div>

              {authError && (
                <div className="auth-error">
                  {authError}
                </div>
              )}

              {authMessage && (
                <div className="auth-success">
                  {authMessage}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit"
              >
                {authMode === "login"
                  ? "Login"
                  : "Create Account"}
              </button>

            </form>

            <div className="auth-switch">

              {authMode === "login" ? (
                <>
                  Don't have an account?

                  <button
                    onClick={openRegister}
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?

                  <button
                    onClick={openLogin}
                  >
                    Login
                  </button>
                </>
              )}

            </div>

          </div>

        </div>

      )}

      {selectedContent && (

        <div
          className="auth-overlay"
          onClick={closeReviewPanel}
        >

          <div
            className="review-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="close-button"
              onClick={closeReviewPanel}
            >
              ×
            </button>

            <p className="section-label">
              REVIEW
            </p>

            <h2>
              {selectedContent.title}
            </h2>

            <div className="rating-summary">

              <strong>
                {calculateAverageRating()}
              </strong>

              <span>
                {ratings.length} rating
                {ratings.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="rating-form">

              <h3>
                Give your rating
              </h3>

              <div className="stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      className={
                        star <= rating
                          ? "star active"
                          : "star"
                      }
                      onClick={() =>
                        setRating(star)
                      }
                    >
                      ★
                    </button>

                  )
                )}

              </div>

              <button
                className="auth-submit"
                onClick={submitRating}
              >
                Submit Rating
              </button>

            </div>

            <form
              className="review-form"
              onSubmit={submitReview}
            >

              <h3>
                Write a review
              </h3>

              <textarea
                value={reviewText}
                onChange={(event) =>
                  setReviewText(
                    event.target.value
                  )
                }
                placeholder="Share your thoughts about this movie or webseries..."
                maxLength={5000}
                rows={5}
              />

              <button
                type="submit"
                className="auth-submit"
                disabled={reviewLoading}
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </form>

            {reviewError && (
              <div className="auth-error">
                {reviewError}
              </div>
            )}

            {reviewMessage && (
              <div className="auth-success">
                {reviewMessage}
              </div>
            )}

            <div className="existing-reviews">

              <h3>
                User Reviews
              </h3>

              {reviews.length === 0 ? (

                <p className="no-reviews">
                  No reviews yet. Be the first
                  to review!
                </p>

              ) : (

                reviews.map((review) => (

                  <div
                    className="review-item"
                    key={review.id}
                  >

                    <div className="review-item-header">

                      <strong>
                        User #{review.user_id}
                      </strong>

                      <span>
                        {review.status}
                      </span>

                    </div>

                    <p>
                      {review.review_text}
                    </p>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;