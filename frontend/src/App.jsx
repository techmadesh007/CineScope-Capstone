import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const [user, setUser] = useState(null);

  const [selectedContent, setSelectedContent] = useState(null);

  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    loadContents();

    const savedUser = localStorage.getItem("cinescope_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("cinescope_user");
      }
    }
  }, []);

  async function loadContents() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/content");

      setContents(response.data);
    } catch (err) {
      console.error("Content loading error:", err);
      setError("Unable to load movies and webseries.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToMovies() {
    const section = document.getElementById("movies");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  function openLogin() {
    setLoginError("");
    setEmail("");
    setPassword("");

    setShowSignup(false);
    setShowLogin(true);
  }

  function closeLogin() {
    if (!loginLoading) {
      setShowLogin(false);
      setLoginError("");
    }
  }

  function openSignup() {
    setSignupError("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");

    setShowLogin(false);
    setShowSignup(true);
  }

  function closeSignup() {
    if (!signupLoading) {
      setShowSignup(false);
      setSignupError("");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    setLoginError("");

    if (!email.trim() || !password.trim()) {
      setLoginError("Please enter your email and password.");
      return;
    }

    try {
      setLoginLoading(true);

      const response = await api.post("/api/auth/login", {
        email: email.trim(),
        password: password,
      });

      const data = response.data;

      if (data.access_token) {
        localStorage.setItem(
          "cinescope_token",
          data.access_token
        );
      }

      const loggedInUser = {
        ...(data.user || {}),
        email: email.trim(),
      };

      localStorage.setItem(
        "cinescope_user",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);

      setShowLogin(false);
      setEmail("");
      setPassword("");
      setLoginError("");

      alert("Login successful!");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          setLoginError("Invalid email or password.");
        } else if (err.response.data?.detail) {
          setLoginError(err.response.data.detail);
        } else {
          setLoginError("Login failed. Please try again.");
        }
      } else {
        setLoginError("Unable to connect to the server.");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(event) {
    event.preventDefault();

    setSignupError("");

    if (!signupName.trim()) {
      setSignupError("Please enter your name.");
      return;
    }

    if (!signupEmail.trim()) {
      setSignupError("Please enter your email.");
      return;
    }

    if (signupPassword.length < 8) {
      setSignupError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (signupPassword.length > 72) {
      setSignupError(
        "Password cannot contain more than 72 characters."
      );
      return;
    }

    try {
      setSignupLoading(true);

      await api.post("/api/auth/register", {
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });

      setShowSignup(false);

      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupError("");

      setEmail(signupEmail.trim());

      setShowLogin(true);

      alert(
        "Account created successfully! Please login."
      );
    } catch (err) {
      console.error("Signup error:", err);

      if (err.response) {
        if (err.response.status === 400) {
          setSignupError(
            err.response.data?.detail ||
              "Email already registered."
          );
        } else if (err.response.data?.detail) {
          setSignupError(
            err.response.data.detail
          );
        } else {
          setSignupError(
            "Registration failed. Please try again."
          );
        }
      } else {
        setSignupError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setSignupLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("cinescope_token");
    localStorage.removeItem("cinescope_user");

    setUser(null);

    alert("Logged out successfully.");
  }

  async function openContent(content) {
    setSelectedContent(content);
    setRatings([]);
    setReviews([]);
    setReviewText("");
    setSelectedRating(5);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const [ratingsResponse, reviewsResponse] =
        await Promise.all([
          api.get(`/api/ratings/${content.id}`),
          api.get(`/api/reviews/${content.id}`),
        ]);

      setRatings(ratingsResponse.data);
      setReviews(reviewsResponse.data);
    } catch (err) {
      console.error("Details loading error:", err);

      setDetailsError(
        "Unable to load ratings or reviews."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeContent() {
    setSelectedContent(null);
    setRatings([]);
    setReviews([]);
    setReviewText("");
    setDetailsError("");
  }

  function calculateAverageRating() {
    if (ratings.length === 0) {
      return "No ratings";
    }

    const total = ratings.reduce(
      (sum, item) => sum + Number(item.rating),
      0
    );

    return (total / ratings.length).toFixed(1);
  }

  async function submitRating() {
    if (!user) {
      closeContent();
      openLogin();
      return;
    }

    if (!selectedContent) {
      return;
    }

    try {
      setRatingLoading(true);

      const token = localStorage.getItem(
        "cinescope_token"
      );

      const response = await api.post(
        "/api/ratings",
        {
          content_id: selectedContent.id,
          rating: Number(selectedRating),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRatings((current) => {
        const existing = current.find(
          (item) =>
            item.user_id === response.data.user_id
        );

        if (existing) {
          return current.map((item) =>
            item.id === existing.id
              ? response.data
              : item
          );
        }

        return [...current, response.data];
      });

      alert("Rating submitted successfully!");
    } catch (err) {
      console.error("Rating error:", err);

      if (err.response?.status === 401) {
        alert("Please login again.");
        handleLogout();
      } else if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Unable to submit rating.");
      }
    } finally {
      setRatingLoading(false);
    }
  }

  async function submitReview(event) {
    event.preventDefault();

    if (!user) {
      closeContent();
      openLogin();
      return;
    }

    if (!selectedContent) {
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write a review.");
      return;
    }

    try {
      setReviewLoading(true);

      const token = localStorage.getItem(
        "cinescope_token"
      );

      const response = await api.post(
        "/api/reviews",
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

      setReviews((current) => [
        response.data,
        ...current,
      ]);

      setReviewText("");

      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Review error:", err);

      if (err.response?.status === 401) {
        alert("Please login again.");
        handleLogout();
      } else if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Unable to submit review.");
      }
    } finally {
      setReviewLoading(false);
    }
  }

  return (
    <div className="app">

      {/* NAVBAR */}

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

          {user ? (
            <>
              <span
                style={{
                  color: "#aaaab3",
                  fontSize: "14px",
                }}
              >
                {user.name || user.email}
              </span>

              <button
                className="login-button"
                onClick={handleLogout}
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
                className="login-button"
                onClick={openSignup}
              >
                Sign Up
              </button>
            </>
          )}

        </nav>

      </header>


      {/* MAIN */}

      <main>

        {/* HERO */}

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
              Explore movies and webseries, share
              your ratings, and discover what other
              viewers think.
            </p>

            <button
              className="primary-button"
              onClick={scrollToMovies}
            >
              Explore Content
            </button>

          </div>

        </section>


        {/* CONTENT */}

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


          {!loading && error && (
            <div className="message error">

              {error}

              <button
                className="retry-button"
                onClick={loadContents}
              >
                Retry
              </button>

            </div>
          )}


          {!loading &&
            !error &&
            contents.length === 0 && (
              <div className="message">
                No movies or webseries available yet.
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
                    onClick={() => openContent(content)}
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    <div className="poster">

                      {content.poster_url ? (

                        <img
                          src={content.poster_url}
                          alt={content.title}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
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
                          Release:{" "}
                          {content.release_date}
                        </span>
                      )}

                      {content.duration_minutes && (
                        <span className="release-date">
                          Duration:{" "}
                          {content.duration_minutes}
                          {" "}minutes
                        </span>
                      )}

                      <div
                        style={{
                          marginTop: "15px",
                          color: "#ffffff",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        View details →
                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

        </section>

      </main>


      {/* FOOTER */}

      <footer>

        <p>
          © 2026 CineScope — Movies & Webseries
          Review Platform
        </p>

      </footer>


      {/* LOGIN MODAL */}

      {showLogin && (

        <div
          className="login-overlay"
          onClick={(event) => {

            if (
              event.target === event.currentTarget
            ) {
              closeLogin();
            }

          }}
        >

          <div className="login-modal">

            <button
              className="login-close"
              onClick={closeLogin}
              disabled={loginLoading}
            >
              ×
            </button>

            <div className="login-brand">
              CINESCOPE
            </div>

            <h2>
              Welcome Back
            </h2>

            <p className="login-description">
              Login to rate movies and write reviews.
            </p>


            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}


            <form
              className="login-form"
              onSubmit={handleLogin}
            >

              <div className="login-field">

                <label htmlFor="login-email">
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loginLoading}
                />

              </div>


              <div className="login-field">

                <label htmlFor="login-password">
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loginLoading}
                />

              </div>


              <button
                type="submit"
                className="login-submit"
                disabled={loginLoading}
              >
                {loginLoading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>


            <p
              style={{
                textAlign: "center",
                color: "#777783",
                marginTop: "20px",
                fontSize: "14px",
              }}
            >
              Don't have an account?{" "}

              <button
                type="button"
                onClick={openSignup}
                style={{
                  border: "none",
                  background: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                  padding: 0,
                }}
              >
                Sign Up
              </button>

            </p>

          </div>

        </div>

      )}


      {/* SIGNUP MODAL */}

      {showSignup && (

        <div
          className="login-overlay"
          onClick={(event) => {

            if (
              event.target === event.currentTarget
            ) {
              closeSignup();
            }

          }}
        >

          <div className="login-modal">

            <button
              className="login-close"
              onClick={closeSignup}
              disabled={signupLoading}
            >
              ×
            </button>


            <div className="login-brand">
              CINESCOPE
            </div>


            <h2>
              Create Account
            </h2>

            <p className="login-description">
              Join CineScope and start rating and
              reviewing your favorite content.
            </p>


            {signupError && (
              <div className="login-error">
                {signupError}
              </div>
            )}


            <form
              className="login-form"
              onSubmit={handleSignup}
            >

              <div className="login-field">

                <label htmlFor="signup-name">
                  Name
                </label>

                <input
                  id="signup-name"
                  type="text"
                  value={signupName}
                  onChange={(event) =>
                    setSignupName(event.target.value)
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={signupLoading}
                />

              </div>


              <div className="login-field">

                <label htmlFor="signup-email">
                  Email
                </label>

                <input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(event) =>
                    setSignupEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={signupLoading}
                />

              </div>


              <div className="login-field">

                <label htmlFor="signup-password">
                  Password
                </label>

                <input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(event) =>
                    setSignupPassword(
                      event.target.value
                    )
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  disabled={signupLoading}
                />

              </div>


              <button
                type="submit"
                className="login-submit"
                disabled={signupLoading}
              >
                {signupLoading
                  ? "Creating account..."
                  : "Create Account"}
              </button>

            </form>


            <p
              style={{
                textAlign: "center",
                color: "#777783",
                marginTop: "20px",
                fontSize: "14px",
              }}
            >
              Already have an account?{" "}

              <button
                type="button"
                onClick={openLogin}
                style={{
                  border: "none",
                  background: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                  padding: 0,
                }}
              >
                Login
              </button>

            </p>

          </div>

        </div>

      )}


      {/* MOVIE DETAILS MODAL */}

      {selectedContent && (

        <div
          className="login-overlay"
          onClick={(event) => {

            if (
              event.target === event.currentTarget
            ) {
              closeContent();
            }

          }}
        >

          <div
            className="login-modal"
            style={{
              maxWidth: "850px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >

            <button
              className="login-close"
              onClick={closeContent}
            >
              ×
            </button>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "220px 1fr",
                gap: "30px",
                marginBottom: "30px",
              }}
            >

              <div
                style={{
                  height: "320px",
                  background: "#202028",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >

                {selectedContent.poster_url ? (

                  <img
                    src={selectedContent.poster_url}
                    alt={selectedContent.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <div
                    className="poster-placeholder"
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedContent.content_type}
                  </div>

                )}

              </div>


              <div>

                <div className="login-brand">
                  {selectedContent.content_type}
                </div>

                <h2>
                  {selectedContent.title}
                </h2>

                <p
                  className="login-description"
                  style={{
                    lineHeight: "1.7",
                  }}
                >
                  {selectedContent.description ||
                    "No description available."}
                </p>

                {selectedContent.release_date && (
                  <p
                    style={{
                      color: "#888894",
                      marginBottom: "10px",
                    }}
                  >
                    Release:{" "}
                    {selectedContent.release_date}
                  </p>
                )}

                {selectedContent.duration_minutes && (
                  <p
                    style={{
                      color: "#888894",
                    }}
                  >
                    Duration:{" "}
                    {selectedContent.duration_minutes}
                    {" "}minutes
                  </p>
                )}

                <div
                  style={{
                    marginTop: "25px",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  ⭐ {calculateAverageRating()}
                </div>

                <p
                  style={{
                    color: "#777783",
                    marginTop: "6px",
                    fontSize: "13px",
                  }}
                >
                  {ratings.length} rating
                  {ratings.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

            </div>


            {detailsError && (
              <div className="login-error">
                {detailsError}
              </div>
            )}


            {detailsLoading ? (

              <div
                className="message"
                style={{
                  minHeight: "100px",
                }}
              >
                Loading ratings and reviews...
              </div>

            ) : (

              <>

                {/* RATING */}

                <div
                  style={{
                    borderTop:
                      "1px solid #292932",
                    paddingTop: "25px",
                    marginBottom: "30px",
                  }}
                >

                  <h3
                    style={{
                      color: "#ffffff",
                      marginBottom: "15px",
                    }}
                  >
                    Rate this title
                  </h3>

                  {!user ? (

                    <button
                      className="login-submit"
                      onClick={() => {
                        closeContent();
                        openLogin();
                      }}
                    >
                      Login to Rate
                    </button>

                  ) : (

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >

                      <select
                        value={selectedRating}
                        onChange={(event) =>
                          setSelectedRating(
                            event.target.value
                          )
                        }
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border:
                            "1px solid #34343e",
                          background: "#0e0e13",
                          color: "#ffffff",
                        }}
                      >

                        <option value="5">
                          5 ⭐
                        </option>

                        <option value="4">
                          4 ⭐
                        </option>

                        <option value="3">
                          3 ⭐
                        </option>

                        <option value="2">
                          2 ⭐
                        </option>

                        <option value="1">
                          1 ⭐
                        </option>

                      </select>

                      <button
                        className="login-submit"
                        style={{
                          width: "auto",
                          padding:
                            "12px 22px",
                        }}
                        onClick={submitRating}
                        disabled={ratingLoading}
                      >
                        {ratingLoading
                          ? "Submitting..."
                          : "Submit Rating"}
                      </button>

                    </div>

                  )}

                </div>


                {/* REVIEW */}

                <div
                  style={{
                    borderTop:
                      "1px solid #292932",
                    paddingTop: "25px",
                    marginBottom: "30px",
                  }}
                >

                  <h3
                    style={{
                      color: "#ffffff",
                      marginBottom: "15px",
                    }}
                  >
                    Write a Review
                  </h3>

                  {!user ? (

                    <button
                      className="login-submit"
                      onClick={() => {
                        closeContent();
                        openLogin();
                      }}
                    >
                      Login to Write a Review
                    </button>

                  ) : (

                    <form
                      onSubmit={submitReview}
                    >

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
                        style={{
                          width: "100%",
                          resize: "vertical",
                          padding: "14px",
                          borderRadius: "8px",
                          border:
                            "1px solid #34343e",
                          background: "#0e0e13",
                          color: "#ffffff",
                          outline: "none",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          marginBottom: "12px",
                          boxSizing:
                            "border-box",
                        }}
                      />

                      <button
                        type="submit"
                        className="login-submit"
                        disabled={reviewLoading}
                      >
                        {reviewLoading
                          ? "Submitting..."
                          : "Submit Review"}
                      </button>

                    </form>

                  )}

                </div>


                {/* REVIEWS */}

                <div
                  style={{
                    borderTop:
                      "1px solid #292932",
                    paddingTop: "25px",
                  }}
                >

                  <h3
                    style={{
                      color: "#ffffff",
                      marginBottom: "20px",
                    }}
                  >
                    Reviews
                  </h3>

                  {reviews.length === 0 ? (

                    <p
                      style={{
                        color: "#777783",
                      }}
                    >
                      No reviews yet. Be the first
                      to review this title.
                    </p>

                  ) : (

                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          "column",
                        gap: "15px",
                      }}
                    >

                      {reviews.map((review) => (

                        <div
                          key={review.id}
                          style={{
                            padding: "18px",
                            background: "#0e0e13",
                            border:
                              "1px solid #292932",
                            borderRadius:
                              "10px",
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              marginBottom:
                                "10px",
                              gap: "10px",
                            }}
                          >

                            <strong
                              style={{
                                color: "#ffffff",
                              }}
                            >
                              User #{review.user_id}
                            </strong>

                            <span
                              style={{
                                color: "#666672",
                                fontSize:
                                  "12px",
                              }}
                            >
                              {review.created_at
                                ? new Date(
                                    review.created_at
                                  ).toLocaleDateString()
                                : ""}
                            </span>

                          </div>

                          <p
                            style={{
                              color: "#a1a1ad",
                              lineHeight:
                                "1.6",
                            }}
                          >
                            {review.review_text}
                          </p>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;