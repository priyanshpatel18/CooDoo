"use client"

import axios from "axios";
import React, { ReactNode, useState } from "react";

export default function VerifyEmail(): ReactNode {
  const [otp, setOtp] = useState("");

  return (
    <div>
      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button
        onClick={async () => {
          const { data } = await axios.post("/api/auth/verifyEmail", { otp });
          console.log(data);
        }}
      >
        Verify
      </button>
    </div>
  );
}
