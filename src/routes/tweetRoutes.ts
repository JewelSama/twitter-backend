import { Router } from "express";
import { PrismaClient } from "@prisma/client"

const router = Router();
const prisma = new PrismaClient()


//Tweet end Points
//create Tweet
router.post('/', async(req, res) => {
    const { content, image, userId } = req.body
    try {
        const result = await prisma.tweet.create({
            data: {
                content,
                image,
                userId, //based on the authenticated User
            }
        })
        res.status(201).json(result)
        
    } catch (error) {
        res.status(400).json({error: 'Tweet could not be created'})  
              
    }
})

//list Tweets

router.get('/', async(req, res) => {

    try {
        const allTweets = await prisma.tweet.findMany();
        res.status(200).json(allTweets);
    } catch (error) {
        res.status(400).json({error: 'Could not Fetch all tweets'})
    }
})

//get One Tweet

router.get('/:id', async(req, res) => {
    const { id } = req.params
    const result = await prisma.tweet.findUnique({ where: { id: Number(id) } })

    if(!result){
        return res.status(404).json({error: `Tweet not found`})
    }
    res.json(result).status(200)
})


//Update Tweet

router.put('/:id', (req, res) => {
    const { id } = req.params
    res.status(501).json({error: `Not implemented ${id}`})
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params
    await prisma.tweet.delete({ where: { id: Number(id) } })
    res.sendStatus(200)
})




export default router;