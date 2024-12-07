import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as readline from 'readline';
import GoogleAuthServiceImpl from 'src/user/auth/application/GoogleAuthServiceImpl';

describe('GoogleAuthServiceImpl', () => {
  let googleAuthService: GoogleAuthServiceImpl;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [GoogleAuthServiceImpl],
    }).compile();

    googleAuthService = module.get<GoogleAuthServiceImpl>(GoogleAuthServiceImpl);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should print the OAuth URL', () => {
    // Generate the Google OAuth URL
    const oauthUrl = googleAuthService.generateOAuthLoginUrl();
    
    console.log('OAuth URL:', oauthUrl);

    // Test if the URL contains the expected domain
    expect(oauthUrl).toContain('https://accounts.google.com/o/oauth2/auth');
  });

  // Use a function to prompt for OAuth code
  const promptForOAuthCode = (): Promise<string> => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise((resolve) => {
      console.log('OAuth Flow Instructions:');
      console.log('1. Open the following URL in your browser:');
      console.log(googleAuthService.generateOAuthLoginUrl());
      console.log('2. Complete the Google login');
      console.log('3. After redirecting, copy the OAuth code from the URL');
      console.log('4. Paste the code here');
      
      rl.question('OAuth Code: ', (code) => {
        rl.close();
        resolve(code.trim());
      });
    });
  };

  // Note: This test requires manual input of OAuth code
  it('should retrieve user info from OAuth token', async () => {
    // Prompt user for OAuth code
    const testOAuthCode = await promptForOAuthCode();
  
    try {
      const tokenParams = {
        code: testOAuthCode,
        redirect_uri: configService.get<string>('GOOGLE_REDIRECT_URI'),
      };
  
      console.log('Token Params:', {
        code: testOAuthCode ? 'Code provided' : 'No code',
        redirectUri: tokenParams.redirect_uri
      });
  
      const accessToken = await googleAuthService['oauth2'].getToken(tokenParams);
  
      console.log('Access Token Retrieved:', {
        accessToken: accessToken.token ? 'Token exists' : 'No token',
        expiresAt: accessToken.token?.expires_at
      });
  
      const accessTokenString: string = accessToken.token.access_token as string;
  
      console.log('Access Token String:', accessTokenString ? 'Token string exists' : 'No token string');
  
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessTokenString}`,
        },
      });
  
      console.log('Response Status:', response.status);
      
      const responseBody = await response.text();
      console.log('Response Body:', responseBody);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseBody}`);
      }
  
      const userInfo = JSON.parse(responseBody);
      console.log('Retrieved User Info:', userInfo);
  
      expect(userInfo).toBeDefined();
      expect(userInfo.sub).toBeDefined();
      expect(userInfo.email).toBeDefined();
      expect(userInfo.name).toBeDefined();
    } catch (error) {
      console.error('Detailed Error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }, 10000); // Increased timeout to allow for network requests
});