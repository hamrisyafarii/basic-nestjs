declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      username: string | null;
      password: string | null;
      name: string | null;
      googleId: string | null;
      avatar: string | null;
      provider: string | null;
      isActive: boolean;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
