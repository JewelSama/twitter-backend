import { SESClient } from "@aws-sdk/client-ses"

const ses = new SESClient({})


export async function sendEmailToken(email: string, token: string){
    console.log('email: ', email)
    try {
        
    } catch (error) {
        
    }
}

sendEmailToken('osafilejewel@gmail.com', '1234534')