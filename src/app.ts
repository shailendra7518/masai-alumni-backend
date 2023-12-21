import express from "express";
import http from "http";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import passport from "passport";
import env from "@configs/env";
import sequelize, { SequelizeSessionStore } from "@configs/db";
import { Routes } from "@interfaces/routes.interface";
import { registerSocketServer } from "../src/socket/socketServer";
import passportConfig from "./configs/passport";
import errorMiddleware from "@middlewares/error.middleware";

class App {
	public app: express.Application;
	public env: string;
	public port: string | number;
	private server: http.Server;

	constructor(routes: Routes[]) {
		this.app = express();
		this.env = env.NODE_ENV || "development";
		this.port = env.PORT || 3000;
		this.server = http.createServer(this.app);
		// this.io = new SocketIOServer(this.server);

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
		this.initializeSocketIO();
	}

	public listen() {
		this.server.listen(this.port, () => {
			console.log(`App listening on the port ${this.port}`);
		});
	}

	private connectToDatabase() {
		sequelize
			.authenticate()
			.then(() => {
				console.log("Connection has been established successfully.");
				sequelize.sync();
			})
			.catch((error) => {
				console.error("Unable to connect to the database: ", error);
			});
	}

	private initializeRoutes(routes: Routes[]) {
		this.app.get("/", (req, res) => {
			console.log(req.headers);
			res.send("hello from server");
		});
		routes.forEach((route) => {
			this.app.use("/api/v1", route.router);
		});
	}

	private initializeMiddlewares() {
		this.setupCORS();
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(express.json({ limit: "1mb" }));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser(env.COOKIE_SECRET));

		passportConfig(passport);

		// const SequelizeSessionStore = SequelizeStore(session.Store);

		// console.log(new SequelizeSessionStore({
		// 	db: sequelize,
		// }).sessionModel)
		const sessionMiddleware = session({
			name: env.AUTH_COOKIE_NAME,
			secret: env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			store: new SequelizeSessionStore({
				db: sequelize,
			}),
			cookie: {
				domain: env.COOKIE_DOMAIN,
				maxAge: 1000 * 60 * 60 * 24 * 30,
				secure: env.NODE_ENV === "production",
				httpOnly: true,
				sameSite: "lax",
			},
		});

		this.app.set("sessionMiddleware", sessionMiddleware);

		this.app.use(sessionMiddleware);

		this.app.use(passport.initialize());
		this.app.use(passport.session());
	}

	private setupCORS() {
		const origins: (boolean | string | RegExp)[] = [];
		if (["development"].includes(env.NODE_ENV)) {
			origins.push(`/localhost:/`);
			origins.push("http://localhost:5173");
			origins.push("http://localhost:3000");
		}
		const corsOrigins = env.CORS_ORIGINS.split(",");
		if (corsOrigins.length > 0) {
			origins.push(
				...corsOrigins.map((corsOrigin) => {
					return corsOrigin.trim();
				}),
			);
		}
		console.log(origins);
		const corsOptions = {
			origin: origins,
			methods: ["GET", "POST", `PUT`, `PATCH`, `DELETE`],
			credentials: true,
		};

		this.app.use(cors(corsOptions));
	}
	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	private initializeSocketIO() {
		registerSocketServer(this.app, this.server);
	}
}

export default App;
