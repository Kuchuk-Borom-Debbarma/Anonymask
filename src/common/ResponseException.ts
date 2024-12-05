import { HttpStatus } from '@nestjs/common';

export default class ResponseException extends Error {
  constructor(httpStatus: HttpStatus, message: string) {
    super(message);
    this.httpStatus = httpStatus;
    this.message = message;
  }

  httpStatus: HttpStatus;
  message: string;
}
