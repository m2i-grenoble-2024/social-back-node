import { ResultSetHeader } from "mysql2";
import { User } from "../entities";
import { connection } from "./database";



export async function persistUser(user:User) {
    const [rows] = await connection.query<ResultSetHeader>('INSERT INTO user (email,username,password,role,created_at) VALUES (?,?,?,?,?)', [
        user.email,user.username,user.password,user.role,new Date()
    ]);
    user.id = rows.insertId;
}

export async function findUserByIdentifier(identifier:string):Promise<User|null> {
    const [rows] = await connection.query('SELECT * FROM user WHERE email=? OR username=?', [identifier, identifier]);
    const line = rows[0];
    if(line) {
        return {
            id: line['id'],
            email: line['email'],
            password: line['password'],
            username:line['username'],
            role:line['role']
        }
    }
    return null;
    
    
}