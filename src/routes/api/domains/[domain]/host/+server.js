import { getJWT } from '$lib/jwt.js';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { RegisterDomain, getUser, getEmail, RegisterHosting } from '$lib/api.js';
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(env.SENDGRID_API_KEY);


export async function GET({url, cookies, params}){
    let jwt = cookies.get('jwt');
    let session = await getJWT(jwt);
    let apiKey;

    let query = url.searchParams;

    if(!session && query.get("key")) apiKey = query.get("key");  
    else if(!session) return json({error: 'No session or api key provided'}, 400);
    else apiKey = session.token;


    let user;
    if(session?.user) user = session.user;
    else user = await getUser(apiKey);

    let username;
    if(session?.user?.login) username = session.user.login;
    else username = user.login;

    if(!username) return json({error: 'Invalid API key.'}, 400);

    let email;
    if(session?.emails) email = session.emails.find((email) => email.primary)
    else email = await getEmail(apiKey);

    
    if(!email) return json({error: 'No primary email found.'}, 400);
    email = email.email;

    const subdomain = params.domain;
    const response = await fetch(
        `https://hosts.is-a.dev/api/register?jwt=${jwt}&domain=${subdomain}`
    );
    const json = await response.json();
    if (json.error) return json(json, 400);

    const msg = {
        to: email,
        from: 'hosting@maintainers.is-a.dev', // This email should be verified in your SendGrid settings
        templateId: 'd-694e5d1edfca4cbca4958fb4fb4516f3', // Replace with your actual dynamic template ID
        dynamic_template_data: {
          username: subdomain,
          password: json.pass,
          // Other dynamic data that your template requires
        },
      };
      
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error);
        });
      


    const result = await RegisterHosting(subdomain, username, email, apiKey);
    

    // if result json contains ERROR, send error
    if (result.error) return json(result, 400);
    else return json(result, 200);


}