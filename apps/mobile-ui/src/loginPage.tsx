// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useState } from "react";
import { signIn, signUp } from "./authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const authResult = await signIn(email, password);
      if (authResult) {
        window.location.href = "/home";
      }
    } catch (error) {
      setErrorMessage(`Sign in failed: ${error}`);
    }
  };

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      await signUp(email, password);
      setIsSignUp(false);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(`Sign up failed: ${error}`);
    }
  };

  const handleSignInOrSignUpToggle = (isSignUp: boolean) => {
    setIsSignUp(isSignUp);
    setErrorMessage(null);
  };

  return (
    <div className="loginForm">
      <h1>Welcome</h1>
      {errorMessage && (
        <div style={{ color: "#ff1e1e" }} data-test-id="errorMessage">
          {errorMessage}
        </div>
      )}
      <h4>
        {isSignUp ? "Sign up to create an account" : "Sign in to your account"}
      </h4>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <div>
          <input
            className="inputText"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            className="inputText"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {isSignUp && (
          <div>
            <input
              className="inputText"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        )}
        {isSignUp ? (
          <button data-test-id="signUpSubmit" type="submit">
            Sign up
          </button>
        ) : (
          <button data-test-id="signInSubmit" type="submit">
            Sign In
          </button>
        )}
      </form>
      <button
        data-test-id="signInOrUpToggle"
        onClick={() => handleSignInOrSignUpToggle(!isSignUp)}
      >
        {isSignUp
          ? "Already have an account? Sign In"
          : "Need an account? Sign Up"}
      </button>
    </div>
  );
};

export default LoginPage;
