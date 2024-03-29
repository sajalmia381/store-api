module.exports = {
  apps : [
    {
      name: 'store-api',
      script: './src/app.ts',
      watch: '.',
      max_memory_restart: "512M",
      exec_mode: "cluster",
      interpreter: './node_modules/.bin/ts-node',
      interpreter_args: '--require tsconfig-paths/register',
      node_args: '--require ts-node/register',
      env: {
        APP_PORT: 8000,
        APP_HOST: "localhost",
        DB_URL: "mongodb://localhost:27017/store-api",
        DEBUG_MODE: false,
        NODE_ENV: "production",
        SECRET_KEY: "V23MHHqqzK2mkERkUGouR0ILxeIf5zZEzyaHFaRKmDE0CbhV7TudpBFS9o5r9Mlq",
        REFRESH_KEY: "ipfhUCFRZ4fce7GWaatUZMQbQ655sygRq0KUATOUX4VB1RFjaUtl6lfKmlP4AHg8",
      }
    }
  ],
};
