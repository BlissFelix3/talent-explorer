interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  torreUsername: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  torreUsername: string;
  profilePicture?: string | null;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  },
};

export type { RegisterRequest, LoginRequest, User, AuthResponse };
