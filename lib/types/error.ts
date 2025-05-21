/* eslint-disable @typescript-eslint/no-unused-vars */
interface CustomError extends Error {
  response?: {
    data: {
      status: number;
      message: string;
    };
  };
}
