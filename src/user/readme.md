# Introduction

The **User Module** is responsible for managing all user-related functionalities, including the creation, retrieval, and updating of user information. Designed with scalability and maintainability in mind, this module utilizes **abstract classes** to define service contracts and their corresponding implementations for business logic.

This module follows a **domain-driven design** approach, with clearly defined entities, data transfer objects (DTOs), and exception handling mechanisms. By separating the business logic (`application` layer) from the user interface and database layers, the module ensures flexibility and easy adaptation to changing requirements.

  

#### **Key Responsibilities:**

*   **User Creation**: Provides functionality to create new users with base information.
*   **User Retrieval**: Enables fetching user details by their unique identifiers.
*   **User Updates**: Supports updating basic user information and custom field mappings.

# Core Components

#### Project Structure

The project is organized into a modular directory structure, adhering to clean architecture principles and domain-driven design.

  

Below is the breakdown of the **`User Module`** and its associated **`Auth Submodule`**:

> user/  
> ├── api/  
> │ ├── dto/  
> │ │ └── UserDTO.ts // Data Transfer Object for user-related data  
> │ ├── exceptions/  
> │ │ └── exceptions.ts // Custom exceptions for user operations  
> │ └── service/  
> │ └── UserService.ts // Abstract class defining user service contracts  
> ├── application/  
> │ └── UserServiceImpl.ts // Implementation of UserService with business logic  
> ├── domain/  
> │ └── User.ts // Core domain entity representing a user  
> └── user.module.ts // Entry point for the user module

  

#### **Auth Submodule**

The **User Module** is complemented by an **auth submodule** that handles authentication and authorization processes. This submodule provides:

*   **OAuth Integration**: Seamless authentication with external providers like Google via an `AuthService` implementation.
*   **JWT Authentication**: Secure token-based authentication using the `JwtService`. This ensures stateless sessions and scalable authentication mechanisms.
*   **Provider Enum**: Defines supported OAuth providers to simplify provider-specific logic.

  

> auth/  
> ├── api/  
> │ ├── dto/  
> │ │ └── AuthDTO.ts // Data Transfer Object for auth-related data  
> │ └── service/  
> │ ├── AuthService.ts // Abstract class for authentication service  
> │ ├── JwtService.ts // Abstract class for JWT-related functionality  
> │ └── Provider.ts // Enum for supported OAuth providers  
> ├── application/  
> │ ├── GoogleAuthServiceImpl.ts // Implementation of OAuth via Google  
> │ └── JwtServiceImpl.ts // Implementation of JWT functionality  
> ├── auth.module.ts // Entry point for the auth submodule

# APIs

# User Module:

## 1.A. Services:

### 1.A.1. UserService Class:

The `UserService` class is an abstract base class designed to define the core functionalities related to user management in a software application. It serves as a blueprint for implementing user-related operations, ensuring that derived classes provide specific implementations for the defined methods.

####   

#### Methods:

The class contains three abstract methods that must be implemented by any subclass:

1. **`getBaseUserById(userId: string)`**: This method is designed to retrieve basic user information based on the provided user ID. It returns a `UserDTO` object if the user is found or `null` if no corresponding user exists.
2. **`createBaseUser(userId: string, name: string)`**: This method facilitates the creation of a new user with the specified ID and name. It throws a `UserAlreadyExists` exception if a record with the same user ID already exists, ensuring that each user ID remains unique.
3. **`updateUser(userId: string, baseInfo?: { username?: string })`**: This method allows for the updating of an existing user's information. It accepts an optional parameter `baseInfo`, which can include basic information such as the username.

  

#### Purpose:

The `UserService` class serves as a foundational component for implementing user management logic in various applications. By defining these methods as abstract, it enforces a consistent interface across different implementations, promoting code reuse and maintainability.

## 1.B. DTOs:

  

### 1.B.1. UserDTO:

The UserDTO interface defines the structure for a data transfer object that encapsulates user information within a software application. It serves as a lightweight representation of user data, facilitating data exchange between different parts of an application or between services.

#### Properties:

The interface includes the following properties:

*   **`userID`**: A string that uniquely identifies the user. This is typically used as a primary key in user management systems.
*   **`username`**: A string that represents the user's name or login identifier. This is often displayed in user interfaces and used for authentication purposes.

#### Purpose:

The `UserDTO` interface is essential for standardizing user data representation across various components of an application. By defining a clear structure for user information, it promotes consistency and ease of use when handling user data.

## 1.C. Exceptions:

  

#### 1.C.1. UserAlreadyExistsException Class:

