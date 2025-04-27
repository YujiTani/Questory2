import { Config, SDK } from "@corbado/node-sdk";
import { getCookie } from "hono/cookie";

import type { Context } from "hono";

// Retrieve environment variables
const projectID = process.env.CORBADO_PROJECT_ID;
const apiSecret = process.env.CORBADO_API_SECRET;
if (!projectID) {
  throw Error("Project ID is not set");
}
if (!apiSecret) {
  throw Error("API secret is not set");
}
const frontendAPI = process.env.CORBADO_FRONTEND_API;
const backendAPI = process.env.CORBADO_BACKEND_API;
if (!frontendAPI) {
  throw Error("Frontend API URL is not set");
}
if (!backendAPI) {
  throw Error("Backend API URL is not set");
}
// Initialize the Corbado Node.js SDK with the configuration
const config = new Config(projectID, apiSecret, frontendAPI, backendAPI);
const sdk = new SDK(config);

// Get authenticated user from cookie
export async function getAuthenticatedUserFromCookie(c: Context) {
  const sessionToken = getCookie(c, "cbo_session_token");

  if (!sessionToken) {
    return null;
  }

  try {
    // Your existing token validation logic
    return await sdk.sessions().validateToken(sessionToken);
  } catch (error) {
    // Log the error if needed
    return null;
  }
}

// Get authenticated user from authorization header
export async function getAuthenticatedUserFromAuthorizationHeader(c: Context) {
  const sessionToken = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!sessionToken) {
    return null;
  }
  try {
    return await sdk.sessions().validateToken(sessionToken);
  } catch {
    return null;
  }
}
