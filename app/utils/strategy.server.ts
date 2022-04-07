import { AppLoadContext, SessionStorage } from 'remix';
import { AuthenticateOptions, Strategy } from 'remix-auth';

export interface Params {
  form: FormData;
  context?: AppLoadContext;
}

export class FormStrategy<User> extends Strategy<User, Params> {
  name = 'form';

  async authenticate(
    request: Request,
    sessionStorage: SessionStorage,
    options: AuthenticateOptions,
  ): Promise<User> {
    const form = await request.formData();

    let user: User;
    try {
      user = await this.verify({ form, context: options.context });
    } catch (error) {
      const message = (error as Error).message;
      return await this.failure(message, request, sessionStorage, options);
    }

    return this.success(user, request, sessionStorage, options);
  }
}
