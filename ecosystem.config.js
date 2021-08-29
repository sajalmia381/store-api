module.exports = {
  apps : [
    {
      name: 'store-api',
      script: 'src/app.ts',
      watch: '.',
      max_memory_restart: "256M",
      exec_mode: "cluster",
      "env": {
        APP_PORT: 8000,
        APP_HOST: "localhost",
        DB_URL: "mongodb://localhost:27017/store-api",
        DEBUG_MODE: false,
        NODE_ENV: "production",
        SECRET_KEY: "ipfhUCFRZ4fce7GWaatUZMQbQ655sygRq0KUATOUX4VB1RFjaUtl6lfKmlP4AHg8",
        REFRESH_KEY: "ipfhUCFRZ4fce7GWaatUZMQbQ655sygRq0KUATOUX4VB1RFjaUtl6lfKmlP4AHg8",
      }
    }
  ],
};
