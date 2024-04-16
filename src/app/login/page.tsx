"use client";

import { signIn } from "next-auth/react";
import React, { ReactNode, useState } from "react";

export default function Login(): ReactNode {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  return (
    <div>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        name="email"
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        onClick={() => {
          signIn("credentials", {
            email: user.email,
            password: user.password,
            redirect: false,
            callbackUrl: "/",
          });
        }}
      >
        Login
      </button>
    </div>
  );
}
