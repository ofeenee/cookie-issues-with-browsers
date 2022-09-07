import type { Handle } from '@sveltejs/kit';
import { redirect, error as serverError } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';
import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
  const { setHeaders, locals } = event;
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

    const cookieHeader = event.request.headers.get('cookie');
    const valid_token = cookie.parse(cookieHeader || '').valid_token;
    let newCookieString = '';

    console.log('valid_token:', valid_token);

    if (!valid_token) {
      newCookieString = cookie.serialize('valid_token', 'true', cookieOptions);
    }
    else if (valid_token === 'false') {
      newCookieString = cookie.serialize('valid_token', '', { ...cookieOptions, expires: new Date(0) });
      // throw serverError(401, 'unauthorized');
    }
    else if (valid_token === 'true') {
      newCookieString = cookie.serialize('valid_token', 'false', cookieOptions);
    }
    else {
      throw serverError(500, 'unknown cookie value');
    }

    setHeaders({ 'set-cookie': newCookieString });

  }
  catch (error) {
    console.log('error:', error);
    // if (error.message === 'unauthorized') cookies.delete('valid_token');
  }
  finally {
    return await resolve(event);
  }
};