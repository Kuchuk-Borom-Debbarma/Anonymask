import ResponseException from '../../../common/ResponseException';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyExists extends ResponseException {
  constructor(userId: string) {
    super(HttpStatus.CONFLICT, `User with ID ${userId} already exists`);
  }
}
