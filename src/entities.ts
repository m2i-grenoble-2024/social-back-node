export interface User {
    id?:number;
    email:string;
    username:string;
    password?:string;
    role?:string;
}

export interface Post {
    id?:number;
    content:string;
    author?:User;
    postedAt?:Date|string;
}