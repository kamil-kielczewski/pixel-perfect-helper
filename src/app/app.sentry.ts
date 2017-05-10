import * as Raven from 'raven-js'; // http://sentry.io
import { ErrorHandler } from '@angular/core';
import * as EnvData  from '../../.env.js';

if ('production' === ENV) {
    let s = EnvData['sentry_clientKey_publicDSN'];
    if (s) {
        Raven.config(s).install(); // Sentry configuration http://sentry.io
    }
}

export class RavenErrorHandler implements ErrorHandler {
  public handleError(err: any): void {
    Raven.captureException(err.originalError);
    console.error(err); // show error in console in production mode
  }
}

export const SENTRY_PROVIDER =  { provide: ErrorHandler, useClass: RavenErrorHandler };
