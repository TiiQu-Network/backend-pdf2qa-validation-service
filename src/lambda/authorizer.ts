import { APIGatewayTokenAuthorizerEvent, AuthResponse } from "aws-lambda";
import { generatePolicy } from "../utils/policy";
import jwt from "jsonwebtoken";
export interface Authorizer {
  (event: APIGatewayTokenAuthorizerEvent): Promise<AuthResponse>;
}

export const handler: Authorizer = async (event) => {
  const { methodArn } = event;
  try {
    const authorizationToken = event.authorizationToken;
    const AUTHO_RS256_PUBLIC_KEY = process.env.AUTHO_RS256_PUBLIC_KEY;
    
    // verfiy authorizationToken and AUTHO_RS256_PUBLIC_KEY exists
    if (!authorizationToken || !AUTHO_RS256_PUBLIC_KEY) {
      return generatePolicy(event, "Unauthorized", methodArn);
    }
    
    // verify the token exists and has the right format
    const [, token] = authorizationToken.split(" ");
    if (token.length < 2) return generatePolicy(event, "Deny", methodArn);
    
    const [, value] = token;
    if (value === "") return generatePolicy(event, "Unauthorized", methodArn);

    const jwtPayload = jwt.verify(token, AUTHO_RS256_PUBLIC_KEY);
        
    if (jwtPayload.sub) {
      return generatePolicy(event, "Allow", methodArn);
    }
    else {
      return generatePolicy(event, "Unauthorized", methodArn);
    }
  } catch (e) {
    console.error(e);
    return generatePolicy(event, "Unauthorized", methodArn);
  }
};
