import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;

export const {  signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { prompt: "consent" } },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback triggered");
      console.log("Session data:", session);
      console.log("Token data:", token);

      if (!session.user) {
        console.error('User information is missing from the session');
        throw new Error('User information is missing from the session');
      }

      const accessToken = token?.accessToken;
      console.log("Access Token:", accessToken);

      try {
        const response = await fetch(`${FLASK_API_URL}/generate-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        console.log("Fetch response:", response);

        if (!response.ok) {
          console.error('Failed to fetch token from Flask backend');
          throw new Error('Failed to fetch token from Flask backend');
        }

        const data = await response.json();
        console.log("Token data from Flask:", data);

        return { ...session, flaskToken: data.token };
      } catch (error) {
        console.error("Error in session callback:", error);
        throw error;
      }
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    flaskToken: string;
  }
}



export const handlers = {
  GET: async (req: Request) => {
    return new Response(JSON.stringify({ message: "GET request successful" }), { status: 200 });
  },
  POST: async (req: Request) => {
    const data = await req.json(); 
    return new Response(JSON.stringify({ message: "POST request successful", data }), { status: 201 });
  },
};
