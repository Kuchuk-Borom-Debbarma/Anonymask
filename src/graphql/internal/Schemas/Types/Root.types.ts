import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function ResponseModel<T>(classRef: Type<T>): Type<IResponseModel<T>> {
  @ObjectType(`ResponseModel_${classRef.name || 'Null'}`, { isAbstract: true })
  abstract class ResponseModelClass implements IResponseModel<T> {
    @Field(() => Boolean)
    success: boolean;

    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => classRef, { nullable: true })
    data?: T;
  }

  return ResponseModelClass as Type<IResponseModel<T>>;
}

export interface IResponseModel<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const StringResponse = ResponseModel(String);
