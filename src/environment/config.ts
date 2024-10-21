import dotenv from 'dotenv';
// Constants for default values
const DEFAULT_PORT = 4000;
const DEFAULT_MONGO_URI = "mongodb://localhost:27017/mpl";
const DEFAULT_JWT_SECRET = "development-secret";
const DEFAULT_REDIS_URL = "redis://127.0.0.1:6379";
const DEFAULT_SESSION_SECRET = "your_session_secret"


dotenv.config();

// Custom ConfigError class
class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

// Define a config object to handle environment variables and defaults
const config = (() => {
  let instance: any;

  return (() => {
    if (instance) {
      return instance;
    }

    instance = {
      envVars: process.env,

      // Initialize environment and configurations
      init: function (env = process.env.NODE_ENV || "development") {
        try {
          console.log(`Loading configuration for ${env} environment.`);
          this.envVars = process.env;
        } catch (error) {
          console.error("Error loading environment variables:", error);
        }
      },

      // Method to get environment variable
      get: function (varName: string, defaultValue: string | number = ""): string | number {
        try {
          const value = this.envVars[varName];
          if (!value && !defaultValue) {
            throw new ConfigError(
              `Environment variable ${varName} is not defined.`
            );
          }
          return value || defaultValue;
        } catch (error) {
          console.error(
            `Error getting environment variable ${varName}:`,
            error
          );
          return defaultValue;
        }
      },

      // Specific methods for frequently accessed config variables
      getPort: function (): number {
        return Number(this.get("PORT", DEFAULT_PORT));
      },
      getMongoUri: function (): string {
        return String(this.get("MONGO_URI", DEFAULT_MONGO_URI));
      },
      getJwtSecret: function (): string {
        return String(this.get("JWT_SECRET", DEFAULT_JWT_SECRET));
      },
      getRedisUrl: function (): string {
        return String(this.get("REDIS_URL", DEFAULT_REDIS_URL));
      },
      getSessionSecret: function (): string {
        return String(this.get("SESSION_SECRET", DEFAULT_SESSION_SECRET));
      },
    };

    instance.init();
    return instance;
  })();
})();

// Export the configuration values
export const PORT = config.getPort();
export const REDIS_URL = config.getRedisUrl();
export const MONGO_URI = config.getMongoUri();
export const JWT_SECRET = config.getJwtSecret();
export const SESSION_SECRET = config.getSessionSecret()
