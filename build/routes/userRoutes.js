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
//create User
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email } = req.body;
    try {
        const result = yield prisma.user.create({
            data: {
                name,
                username,
                email,
                bio: "Hello i'm new to Twitter!"
            }
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: "Username And Email should be unique" });
    }
}));
//list Users
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield prisma.user.findMany({
    // select: { id: true, name: true, image: true } //get only those fields
    });
    res.status(200).json(allUser);
}));
//get One user and his/her tweets
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: { id: Number(id) },
        include: { tweets: true }
    });
    res.status(200).json(user);
}));
//Update User
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { bio, name, image } = req.body;
    try {
        const result = yield prisma.user.update({
            where: { id: Number(id) },
            data: { bio, name, image }
        });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update the user' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.user.delete({
            where: { id: Number(id) }
        });
        res.sendStatus(200);
    }
    catch (error) {
        res.status(400).json({ error: `Could not be deleted` });
    }
}));
exports.default = router;
