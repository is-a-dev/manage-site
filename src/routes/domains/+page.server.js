import { getJWT } from '$lib/jwt.js'
import { redirect } from '@sveltejs/kit';
export async function load({cookies}){
    let jwt = cookies.get('jwt');
    let user = getJWT(jwt);
    if(!user) throw redirect(303, '/login');
    let domains = await fetch(`https://register-bot.is-a.dev/api/domains?username=${user.user.login}`).then(res => res.json());


    return {
        user: user.user,
        subdomains: domains,
        count: domains.length || 0
    };
}