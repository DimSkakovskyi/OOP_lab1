/// <reference types="node" />
require("dotenv/config");
const { defineConfig, env } = require("prisma/config");

export = defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});