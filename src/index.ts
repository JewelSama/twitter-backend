import express from 'express'
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes'
import authRoutes from './routes/authRoutes'
import { authenticateToken } from './middlewares/authmiddleware'
import dotenv from "dotenv"

dotenv.config()
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use('/user', authenticateToken, userRoutes)
app.use('/tweet', authenticateToken, tweetRoutes)
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World')
})





app.listen(5000, () => {
    console.log(`Server running on port 5000`)
})