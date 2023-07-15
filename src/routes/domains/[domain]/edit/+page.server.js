import { getJWT } from '$lib/jwt.js'
import { redirect } from '@sveltejs/kit';
export async function load({cookies, params}){
    let jwt = cookies.get('jwt');
    let user = getJWT(jwt);
    if(!user) throw redirect(303, '/login');
    let domain = await fetch(`https://register.is-a.dev/api/domains?domain=${params.domain}`);
    if(domain.status === 404) throw redirect(303, '/domains');
    domain = await domain.json();
    if(domain.owner.username !== user.user.login) throw redirect(303, '/domains')
    return {
        user: user.user,
        domain: {
            name: params.domain,
            ...domain
        },
        emails: user.emails,
        token: user.token
    };
}