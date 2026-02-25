import type { AccessTokenPayload } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      authUser?: AccessTokenPayload;
    }
  }
}

export {};
