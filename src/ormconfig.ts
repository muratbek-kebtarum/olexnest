import {DataSource, DataSourceOptions} from "typeorm";
import * as dotenv from 'dotenv'
import { TagEntity } from 'src/tag/tag.entity';

dotenv.config()

export const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port:  +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: ['./src/migrations/*.ts'],
    migrationsTableName: "migration"
};
const dataSource = new DataSource(config)
export default dataSource;