import { createCookieSessionStorage, Session } from 'remix';

export type ToastMessage = { message: string; type: 'success' | 'error' };

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

export const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    name: '__message',
    // domain: 'remix.run',
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    expires: new Date(Date.now() + ONE_YEAR),
    secrets: ['zxcvjaiorjlkanj12378931274hjkhy678a6r'],
    secure: true,
  },
});

export function setSuccessMessage(session: Session, message: string) {
  session.flash('toastMessage', { message, type: 'success' } as ToastMessage);
}

export function setErrorMessage(session: Session, message: string) {
  session.flash('toastMessage', { message, type: 'error' } as ToastMessage);
}
