import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken;
import { env } from '$env/dynamic/private'; 

export function getJWT(jwt){
    //verify the jwt
    let response = verify(jwt, env.JWT_SECRET, (err, response) => {
        if(err){
            return null;
        }
        return response;
    });
    return response || null;
}
