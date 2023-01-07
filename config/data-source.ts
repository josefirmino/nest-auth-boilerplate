import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '45.151.120.2',
  port: 3306,
  username: 'u756206351_nestjauth',
  password: 'M3DRVw$2i5^',
  database: 'u756206351_nestjauth',
  synchronize: true,
  logging: true,
  entities: [__dirname + '/**/*.entity{.js,.ts}'],
  subscribers: [],
  migrations: ['dist/migrations/**/*{.ts,.js}'],
});
