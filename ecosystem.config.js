module.exports = {
  apps : [
    {
      script: 'src/app.ts',
      watch: '.',
      "env": {
        APP_PORT: 8000,
        APP_HOST: "localhost",
        DB_URL: "mongodb://localhost:27017/store-api",
        DEBUG_MODE: false,
        NODE_ENV: "production",
        SECRET_KEY: "ipfhUCFRZ4fce7GWaatUZMQbQ655sygRq0KUATOUX4VB1RFjaUtl6lfKmlP4AHg8",
        REFRESH_KEY: "ipfhUCFRZ4fce7GWaatUZMQbQ655sygRq0KUATOUX4VB1RFjaUtl6lfKmlP4AHg8",
      }
    },
    {
      "extends": "../tsconfig.json"
    } 
    // {
    //   script: './service-worker/',
    //   watch: ['./service-worker']
    // }
  ],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
