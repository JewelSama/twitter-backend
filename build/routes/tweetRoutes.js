"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
//Tweet end Points
//create Tweet
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    //@ts-ignore
    const user = req.user;
    // console.log(user)
    try {
        const result = yield prisma.tweet.create({
            data: {
                content,
                image,
                userId: user.id //based on the authenticated User
            }
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Tweet could not be created' });
        console.log(error);
    }
}));
//list Tweets
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const allTweets = await prisma.tweet.findMany({ include: { user: true } });
        const allTweets = yield prisma.tweet.findMany({
            include: { user: { select: {
                        id: true, name: true, username: true, image: true
                    } } },
        });
        res.status(200).json(allTweets);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not Fetch all tweets' });
    }
}));
//get One Tweet
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield prisma.tweet.findUnique({
        where: { id: Number(id) },
        include: { user: true }
    });
    if (!result) {
        return res.status(404).json({ error: `Tweet not found` });
    }
    res.json(result).status(200);
}));
//Update Tweet
router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `Not implemented ${id}` });
});
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.tweet.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
}));
exports.default = router;
