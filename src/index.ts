import express from 'express'
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/user', userRoutes)
app.use('/tweet', tweetRoutes)

app.get('/', (req, res) => {
    res.send('Hello World')
})





app.listen(5000, () => {
    console.log(`Server running on port 5000`)
})