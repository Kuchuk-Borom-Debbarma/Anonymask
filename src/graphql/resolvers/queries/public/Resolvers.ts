// import { Args, Query, Resolver } from '@nestjs/graphql';
// import { ResponseModel } from 'src/common/ResponseModel';
// import { OAuthProvider } from 'src/user/auth/api/Provider';
// import AuthService from 'src/user/auth/api/service/AuthService';
//
// @Resolver()
// export class PublicQueryResolver {
//   constructor(private authService: AuthService) {}
//
//   @Query(() => String)
//   getLoginURL(
//     @Args('Provider')
//     provider: OAuthProvider,
//   ): ResponseModel<string> {
//     switch (provider) {
//       case OAuthProvider.GOOGLE:
//         return {
//           data: this.authService.generateOAuthLoginUrl(),
//           msg: `Login URL for ${provider}`,
//         };
//       default:
//         return {
//           data: null,
//           msg: 'Invalid OAuth Provider Type',
//         };
//     }
//   }
// }
