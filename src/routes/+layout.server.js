import { getJWT } from '$lib/jwt.js'
export async function load({cookies}){
    let user = await getJWT(cookies.get('jwt'));
    return {
        user,
    };
}