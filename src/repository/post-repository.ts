import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Post } from "../entities";
import { connection } from "./database";


export async function findAllPosts() {
    const [rows] = await connection.query<RowDataPacket[]>('SELECT *, post.id post_id FROM post INNER JOIN user ON post.author_id=user.id');
    const list:Post[] = [];
    for(const line of rows) {
        list.push({
            id: line['post_id'],
            content: line['content'],
            postedAt: new Date(line['posted_at']),
            author: {
                id: line['author_id'],
                username: line['username'],
                email: line['email']
            }
        })
    }
    return list;
}

export async function persistPost(post:Post) {
    const [rows] = await connection.query<ResultSetHeader>('INSERT INTO post (content,author_id,posted_at) VALUES (?,?,?)', [
        post.content, post.author.id, post.postedAt
    ]);
    post.id = rows.insertId;
}