The `UserAlreadyExistsException` class is a custom error class that extends the built-in \`Error\` class in JavaScript. It is designed to represent an error condition where an attempt is made to create a user that already exists in the system.

  

#### Constructor

`constructor(userId: string)`: This constructor initializes the exception with a specific user ID that triggered the error.

*   Parameters:
    *   `userId`: A string representing the unique identifier of the user that already exists. This value is included in the error message for clarity.

  

#### Purpose

The primary purpose of the `UserAlreadyExistsException` class is to provide a clear and descriptive error message when a user creation operation fails due to a duplicate user ID. By using this custom exception, developers can handle user creation errors more effectively, improving the overall robustness of user management features in an application.

  

#### Usage

This exception can be thrown in service methods responsible for creating users, particularly when checking for the existence of a user with the same ID. For example:

  

```typescript
if (existingUser) {
  throw new UserAlreadyExistsException(userId);
}
```

  

By throwing this exception, developers can implement specific error handling logic in higher layers of the application, such as returning appropriate HTTP status codes or displaying user-friendly messages in the user interface.

  

Overall, the `UserAlreadyExistsException` class enhances error handling related to user creation processes, making it easier to manage and respond to duplicate entries in a consistent manner.

  

* * *

# 2.Auth Sub-Module:

## 2.A. Services:

### 2.A.1. AuthService Class:

The `AuthService` class is an abstract base class designed to define the core functionalities related to authentication using Google OAuth in a software application. It serves as a blueprint for implementing authentication-related operations, ensuring that derived classes provide specific implementations for the defined methods.

  

#### Methods:

The class contains two abstract methods that must be implemented by any subclass:

1. **generateOAuthLoginUrl()**: This method generates a Google OAuth URL that users can utilize to log in. The URL directs users to Google's OAuth login page, where they can authenticate and grant access. It returns a string containing the Google OAuth URL.
2. **getUserInfoFromOAuthToken(code: string)**: This method retrieves user information from the OAuth token received after a successful Google OAuth login. It exchanges the provided OAuth refresh token (code) for user details.
    *   The method accepts two parameters:
        *   `code`: The OAuth refresh token received from the Google OAuth login redirect.
        *   `state`: A unique state ID received from the Google OAuth login redirect for security purposes.
    *   It returns a `UserInfoDTO` (Data Transfer Object) containing the user's details fetched from the OAuth response.

  

## Purpose:

The `AuthService` class serves as a foundational component for implementing authentication logic in various applications using Google OAuth. By defining these methods as abstract, it enforces a consistent interface across different implementations, promoting code reuse and maintainability.

* * *

### 2.A.2 JWTService Class:

The `JwtService` class is an abstract base class designed to define the core functionalities related to JSON Web Token (JWT) management in a software application. It serves as a blueprint for implementing JWT-related operations, ensuring that derived classes provide specific implementations for the defined methods.

  

#### Methods:

The class contains two abstract methods that must be implemented by any subclass:

1. **generateJwt(claims: Map<string, string>, subject: string)**: This method generates a JSON Web Token (JWT) using the provided claims and subject.
    *   **Parameters**:
        *   `claims`: A map containing key-value pairs that represent the claims to include in the JWT payload.
        *   `subject`: The subject (typically a user identifier) for whom the token is being generated.
    *   **Returns**: A string representing the signed JWT.
2. **verifySignature(token: string)**: This method verifies the signature of a given JWT token to ensure its authenticity and integrity.
    *   **Parameters**:
        *   `token`: The JWT token whose signature needs to be verified.
    *   **Returns**: An object containing the decoded payload if the signature is valid, or an error message if it is invalid. It currently returns a `UserAccessTokenDTO.`

  

#### Purpose:

The `JwtService` class serves as a foundational component for implementing JWT management logic in various applications. By defining these methods as abstract, it enforces a consistent interface across different implementations, promoting code reuse and maintainability.

## 2.B. DTOs

  

### 2.B.1. UserInfoDTO Interface

The `UserInfoDTO` interface defines the structure for a data transfer object that encapsulates basic user information within a software application. It serves as a standardized representation of user data, facilitating data exchange between various components or services.

#### Properties:

The interface includes the following properties:

*   `name`: A string that represents the name of the user. This field is typically used for display purposes in user interfaces.
*   `id`: A string that uniquely identifies the user. This identifier is often used as a primary key in user management systems.

### 2.B.1.i. GoogleUserInfoDTO Interface

The `GoogleUserInfoDTO` interface extends the `UserInfoDTO` interface, adding additional properties specific to user information retrieved from Google OAuth.

#### Additional Properties

*   **`sub`**: A string that represents the unique identifier for the user provided by Google.
*   **`given_name`**: A string representing the user's first name.
*   **`family_name`**: A string representing the user's last name.
*   **`picture`** (optional): A string containing the URL of the user's profile picture.
*   **`email_verified`**: A boolean indicating whether the user's email address has been verified.

#### Purpose

The `UserInfoDTO` and `GoogleUserInfoDTO` interfaces are essential for standardizing user data representation across different components of an application. They help ensure type safety and clarity when handling user-related information, reducing the likelihood of runtime errors due to incorrect property access.

* * *

### 2.B.2. UserAccessTokenDTO Interface

The `UserAccessTokenDTO` interface defines the structure for a data transfer object that encapsulates information related to a user's access token within a software application. This interface is crucial for managing user authentication and authorization processes, particularly in systems that utilize token-based authentication.

####   

#### Properties

The interface includes the following properties:

*   **`userId`**: A string that uniquely identifies the user associated with the access token. This identifier is typically used to link the token to a specific user account in the system.
*   **`expiry`**: A number representing the expiration time of the access token, usually expressed as a timestamp (in seconds since the epoch). This value indicates when the token will no longer be valid, helping to enforce security by limiting the lifetime of tokens.
*   **`issuedAt`**: A number indicating the time at which the access token was issued, also typically expressed as a timestamp. This property can be used to determine how long the token has been valid and to manage token renewal or refresh processes.

####   

#### Purpose

The `UserAccessTokenDTO` interface is essential for standardizing the representation of access token information across different components of an application. By providing a clear structure for access tokens, it promotes consistency and type safety when handling authentication data.

  

#### Usage

This interface is commonly used in authentication services, APIs, and middleware that manage user sessions and access control. It allows developers to easily pass around access token information without exposing implementation details or underlying data structures.

For Example:

```kotlin
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>(ConstEnvNames.JWT_SECRET),
      });
      return {
        issuedAt: decoded.iat,
        expiry: decoded.exp,
        userId: decoded.sub,
      };
```

This example demonstrates the process of verifying a JWT token using the `jwtService`. It decodes the token with a specified secret key retrieved from the .env file, and then extracts and returns the `issuedAt`, `expiry`, and `userId` properties from the decoded payload, which are essential for managing user authentication and session validity.