import type { Handle } from '@sveltejs/kit';
import { redirect, error as serverError } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
  const { cookies, setHeaders, locals } = event;
  try {
    const cookieOptions: CookieSerializeOptions = {
      // domain: 'localhost:3000',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      // maxAge: undefined, // 1 week
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      // expires: undefined,
      priority: 'high',
    };

    const valid_token = cookies.get('valid_token');
    console.log('valid_token:', valid_token);

    if (!valid_token) cookies.set('valid_token', 'true', cookieOptions);

    if (valid_token === 'false') {
      cookies.delete('valid_token');
      // throw serverError(401, 'unauthorized');
    }
    if (valid_token === 'true') {
      cookies.set('valid_token', 'false', cookieOptions);
    }
  }
  catch (error) {
    // if (error.message === 'unauthorized') cookies.delete('valid_token');
  }
  finally {
    return await resolve(event);
  }
};