import supertest from "supertest"
import { server } from "../../src/server"
import { connection } from "../../src/repository/database";
import { Post } from "../../src/entities";

describe('API Rest Post Routes /api/post', () => {
    beforeEach(async () => {
        await connection.query('START TRANSACTION');
    });
    afterEach(async () => {
        await connection.query('ROLLBACK');
    });

    it('should get all post', async () => {
        const request = supertest(server);

        const response = await request.get('/api/post')
            .expect(200);

        expect(response.body).toMatchObject(
            Array<Post>(15).fill({
                content: expect.any(String),
                id: expect.any(Number),
                author: {
                    id: expect.any(Number),
                    email: expect.any(String),
                    username: expect.any(String)
                },
                postedAt: expect.any(String)
            })
        )
    });


    it('should register a user', async () => {
        const request = supertest(server);

        const response = await request.post('/api/user')
        .send({
            email: 'from@test.com',
            password: 'bloup',
            username: 'blop'
        }).expect(201);

        expect(response.body.id).toBeDefined();
        
    })

    

    it('should not register a user with wrong values', async () => {
        const request = supertest(server);

        await request.post('/api/user')
        .send({
            email: 'pasunemail',
            username: 'blop'
        }).expect(400);
        
        
    })
    
    it('should not register an existing user', async () => {
        const request = supertest(server);

        await request.post('/api/user')
        .send({
            email: 'test@test.com',
            password: '1234',
            username: 'blop'
        }).expect(400);
        
    })

    it('should not post if not authentified', async () => {
        const request = supertest(server);

        await request.post('/api/post')
        .send({
            content:'test'
        }).expect(401);
        
    });

    

    it('should post if authentified', async () => {
        const request = supertest(server);

        const loginResponse = await request.post('/api/login')
        .send({username: 'test@test.com', password: '1234'})
        .expect(200);

        const jwt = loginResponse.body.token;

        await request.post('/api/post')
        .set('authorization', 'bearer '+jwt)
        .send({
            content:'test'
        }).expect(201);
        
    });
})