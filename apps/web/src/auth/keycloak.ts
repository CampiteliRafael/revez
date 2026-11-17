import Keycloak from "keycloak-js";

const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

if(!url || !realm || !clientId) {
  throw new Error("Missing Keycloak configuration in environment variables.");
}

export const keycloak = new Keycloak({
  url,
  realm,
  clientId
});