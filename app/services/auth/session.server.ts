// app/services/session.server.ts
import { createCookieSessionStorage } from 'remix';

// 导出整个 sessionStorage 对象
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', //  在这里使用你想要的任何名称
    sameSite: 'lax', // 这有助于  CSRF
    path: '/', // 记得添加这个，这样 cookie 就可以在所有路由中工作
    httpOnly: true, // 出于安全原因，将这个 cookie 设为 http only
    secrets: ['s3cr3t'], // 将其替换为实际的 secret
    secure: ['production', 'development'].includes(process.env.NODE_ENV), // 仅在 prod 中启用
  },
});

// 您也可以单独导出方法以供自己使用
export const { getSession, commitSession, destroySession } = sessionStorage;
