import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setError(null);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
      setMessage(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
        {message && (
          <div className="mb-4 text-green-600 text-center">{message}</div>
        )}
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send Reset Email
        </button>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
