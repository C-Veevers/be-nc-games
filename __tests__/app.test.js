const db = require('../db');
const app = require("../app");
const testData = require('../db/data/test-data/');
const seed = require('../db/seeds/seed');
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/API', () => {
    describe("attempted to reach an invalid endpoint", () => {
        test("status 404 and message ", () => {
            return request(app)
                .get("/invalid_url")
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe("Invalid URL");
                });
        });
    });
    describe("attempted to reach the api endpoint", () => {
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
describe('API/CATEGORIES', () => {
    describe('Get Categories', () => {
        test('Status 200: Returns object', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.categories).toBe("object")
                })
        });
        test('Status 200: Returned Items have required keys', () => {
            const keys = ['slug', 'description']
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(res => {
                    res.body.categories.forEach(result => {
                        expect(Object.keys(result)).toEqual(keys)
                    })
                })
        });
        test('status 200: returned all categories', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(res => {
                    expect(res.body.categories.length).toBe(4);
                })
        });
    });
});
describe('API/REVIEWS', () => {
    describe('Get Reviews', () => {
        const keys = [
            'owner', 'title', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'comment_count'
        ]
        test('status 200: returns an object', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.reviews).toBe("object")
                })
        });
        test("status 200: returns reviews in order of date", () => {
            return request(app)
                .get("/api/reviews?sort_by=created_at")
                .expect(200)
                .then((res) => {
                    expect(res.body.reviews).toBeSortedBy('created_at')
                });
        });
        test("status 200: returns reviews in order of date Descending ", () => {
            return request(app)
                .get("/api/reviews?order=DESC")
                .expect(200)
                .then((res) => {
                    expect(res.body.reviews).toBeSortedBy('created_at', { descending: true })
                });
        });
        test("status 200: returns reviews for chosen category", () => {
            return request(app)
                .get("/api/reviews?category=children's games")
                .expect(200)
                .then((res) => {
                    res.body.reviews.forEach(review => {
                        expect(review.category).toBe("children's games")
                    })

                });
        });
        test('status 200: returned items have all keys', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(res => {
                    res.body.reviews.forEach(result => {
                        expect(Object.keys(result)).toEqual(keys)
                    })
                })
        });
        test('status 200: returned items have all reviews', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(res => {
                    expect(res.body.reviews.length).toBe(13);
                })
        });
    });
    describe('Get Reviews By Id', () => {
        test('status 200: returns an object', () => {
            return request(app)
                .get('/api/reviews/3')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.review).toBe("object")
                })
        });
        test('status 200: returns object with correct ID', () => {
            return request(app)
                .get('/api/reviews/3')
                .expect(200)
                .then(res => {
                    expect(res.body.review[0].review_id).toBe(3)
                })
        });
        test('status 404: returns "Review Not Found" when id is not found in table', () => {
            return request(app)
                .get('/api/reviews/14')
                .expect(404)
                .then(res => {
                    expect(res.body.msg).toBe("Not Found")
                })
        });
        test('status 400: returns "Bad Request" when id is not valid', () => {
            return request(app)
                .get('/api/reviews/a')
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
    });
    describe('Patch review by ID', () => {
        test('status 200: returns an object', () => {
            const update = {
                inc_votes: 0
            }
            return request(app)
                .patch('/api/reviews/3')
                .send(update)
                .expect(200)
                .then(res => {
                    expect(typeof res.body.review).toEqual("object")
                })
        });
        test('status 200: inc votes of 3 by 0 - votes = 5', () => {
            const update = {
                inc_votes: 0
            }
            return request(app)
                .patch('/api/reviews/3')
                .send(update)
                .expect(200)
                .then(res => {
                    expect(res.body.review.votes).toBe(5)
                })
        });
        test('status 200: inc votes of 3 by 1 - votes = 6', () => {
            const update = {
                inc_votes: 1
            }
            return request(app)
                .patch('/api/reviews/3')
                .send(update)
                .expect(200)
                .then(res => {
                    expect(res.body.review.votes).toBe(6)
                })
        });
        test('status 200: inc votes of 3 by -1 - votes = 4', () => {
            const update = {
                inc_votes: -1
            }
            return request(app)
                .patch('/api/reviews/3')
                .send(update)
                .expect(200)
                .then(res => {
                    expect(res.body.review.votes).toBe(4)
                })
        });
    });
});
