"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import React, { ReactNode, useState } from "react";

export default function Login(): ReactNode {
  const [user, setUser] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  return (
    <div>
      <input
        type="text"
        placeholder="displayName"
        onChange={(e) => setUser({ ...user, displayName: e.target.value })}
        name="displayName"
      />
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
        onClick={async () => {
          const { data } = await axios.post("/api/auth/register", {
            displayName: user.displayName,
            email: user.email,
            password: user.password,
          });
          console.log(data);
        }}
      >
        Register
      </button>
    </div>
  );
}
