import { getJWT } from '$lib/jwt.js'
import { redirect } from '@sveltejs/kit';
export async function load({cookies, params}){
    let jwt = cookies.get('jwt');
    let user = getJWT(jwt);
    if(!user) throw redirect(303, '/login');
    let domain = await fetch(`https://api.is-a.dev/lookup/domain?domain=${params.domain}`).then(res => res.json());
    if(domain.code) throw redirect(303, '/domains');
    if(domain.owner.username !== user.user.login) throw redirect(303, '/domains')
    return {
        user: user.user,
        domain: {
            name: params.domain,
            ...domain
        }
    };
}