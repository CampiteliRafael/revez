import {
    createRemoteJWKSet,
    errors as joseErrors,
    jwtVerify,
    type JWTPayload,
} from "jose";

function getKeycloakConfig() {
    const issuer = process.env.KEYCLOAK_ISSUER;
    const audience = process.env.KEYCLOAK_AUDIENCE;
    const operatorsGroup = process.env.KEYCLOAK_OPERATORS_GROUP;

    if (!issuer || !audience || !operatorsGroup) {
        throw new Error("Configuração do Keycloak incompleta");
    }

    return { issuer, audience, operatorsGroup };
}

const { issuer, audience, operatorsGroup } = getKeycloakConfig();


const jwksUrl = new URL(
    `${issuer.replace(/\/$/, "")}/protocol/openid-connect/certs`,
);
const jwks = createRemoteJWKSet(jwksUrl);

export type AuthenticatedUser = {
    userId: string;
    groups: string[];
};

export async function verifyAccessToken(
    token: string,
): Promise<AuthenticatedUser> {
    let payload: JWTPayload;
    try {
        const result = await jwtVerify(token, jwks, { issuer, audience });
        payload = result.payload;
    } catch (error) {
        if (
            error instanceof joseErrors.JWTExpired ||
            error instanceof joseErrors.JWTClaimValidationFailed ||
            error instanceof joseErrors.JWTInvalid ||
            error instanceof joseErrors.JWSInvalid ||
            error instanceof joseErrors.JWSSignatureVerificationFailed ||
            error instanceof joseErrors.JWKSNoMatchingKey
        ) {
            throw new InvalidAccessTokenError();
        }

        throw error;
    }

    if (!payload.sub) {
        throw new InvalidAccessTokenError();
    }

    const groups = payload.groups;
    if (groups !== undefined && (!Array.isArray(groups) || !groups.every(
        (group): group is string => typeof group === "string",
    ))) {
        throw new InvalidAccessTokenError();
    }

    return {
        userId: payload.sub,
        groups: groups ?? [],
    };
}

export class InvalidAccessTokenError extends Error {
    constructor() {
        super("Token de acesso inválido");
        this.name = "InvalidAccessTokenError";
    }
}