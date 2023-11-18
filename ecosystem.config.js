const argEnvIndex = process.argv.indexOf("--env");
let argEnv = (argEnvIndex !== -1 && process.argv[argEnvIndex + 1]) || "";

const RUN_ENV_MAP = {
  local: {
    instances: 2,
    max_memory_restart: "250M",
  },
  dev: {
    instances: 2,
    max_memory_restart: "250M",
  },
  prod: {
    instances: 4,
    max_memory_restart: "1000M",
  },
};

if (!(argEnv in RUN_ENV_MAP)) {
  argEnv = "prod";
}

module.exports = {
  apps: [
    {
      name: "accounting-frontend",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      env_local: {
        APP_ENV: "local", // APP_ENV=local
      },
      env_development: {
        APP_ENV: "dev", // APP_ENV=dev
      },
      env_production: {
        APP_ENV: "prod", // APP_ENV=prod
      },
    },
  ],
};
