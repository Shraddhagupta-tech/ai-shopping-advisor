import React, { useState } from "react";
import styles from "../styles/auth.module.css";


const Login = () => {
  const [formData, setFormData] = useState({
    email_id: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email is required.";
    } else if (!emailRegex.test(formData.email_id)) {
      newErrors.email_id = "Please enter a valid email address.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Login successful:", formData);

      alert("Login successful!");

      // Call your backend API here
      // Example:
      //
      // fetch("http://localhost:5000/api/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Welcome Back</h1>

        <p className={styles.subtitle}>Login to your account</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email_id">Email</label>

            <input
              type="email"
              id="email_id"
              name="email_id"
              placeholder="Enter your email"
              value={formData.email_id}
              onChange={handleChange}
            />

            {errors.email_id && (
              <span className={styles.error}>{errors.email_id}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>

          {/* Login Button */}
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <div className={styles.link}>
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
