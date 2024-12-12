import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    // Skip the token validation for registration route
    if (req.method === 'POST' && (req.url.includes('/api/user/register') || req.url.includes('/api/user/login'))) {
        return NextResponse.next(); // Allow the registration route to pass without token validation
    }

    // Check for token in cookies or Authorization header
    const token = req.cookies.get('session_id')?.value || req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
        const { payload: decoded } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        payload = decoded;
    } catch (error) {
        if (error.code === 'ERR_JWT_EXPIRED') {
            const response = NextResponse.json({ message: 'Token expired, please log in again' }, { status: 401 });
            response.cookies.delete('session_id');
            response.cookies.delete('member_id');
            response.cookies.delete('rank_id');
            return response;
        }
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check user rank for protected routes
    const url = req.nextUrl.pathname;

    if (url.startsWith('/api/admin') || url.startsWith('/product/') && url.includes('/edit')) {
        if (payload.rank !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
    }

    if (url.startsWith('/product/') && url.includes('/edit')) {
        // Extract the ID from the URL
        const productId = url.split('/')[2]; // Assuming URL structure is /product/[id]/edit

        const id = parseInt(productId, 10);
        const maxIdValue = 10000;  // Set the maximum allowed ID (X)
        const defaultId = 1;       // Set the default ID (Y)

        if (productId !== 'new' && Number(productId) !== id) {
            const newUrl = req.nextUrl.clone();
            //const newId = Math.min(Math.max(id, 1), 1);
            newUrl.pathname = `/product/new/edit`;  // Redirect
            return NextResponse.redirect(newUrl);
        }
    }

    return NextResponse.next(); // Proceed if valid
}

// Apply middleware to specific routes
export const config = {
    matcher: [
        '/api/admin/:path*', // Protect admin API routes
        '/product/:path*/edit', // Protect product edit routes
        '/api/user/:path*', // Protect user-related API routes
    ],
};