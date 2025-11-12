import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  APP_PORT: z
    .string()
    .regex(/^[0-9]+$/)
    .transform((value) => parseInt(value))
    .default(3000),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL string"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

const env = envSchema.parse(process.env);

export default env;