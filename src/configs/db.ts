import { Sequelize } from 'sequelize';
import env from './env';
import session from "express-session"
import SequelizeStore from 'connect-session-sequelize';
  const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME,env.DATABASE_PASSWORD, {
    host: env.DATABASE_HOST,
    dialect: "mysql",
 });

 export const SequelizeSessionStore = SequelizeStore(session.Store);
 export default  sequelize;
