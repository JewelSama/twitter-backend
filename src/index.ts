import express from 'express'
import userRoutes from './routes/userRoutes'

const app = express()
app.use(express.json())


app.use('/user', userRoutes)


app.get('/', (req, res) => {
    res.send('Hello World')
})





app.listen(5000, () => {
    console.log(`Server running on port 5000`)
})