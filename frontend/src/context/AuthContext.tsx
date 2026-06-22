import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "agent" | "admin";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [token, setToken] = useState<string | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    const storedToken =
      localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsed = JSON.parse(storedUser);
      if (!parsed.id) {
        parsed.id = parsed._id || parsed.userId || undefined;
      }
      setUser(parsed as User);
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  const login = (
    userData: User,
    accessToken: string
  ) => {
    setUser(userData);
    setToken(accessToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      accessToken
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};