"use client";

import { signIn, signOut } from "next-auth/react";

export async function signInAction() {
  const result = await signIn("google", { callbackUrl: "/loggedin" });
  console.log("Sign-in result:", result);
}

export async function signOutAction() {
  await signOut({ callbackUrl: "/" });
}
