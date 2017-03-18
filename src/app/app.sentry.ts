import * as Raven from 'raven-js'; // http://sentry.io
import { ErrorHandler } from '@angular/core';

if ('production' === ENV) {
    Raven // Sentry configuration http://sentry.io
        .config('https://7ff1d9f947e5487c9b756fc81e140186@sentry.io/149139')
        .install();
}

export class RavenErrorHandler implements ErrorHandler {
  public handleError(err: any): void {
    Raven.captureException(err.originalError);
    console.error(err);
  }
}

export const SENTRY_PROVIDER =  { provide: ErrorHandler, useClass: RavenErrorHandler };
