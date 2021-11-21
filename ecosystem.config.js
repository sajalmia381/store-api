module.exports = {
  apps : [
    {
      name: 'store-api',
      script: './src/app.ts',
      watch: '.',
      max_memory_restart: "256M",
      exec_mode: "cluster",
      interpreter: './node_modules/.bin/ts-node',
      interpreter_args: '--require ts-node/register --require tsconfig-paths/register',
      // node_args: '-r tsconfig-paths/register',
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
  ],
};
