import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "@/services/api";
import type { User } from "@/types/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const initAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          // Fetch current user info (you'll need to add this endpoint)
          // For now, we'll just set a basic user
          setUser({
            id: "current_user",
            email: "user@example.com",
            name: "John Doe",
            role: "rep",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Auth init failed:", error);
          apiClient.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await apiClient.login(email, password);
      // Fetch user info after successful login
      setUser({
        id: "current_user",
        email,
        name: "John Doe",
        role: "rep",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
