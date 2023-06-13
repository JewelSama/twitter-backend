import { Router } from "express";

const router = Router();


//Tweet end Points
//create Tweet
router.post('/', (req, res) => {
    res.status(501).json({error: 'Not implemented'})
})

//list Tweets

router.get('/', (req, res) => {
    res.status(501).json({error: 'Not implemented'})
})

//get One Tweet

router.get('/:id', (req, res) => {
    const { id } = req.params
    res.status(501).json({error: `Not implemented ${id}`})
})


//Update Tweet

router.put('/:id', (req, res) => {
    const { id } = req.params
    res.status(501).json({error: `Not implemented ${id}`})
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.status(501).json({error: `Not implemented ${id}`})
})




export default router;