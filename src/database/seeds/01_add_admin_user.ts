import { Knex } from "knex";
import * as bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();

    const saltRounds = 10;
    const adminPassword = "password"; 
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    await knex("users").insert([
        {
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        }
    ]);
};
