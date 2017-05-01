module.exports = {
  apps : [{
    name      : 'sogy',
    script    : 'index.js',
    env       : {
      COMMON_VARIABLE: 'true'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      user : 'deploy',
      host : process.env.SERVER_HOST,
      ref  : 'origin/master',
      repo : 'git@github.com:kentork/sogy.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
