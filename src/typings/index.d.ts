declare global {
  namespace Express {
    export interface Request {
      user: {
        id: number;
        rid: number;
        auth: number[];
      };
    }
  }
}

// ! to make the file a module and avoid the TypeScript error
export {};
