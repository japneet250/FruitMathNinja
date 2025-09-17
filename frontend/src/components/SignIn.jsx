import React, { useState } from "react";
import "./css/signupStyle.css";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD17Rba3hlcxOe2mmDr_U1xB2lAPnuhTrA",
  authDomain: "fruit-ninja-handtracker.firebaseapp.com",
  projectId: "fruit-ninja-handtracker",
  storageBucket: "fruit-ninja-handtracker.appspot.com",
  messagingSenderId: "480626111321",
  appId: "1:480626111321:web:762bb55cb22dce3d2e9248"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function SignIn({ onSuccess }) {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clear error when switching modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ===== SIGN UP =====
  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the full name in Firebase Auth profile
      await updateProfile(user, {
        displayName: name.trim()
      });

      // Register user with backend
      const res = await fetch("http://127.0.0.1:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: name.trim(),
          email: email.trim() 
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert("Account created successfully! Please sign in.");
        setMode("signin");
        
        // Clear form fields
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Failed to register user with server");
      }

    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  // ===== SIGN IN =====
  const handleSignin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get username from Firebase profile or fallback to email
      const username = user.displayName || user.email.split('@')[0];

      // Sync/verify user with backend
      const res = await fetch("http://127.0.0.1:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username,
          email: user.email 
        })
      });
      
      const data = await res.json();

      if (data.success) {
        // Pass the validated username from backend to the parent component
        if (onSuccess) {
          onSuccess(data.user.username);
        }
      } else {
        setError(data.message || "Login failed - server error");
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email. Please sign up first.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "signin") {
      handleSignin();
    } else {
      handleSignup();
    }
  };

return (
  <div className="container">
    <div className="auth-layout">
      {/* LEFT IMAGE */}
      <div className="auth-image"></div>

      {/* RIGHT FORM */}
      <div className="auth-form">
        <div className="form-box">
          <h1 id="title">{mode === "signup" ? "Sign Up" : "Sign In"}</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Input fields */}
            <div className="input-group">
              {mode === "signup" && (
                <div className="input-field">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              )}

              <div className="input-field">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="input-field password-field">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength="6"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  title={showPassword ? "Hide password" : "Show password"}
                />
              </div>

              {mode === "signin" && (
                <div className="forgot-password">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Forgot Password?
                  </a>
                </div>
              )}

              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="btn-field">
              <button
                type="submit"
                className={`primary-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Please wait...' : (mode === "signup" ? "Create Account" : "Sign In")}
              </button>
            </div>

            <div className="mode-toggle">
              {mode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <span 
                    className="toggle-link" 
                    onClick={() => switchMode("signup")}
                  >
                    Sign up here
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span 
                    className="toggle-link" 
                    onClick={() => switchMode("signin")}
                  >
                    Sign in here
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}