import UserDTO from "../user/api/dto/UserDTO";
import { FastifyRequest as FR } from "fastify";

/**
 * Custom Request type extended Request object of express to add new type.
 * Now we can have new type added to Request while getting TS intellisense benefits Yipeeeee
 */
declare module 'fastify' {
  export interface FastifyRequest extends FR {
    user?: UserDTO;
  }
}
