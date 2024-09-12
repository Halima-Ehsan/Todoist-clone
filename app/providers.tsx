"use client";
import { ReactNode, useMemo } from "react";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";

// Define the type for the return value of useAuth
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchAccessToken: (options: { forceRefreshToken: boolean }) => Promise<string | null>;
}

function useAuth(): AuthContextType {
  const { data: session, update } = useSession();

  // Fetch Flask token from the session
  const flaskToken = session?.flaskToken ?? null;

  return useMemo(
    () => ({
      isLoading: false,
      isAuthenticated: session !== null,
      fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
        if (forceRefreshToken) {
          const session = await update();
          return session?.flaskToken ?? null;
        }
        return flaskToken;
      },
    }),
    [flaskToken, update, session]
  );
}

export default function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      {/* Pass the useAuth hook to your custom provider */}
      <AuthProviderWithFlask useAuth={useAuth}>
        {children}
      </AuthProviderWithFlask>
    </SessionProvider>
  );
}

// Create a custom provider component for Flask-based auth management
function AuthProviderWithFlask({
  children,
  useAuth,
}: {
  children: ReactNode;
  useAuth: () => AuthContextType; // Function type that returns AuthContextType
}) {
  const auth = useAuth(); // Call useAuth to get the context value
  // You can pass the auth object down the context if needed
  return <>{children}</>;
}
