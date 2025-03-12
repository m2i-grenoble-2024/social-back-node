import { Post } from "../../src/entities";
import { connection } from "../../src/repository/database";
import { deletePost, findAllPosts, persistPost } from "../../src/repository/post-repository"

describe('Test post repository', () => {

    //Lancer une transaction avant le test pour...
    beforeEach(async () => {
        await connection.query('START TRANSACTION');
    });

    //...rollback celle ci afin de remettre la base de données dans son état d'origine après chaque test
    afterEach(async ()=> {
        await connection.query('ROLLBACK');
    })
    

    it('should retrieve all posts', async () => {
        const posts = await findAllPosts();

        expect(posts.length).toBe(15);

        //On peut tester un objet précis avec des valeurs (ou des expect.any(...) et le type)
        const first = posts[0];
        expect(first.id).toBe(1);
        expect(first.content).toBe('test post');
        expect(first.author.id).toBe(1);

        //Ou même tester tout le tableau de retour si tous les objets ont la même structure
        expect(posts).toMatchObject(
            Array<Post>(15).fill({
                content: expect.any(String),
                id: expect.any(Number),
                author: {
                    id: expect.any(Number),
                    email: expect.any(String),
                    username: expect.any(String)
                },
                postedAt: expect.any(Date)
            })
        )
    })

    it('should persist a new post', async () => {
        const postTest:Post = {
            content: 'test',
            postedAt: new Date(),
            author: {
                id: 1,
                username: '',
                email: ''
            }
        }
        await persistPost(postTest);

        expect(postTest.id).toBeDefined();
    })

    it('should delete a post', async () => {
        const deleted = await deletePost(1);

        expect(deleted).toBeTruthy();

        
        const secondDelete = await deletePost(1);

        expect(secondDelete).toBeFalsy();
    })
})