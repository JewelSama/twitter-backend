import { Router } from "express"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"


const router = Router();
const prisma = new PrismaClient()



const EMAIL_TOKEN_EXPIRATION_TIME = 10; //10mins
const AUTHENTICATION_EXPIRATION_HOURS = 12; //12hrs
const JWT_SECRET = process.env.JWT_SECRET || "Super Secret"


// Generate a random 8 digit number as the email token
function generateToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

    function generateAuthToken(tokenId: number): string {
        const jwtpayload = { tokenId };

        return jwt.sign(jwtpayload, JWT_SECRET, {
            algorithm: 'HS256',
            noTimestamp: true,
        })
    }


// Create a user if it doesn't exist,
// Generate email token and send it to email
router.post('/login', async(req, res) => {
    const { email } = req.body;

    //generate token
    const emailToken = generateToken()

    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000) // *60---to secs *1000 --milliseconds
    // console.log(new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000))

    try {
        const createdToken = await prisma.token.create({
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
        })
    
        // console.log(createdToken)
        // send EmailToken to users Token
    
        res.sendStatus(200)   
    } catch (error) {
        res.status(400).json({ error: "Couldn't start the authentication process" })
        console.log(error)
    }

})


//Validate the email token 
//Generate a long-lived JWT Token

router.post('/authenticate', async(req, res) => {
    const { email, emailToken } = req.body;
    const dbEmailToken = await prisma.token.findUnique({
        where: {
            emailToken
        },
        include: { user: true }
    })
    // console.log(dbEmailToken)
    if(!dbEmailToken || !dbEmailToken.valid){
        return res.sendStatus(401) //401 = unauthenticated
    }
    if(dbEmailToken.expiration < new Date()){
        return res.status(401).json({ error: "Token expired!" })
    }
    if(dbEmailToken?.user?.email !== email ){
        return res.sendStatus(401)
    }

    //generate API Token 
    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000) // *60---to secs *1000 --milliseconds

    const apiToken = await prisma.token.create({
        data: {
            type: "API",
            expiration,
            user: {
                connect: {
                    email,
                }
            }
        }
    })
    //Invalidate the Email token
    await prisma.token.update({
        where: { id: dbEmailToken.id },
        data: { valid: false }
    })


    //Generate the JWT token
    const authToken = generateAuthToken(apiToken.id)

    res.json({authToken})
})

export default router;