import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
}

export const extractIdFromToken = (token: string): string | null => {
  if (!token) return null;
    try {
      const decodedToken = jwtDecode<TokenPayload>(token);
      return decodedToken.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
};
