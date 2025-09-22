"use client";

import { login } from "@/actions/auth";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const res = await login(formData);
    if (res?.error) setError(res.error);
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-sm mx-auto p-6 space-y-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-bold">Login</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm">Username</label>
        <input
          type="text"
          name="username"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}
