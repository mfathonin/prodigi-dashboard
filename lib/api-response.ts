import { NextResponse } from "next/server";
import { ErrorCodes } from "./constants";

export class ApiResponseHandler {
  static success<T>(data: T, status: number = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    );
  }

  static error(error: ErrorCodes) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.status }
    );
  }

  static redirect(url: URL | string) {
    return NextResponse.redirect(url);
  }
}
