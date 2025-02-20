import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      username: string;
      email: string;
    };
  }
}