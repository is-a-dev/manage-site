import { redirect } from '@sveltejs/kit';
import { getJWT } from '$lib/jwt.js'

export async function load({cookies}){
    let user = await getJWT(cookies.get('jwt'));
    if(user) throw redirect(303, '/');

    let stats = fetch("https://register.is-a.dev/api/count-domains").then(res => res.json());


    return {
        stats
    };
    
}