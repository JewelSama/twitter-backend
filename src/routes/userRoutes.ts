import { Router } from "express";
import {PrismaClient} from "@prisma/client"


const router = Router();
const prisma = new PrismaClient()

//create User
router.post('/', async(req, res) => {
    const { name, username, email } = req.body
    
    try {
        const result = await prisma.user.create({
            data: {
                name,
                username,
                email,
                bio: "Hello i'm new to Twitter!"
            }
        })
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({ error: "Username And Email should be unique" })
    }

})

//list Users

router.get('/', async(req, res) => {
    const allUser = await prisma.user.findMany();
    res.status(200).json(allUser)
})

//get One user

router.get('/:id', async(req, res) => {
    const { id } = req.params
    const user = await prisma.user.findUnique( { where: { id: Number(id) } } )
    res.status(200).json(user)
})


//Update User

router.put('/:id', async(req, res) => {
    const { id } = req.params
    const { bio, name, image } = req.body
    try {
        const result = await prisma.user.update({
            where: { id: Number(id) },
            data: { bio, name, image }
        })
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({error: 'Failed to update the user'})        
    }
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params

    try {
        await prisma.user.delete({
            where: { id: Number(id) }
        })
        res.sendStatus(200)
    } catch (error) {
        res.status(400).json({error: `Could not be deleted`})
    }
})




export default router;