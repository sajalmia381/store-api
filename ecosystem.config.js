module.exports = {
  apps : [
    {
      script: 'src/app.ts',
      watch: '.',
      interpreter: "./node_modules/.bin/ts-node",
      interpreter_args: "--require tsconfig-paths/register",
      merge_logs: true,
      "env": {
        APP_PORT: 8000,
        APP_HOST: "localhost",
        DB_URL: "mongodb://localhost:27017/store-api",
        DEBUG_MODE: false,
        NODE_ENV: "production",
        SECRET_KEY: "!rad9TN`&B{!pg&Y($oTwOhYfEJ4{0sEBYtu]xqa2^8,Iyc^8HP[[XB,J$O)~BL",
        REFRESH_KEY: "hOS1|4NM.P#F^BA]JiIX^B0AS@JY+E20Zphjs2ER[}FMJXq3}1vH~iGrQPqtycv",
      }
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
