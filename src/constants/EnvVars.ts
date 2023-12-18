/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */


export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? "0"),
  JwtSecret: (process.env.JWT_SECRET ?? ""),
  ApiHost: (process.env.API_HOST ?? ""),
  AdminUsername: (process.env.ADMIN_USERNAME ?? ""),
  AdminPassword: (process.env.ADMIN_PASSWORD ?? "")
} as const;
