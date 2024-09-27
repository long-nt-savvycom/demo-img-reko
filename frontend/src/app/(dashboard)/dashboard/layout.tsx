"use client";

import { redirect } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
      } else if (token) {
        localStorage.setItem("token", token);
      }
    }
  }, [token, setToken]);

  if (!token && typeof window !== "undefined" && !localStorage.getItem("token")) {
    redirect("/signin");
  }

  return <div>{children}</div>;
}
