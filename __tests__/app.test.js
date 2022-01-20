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
        test("status: 200 returns a json with api instructions", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then((res) => {
                    expect(typeof res.body).toBe("object");
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
        test('status 400: if input is incorrect rejects with "Bad Request"', () => {
            const update = {
                inc_boats: -1
            }
            return request(app)
                .patch('/api/reviews/3')
                .send(update)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
    });
    describe('Get Comments By Review ID', () => {
        test('status 200: should return an object', () => {
            return request(app)
                .get('/api/reviews/3/comments')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.comments).toBe("object");
                })
        });
        test('status 200: object should have required keys', () => {
            const keys = ['comment_id', 'votes', 'created_at', 'author', 'body']
            return request(app)
                .get('/api/reviews/3/comments')
                .expect(200)
                .then(res => {
                    res.body.comments.forEach(result => {
                        expect(Object.keys(result)).toEqual(keys)
                    })
                })
        });
        test('status 404: Returns Not Found for id with no comments', () => {
            const keys = ['comment_id', 'votes', 'created_at', 'author', 'body']
            return request(app)
                .get('/api/reviews/4/comments')
                .expect(404)
                .then(res => {
                    expect(res.body.msg).toBe('Not Found')
                })
        });
    });
    describe('Post Comments By Review Id', () => {
        test('status 200: should return an object', () => {
            let updated = {
                username: "bainesface",
                body: "Something about things again"
            }
            return request(app)
                .post('/api/reviews/3/comments')
                .send(updated)
                .expect(200)
                .then(res => {
                    expect(typeof res.body.comment).toBe("object");
                })
        });
        test('status 200: should return the posted comment', () => {
            let updated = {
                username: "bainesface",
                body: "Something about things again"
            }
            return request(app)
                .post('/api/reviews/3/comments')
                .send(updated)
                .expect(200)
                .then(res => {
                    expect(res.body.comment[0].body).toBe("Something about things again");
                })
        });
        test('status 400: should return "Bad Request" for invalid user id', () => {
            let updated = {
                username: "bainesface2",
                body: "Something about things"
            }
            return request(app)
                .post('/api/reviews/3/comments')
                .send(updated)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request");
                })
        });
    });
});
describe('API/COMMENTS', () => {
    describe('Delete Comment', () => {
        test('status 200: should return an object', () => {
            return request(app)
                .delete('/api/comments/3')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.comment).toBe("object");
                })
        })
        test('status 200: object should be the requested deleted comment', () => {
            return request(app)
                .delete('/api/comments/3')
                .expect(200)
                .then(res => {
                    expect(res.body.comment[0]).toEqual({
                        "author": "philippaclaire9",
                        "body": "I didn't know dogs could play games",
                        "comment_id": 3,
                        "created_at": "2021-01-18T10:09:48.110Z",
                        "review_id": 3,
                        "votes": 10
                    });
                })
        })
        test('status 200 & 204: object should not exist in the db once deleted', () => {
            return request(app)
                .delete('/api/comments/3')
                .expect(200)
                .then(res => {
                    return request(app)
                        .get('/api/comments/3')
                        .expect(204)
                })
        })
    });
});
describe('API/USERS', () => {
    describe('Get List of Users', () => {
        test('status 200: returns an object', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.users).toBe("object");
                })
        })
        test('status 200: object has valid keys', () => {
            let keys = ["username"]
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(res => {
                    res.body.users.forEach(result => {
                        expect(Object.keys(result)).toEqual(keys)
                    })
                })
        })
        test('status 200: returns the correct number of users (4)', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(res => {
                    expect(res.body.users.length).toBe(4);
                })
        })
    });
    describe('Get User by username', () => {
        test('status 200: should return an object', () => {
            return request(app)
                .get('/api/users/philippaclaire9')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.user).toBe("object");
                })
        });
        test('status 200: object has valid keys', () => {
            let keys = ["username", "avatar_url", "name"]
            return request(app)
                .get('/api/users/philippaclaire9')
                .expect(200)
                .then(res => {
                    res.body.user.forEach(result => {
                        expect(Object.keys(result)).toEqual(keys)
                    })
                })
        })
        test('status 200: returns the correct number of users (1)', () => {
            return request(app)
                .get('/api/users/philippaclaire9')
                .expect(200)
                .then(res => {
                    expect(res.body.user.length).toBe(1);
                })
        })
        test('status 404: should reject invalid username with "Not Found', () => {
            return request(app)
                .get('/api/users/philippaclaire91')
                .expect(404)
                .then(res => {
                    expect(res.body.msg).toBe("Not Found");
                })
        });
    });
});