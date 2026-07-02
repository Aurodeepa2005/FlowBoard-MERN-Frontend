import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      );
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.hex}>⬡</span>
          TaskFlow
        </div>

        <div className={styles.hero}>
          <h1>
            Start your
            <br />
            <em>flow.</em>
          </h1>

          <p>
            Create an account and get your tasks under control — in minutes.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statN}>∞</span>
            <span className={styles.statL}>Tasks you can create</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statN}>0</span>
            <span className={styles.statL}>Distractions</span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create account</h2>

          <p className={styles.cardSub}>
            Already have one?{" "}
            <Link to="/login" className={styles.link}>
              Sign in
            </Link>
          </p>

          <form onSubmit={submit} className={styles.form}>
            <div className={styles.field}>
              <label>Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handle}
                placeholder="Your name"
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handle}
                  placeholder="Password@123"
                  style={{ flex: 1 }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈 Hide" : "👁 Show"}
                </button>
              </div>

              <small
                style={{
                  color: "#9ca3af",
                  marginTop: "8px",
                  display: "block",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                Password must contain:
                <br />
                • At least 8 characters
                <br />
                • One uppercase letter
                <br />
                • One lowercase letter
                <br />
                • One number
                <br />• One special character
              </small>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
