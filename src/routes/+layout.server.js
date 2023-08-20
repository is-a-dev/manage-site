import { getJWT } from '$lib/jwt.js'
import { Maintainer } from '$lib/api.js'
export async function load({cookies}){
    let user = await getJWT(cookies.get('jwt'));
    let Maintainers = await Maintainer(user);

    return {
        user,
        Maintainers,
    };
}