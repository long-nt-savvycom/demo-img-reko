'use client';

import { redirect } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return redirect('/signin');
  }
  return <div>{children}</div>;
}
