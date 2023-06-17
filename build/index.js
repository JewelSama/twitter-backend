"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authmiddleware_1 = require("./middlewares/authmiddleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/user', authmiddleware_1.authenticateToken, userRoutes_1.default);
app.use('/tweet', authmiddleware_1.authenticateToken, tweetRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello World from Sama!!!!!');
});
app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});
