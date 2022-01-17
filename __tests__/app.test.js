const db = require('../db');
const app = require("../app");
const testData = require('../db/data/test-data/');
const seed = require('../db/seeds/seed');
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/API', () => {
    describe("invalid URL", () => {
        test("status 404 and message ", () => {
            return request(app)
                .get("/invalid_url")
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe("Invalid URL");
                });
        });
    });
    describe("/api", () => {
        test("status: 200 and returns a welcome message", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then((res) => {
                    expect(res.body.msg).toBe("Welcome to the API");
                });
        });
    });
});

describe('API/REVIEWS', () => {
    describe('Get Reviews', () => {
        const keys = [
            'review_id', 'title', 'review_body',
            'designer','review_img_url', 'votes', 
            'category', 'owner', 'created_at'
        ]
        test('status 200:  returns an object', () => {
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(res => {
                expect(typeof res.body.msg).toBe("object")
            })
        });
        test('status 200: returned items have all keys', () => {
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(res => {
                res.body.msg.forEach(result =>{
                    expect(Object.keys(result)).toEqual(keys)
                })
            })
        });
    });
});
    