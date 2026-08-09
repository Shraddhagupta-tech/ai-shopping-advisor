import React, { useState } from "react";
import styles from "../styles/auth.module.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
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

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    const nameRegex = /^[A-Z][a-zA-Z\s]*$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!nameRegex.test(formData.name.trim())) {
      newErrors.name =
        "Name must start with a capital letter and contain only letters.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email is required.";
    } else if (!emailRegex.test(formData.email_id)) {
      newErrors.email_id = "Please enter a valid email address.";
    }

    // Password validation
    const password = formData.password;

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Registration successful:", formData);

      alert("Registration successful!");

      // You can call your backend API here
      // Example:
      // fetch("http://localhost:5000/api/register", {
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
        <h1>Create Account</h1>
        <p className={styles.subtitle}>Register to get started</p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />

            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

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

            {/* <small className={styles.password-hint}>
              Minimum 8 characters, including uppercase, lowercase, number and
              symbol.
            </small> */}
          </div>

          {/* Submit */}
          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>

        <div className={styles.link}>
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Registration;
