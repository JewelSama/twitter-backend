import { Router } from "express";

const router = Router();


//user end Points
//create User
router.post('/', (req, res) => {
    res.status(501).json({error: 'Not implemented'})
})

//list Users

router.get('/', (req, res) => {
    res.status(501).json({error: 'Not implemented'})
})

//get One user

router.get('/:id', (req, res) => {
    const { id } = req.params
    res.status(501).json({error: `Not implemented ${id}`})
})


//Update User

router.put('/:id', (req, res) => {
    const { id } = req.params
    res.status(501).json({error: `Not implemented ${id}`})
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.status(501).json({error: `Not implemented ${id}`})
})




export default router;