import { createPool } from "mysql2/promise";


export const connection = createPool(process.env.DATABASE_URL)