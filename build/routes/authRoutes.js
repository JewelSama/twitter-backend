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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const EMAIL_TOKEN_EXPIRATION_TIME = 10; //10mins
const AUTHENTICATION_EXPIRATION_HOURS = 12; //12hrs
const JWT_SECRET = process.env.JWT_SECRET || "Super Secret";
// Generate a random 8 digit number as the email token
function generateToken() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateAuthToken(tokenId) {
    const jwtpayload = { tokenId };
    return jsonwebtoken_1.default.sign(jwtpayload, JWT_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    });
}
// Create a user if it doesn't exist,
// Generate email token and send it to email
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    //generate token
    const emailToken = generateToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000); // *60---to secs *1000 --milliseconds
    // console.log(new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000))
    try {
        const createdToken = yield prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email }
                    }
                }
            }
        });
        // console.log(createdToken)
        // send EmailToken to users Token
        res.sendStatus(200);
    }
    catch (error) {
        res.status(400).json({ error: "Couldn't start the authentication process" });
        console.log(error);
    }
}));
//Validate the email token 
//Generate a long-lived JWT Token
router.post('/authenticate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, emailToken } = req.body;
    const dbEmailToken = yield prisma.token.findUnique({
        where: {
            emailToken
        },
        include: { user: true }
    });
    // console.log(dbEmailToken)
    if (!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401); //401 = unauthenticated
    }
    if (dbEmailToken.expiration < new Date()) {
        return res.status(401).json({ error: "Token expired!" });
    }
    if (((_a = dbEmailToken === null || dbEmailToken === void 0 ? void 0 : dbEmailToken.user) === null || _a === void 0 ? void 0 : _a.email) !== email) {
        return res.sendStatus(401);
    }
    //generate API Token 
    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000); // *60---to secs *1000 --milliseconds
    const apiToken = yield prisma.token.create({
        data: {
            type: "API",
            expiration,
            user: {
                connect: {
                    email,
                }
            }
        }
    });
    //Invalidate the Email token
    yield prisma.token.update({
        where: { id: dbEmailToken.id },
        data: { valid: false }
    });
    //Generate the JWT token
    const authToken = generateAuthToken(apiToken.id);
    res.json({ authToken });
}));
exports.default = router;
