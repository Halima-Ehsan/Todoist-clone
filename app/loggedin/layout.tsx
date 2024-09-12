import { getServerSession } from "next-auth";
import Providers from "../providers";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { prompt: "consent" } },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const accessToken = token?.accessToken;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/generate-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch token from Flask backend');
        }

        const data = await response.json();
        return { ...session, flaskToken: data.token };
      } catch (error) {
        console.error("Error in session callback:", error);
        throw error;
      }
    },
  },
};

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return <Providers session={session}>{children}</Providers>;
}
