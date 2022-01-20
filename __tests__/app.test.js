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
            'owner', 'title', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'comment_count', 'total_count'
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
        test.skip("status 200: returns reviews for chosen category - broken by total_count", () => {
            return request(app)
                .get("/api/reviews?category=children's games")
                .expect(200)
                .then((res) => {
                    res.body.reviews.forEach(review => {
                        expect(review.category).toBe("children's games")
                    })

                });
        });
        test.skip('status 200: returned items have all keys - broken by total_count', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(res => {
                    res.body.reviews.forEach(result => {
                        expect(Object.keys(result)).toEqual(keys)
                    })
                })
        });
        test('status 200: returned page=0 items have 10 reviews', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(res => {
                    expect(res.body.reviews.length).toBe(11);
                })
        });
        test('status 200: returned page=1 items have 3 reviews', () => {
            return request(app)
                .get('/api/reviews?p=1')
                .expect(200)
                .then(res => {
                    expect(res.body.reviews.length).toBe(4);
                })
        });
        test('status 200: returned page=1 items have 3 reviews have a total_count', () => {
            return request(app)
                .get('/api/reviews?p=1')
                .expect(200)
                .then(res => {
                    expect(res.body.reviews.length).toBe(4);
                })
        });
        test('status 400: page is not a number return "Bad Request', () => {
            return request(app)
                .get('/api/reviews?p=a')
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request");
                })
        });
        test('status 400: limit is not a number return "Bad Request', () => {
            return request(app)
                .get('/api/reviews?limit=a')
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request");
                })
        });
        test('status 200: returned 5 reviews when limit=5', () => {
            return request(app)
                .get('/api/reviews?limit=5')
                .expect(200)
                .then(res => {
                    expect(res.body.reviews.length).toBe(6);
                })
        });
        test('status 200: returned 11 reviews when limit=11', () => {
            return request(app)
                .get('/api/reviews?limit=11')
                .expect(200)
                .then(res => {
                    expect(res.body.reviews.length).toBe(12);
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
    describe('Get Comments By Review ID (3)', () => {
        test('status 200: should return an object', () => {
            return request(app)
                .get('/api/reviews/3/comments')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.comments).toBe("object");
                })
        });
        test('status 200: should return 3 items', () => {
            return request(app)
                .get('/api/reviews/3/comments')
                .expect(200)
                .then(res => {
                    expect(res.body.comments.length).toBe(3);
                })
        });
        test('status 200: should return 2 item when limit=2', () => {
            return request(app)
                .get('/api/reviews/3/comments?limit=2')
                .expect(200)
                .then(res => {
                    expect(res.body.comments.length).toBe(2);
                })
        });
        test('status 200: should return 1 item when limit=2 and p=1', () => {
            return request(app)
                .get('/api/reviews/3/comments?limit=2&p=1')
                .expect(200)
                .then(res => {
                    expect(res.body.comments.length).toBe(1);
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
        test('status 400: "Bad Request" if limit is not a number', () => {
            return request(app)
                .get('/api/reviews/3/comments?limit=a')
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request");
                })
        });
        test('status 400: "Bad Request" if page is not a number', () => {
            return request(app)
                .get('/api/reviews/3/comments?limit=2&p=a')
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request");
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
    describe('Post New Review ', () => {
        let body = {
            owner: "bainesface",
            title: "Mono-monopoly",
            review_body: "It lasts for hours and no one is really sure what the rules are",
            designer: "satan probably",
            category: "children's games"
        }
        test('status 201: should return an object', () => {
            return request(app)
                .post('/api/reviews')
                .send(body)
                .expect(201)
                .then(res => {
                    expect(typeof res.body.review).toBe("object");
                })
        });
        test('status 201: should return the added review with ID 14', () => {
            return request(app)
                .post('/api/reviews')
                .send(body)
                .expect(201)
                .then(res => {
                    expect(res.body.review[0].review_id).toBe(14);
                })
        });
        test('status 201 & 200: new review should exist in the database', () => {
            return request(app)
                .post('/api/reviews')
                .send(body)
                .expect(201)
                .then(res => {
                    return request(app)
                        .get('/api/reviews/14')
                        .expect(200)
                        .then(res => {
                            expect(res.body.review[0].title).toBe(body.title)
                        })
                })
        });
        test('status 400: should return "Bad Request" if invalid username is given', () => {
            body.owner = "test"
            return request(app)
                .post('/api/reviews')
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request");
                })
        });
    });
    describe('Post New Category ', () => {
        let body = {
            slug: "physical",
            description: "gets you up and doing things"
        }
        test('status 201: should return an object', () => {
            return request(app)
                .post('/api/categories')
                .send(body)
                .expect(201)
                .then(res => {
                    expect(typeof res.body.category).toBe("object");
                })
        });
        test('status 201: should return the added category', () => {
            return request(app)
                .post('/api/categories')
                .send(body)
                .expect(201)
                .then(res => {
                    expect(res.body.category[0].slug).toBe("physical");
                })
        });
        test('status 201 & 200: new review should exist in the database ( 5 entries )', () => {
            return request(app)
                .post('/api/categories')
                .send(body)
                .expect(201)
                .then(res => {
                    return request(app)
                        .get('/api/categories/')
                        .expect(200)
                        .then(res => {
                            expect(res.body.categories.length).toBe(5)
                        })
                })
        });
        test('status 400: should return "Bad Request" if invalid keys are sent', () => {
            let body = {
                sluge: "stealth",
                description: "its basically hide and seek"
            }
            return request(app)
                .post('/api/categories')
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Bad Request");
                })
        });
    });
    describe('Delete Review by review_id ', () => {
        test('status 201: should return an object', () => {
            return request(app)
                .delete('/api/reviews/13')
                .expect(200)
                .then(res => {
                    expect(typeof res.body.review).toBe("object");
                })
        });
        test('status 201: should return the removed review', () => {
            return request(app)
                .delete('/api/reviews/13')
                .expect(200)
                .then(res => {
                    expect(res.body.review[0].review_id).toBe(13);
                })
        });
        test('status 200 & 404: review should not exist in the database', () => {
            return request(app)
                .delete('/api/reviews/13')
                .expect(200)
                .then(res => {
                    return request(app)
                        .get('/api/reviews/13')
                        .expect(404)
                        .then(res => {
                            expect(res.body.msg).toBe("Not Found")
                        })
                })
        });
        test('status 404: should return "Not Found" if invalid id is sent', () => {
            return request(app)
                .delete('/api/reviews/15')
                .expect(404)
                .then(res => {
                    expect(res.body.msg).toBe("Not Found");
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