import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "src/app.module";

// import { YourModule } from "./src/YourModule";

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create(AppModule, new FastifyAdapter());
    // app.setGlobalPrefix("api");
    // app.enableVersioning({
    //     type: VersioningType.URI,
    //     prefix: "v",
    // })
    return app;
  },
  swagger: {
    output: "./swagger.json",
    beautify: true,
    security: { // TODO: check here to fix: can not add "Bearer" in to token
      bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    servers: [
      {
        url: "https://ysp-api.vs-blog.tech",
        description: "Local Server",
      },
    ],
  },
};
export default NESTIA_CONFIG;