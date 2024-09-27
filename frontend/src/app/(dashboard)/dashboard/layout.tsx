"use client";

import { redirect } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);

  const savedToken = localStorage.getItem("token");

  if (savedToken) {
    setToken(savedToken);
  } else if (token) {
    localStorage.setItem("token", token);
  }

  if (!token && !savedToken) {
    return redirect("/signin");
  }
  return <div>{children}</div>;
}
