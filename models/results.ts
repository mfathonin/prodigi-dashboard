export type ServerActionResult<Result> = Promise<
  | {
      data: Result;
      error: null;
    }
  | {
      data: null;
      error: ActionError;
    }
>;

export type ActionError = {
  status: number;
  message: string;
};
