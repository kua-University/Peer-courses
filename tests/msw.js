// tests/msw.js
import { rest } from 'msw';

export const handlers = [
    rest.post('/api/payment/checkout', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                clientSecret: 'test_client_secret',
            })
        );
    }),
];
