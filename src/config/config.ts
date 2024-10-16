import Joi from "joi";
import {UserScope} from "@logto/react";
import {ImportMetaEnv} from "@/vite-env";

const envSchema = Joi.object<ImportMetaEnv>().keys({
  VITE_LOG_TO_ENDPOINT: Joi.string().required(),
  VITE_LOG_TO_APP_ID: Joi.string().required(),
  VITE_ORGANIZATION_ID: Joi.string().required(),
  VITE_SERVER_URL: Joi.string().required(),
  VITE_WEBRTC_SIGNALLING_SERVER: Joi.string().required(),
  VITE_CLIENT_URL: Joi.string().required()
})

const validatedEnv = envSchema
  .prefs({ errors: { label: 'key' } })
  .validate(import.meta.env, { abortEarly: false, stripUnknown: true });

if (validatedEnv.error) {
  throw new Error(
    `Environment variable validation error: \n${validatedEnv.error.details
      .map((detail) => detail.message)
      .join('\n')}`
  );
}

if (!validatedEnv.value) {
  throw new Error('Environment variable validation error');
}

const validatedEnvValue = validatedEnv.value

export const config = {
  server: {
    baseUrl: validatedEnvValue.VITE_SERVER_URL
  },
  client: {
    url: validatedEnvValue.VITE_CLIENT_URL
  },
  webrtcSignallingServer: validatedEnvValue.VITE_WEBRTC_SIGNALLING_SERVER,
  logTo: {
    endpoint: validatedEnvValue.VITE_LOG_TO_ENDPOINT,
    appId: validatedEnvValue.VITE_LOG_TO_APP_ID,
    organizationId: validatedEnvValue.VITE_ORGANIZATION_ID,
    resources: [validatedEnvValue.VITE_SERVER_URL],
    scopes: [
      UserScope.Email,
      UserScope.Profile,
      UserScope.Identities,
      UserScope.Organizations,
    ]
  }
}
