import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const envs = [
  'PORT',
  'POSTGRES_URI',
  'MAILER_HOST',
  'MAILER_LOGIN',
  'MAILER_PASS',
  'JWT_SECRET',
];

export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (environmentVariables: EnvironmentVariable) => {
  return {
    apiSettings: {
      PORT: environmentVariables.PORT,
    },

    throttlerConfig: {
      ttl: 10000,
      limit: 500000000,
    },

    typeOrmConfig: {
      url: environmentVariables.POSTGRES_URI,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    },

    mailerConfig: {
      transport: {
        host: environmentVariables.MAILER_HOST,
        secure: true,
        port: 465,
        auth: {
          user: environmentVariables.MAILER_LOGIN,
          pass: environmentVariables.MAILER_PASS,
        },
      },
      defaults: {
        from: `"BloggerPlatform" <${environmentVariables.MAILER_LOGIN}>`,
      },
      template: {
        dir: process.cwd() + '/src/common/mailer/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    },

    jwtConfig: {
      global: true,
      secret: environmentVariables.JWT_SECRET,
    },

    jwtTime: {
      refresh: 20,
      access: 10000000000, //default: 10
    },
  };
};

export default () => {
  const environmentVariables = process.env as EnvironmentVariable;

  console.log('Getting ENV...');

  const errs = [];

  envs.forEach((env) => {
    const newEnv = environmentVariables[env];
    if (!newEnv) errs.push(env);
  });

  if (errs.length !== 0)
    throw new Error(
      'Wrong .env file data. Please, check it. Missing data: ' + errs.join(' '),
    );

  return getConfig(environmentVariables);
};
