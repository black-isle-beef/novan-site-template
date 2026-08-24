import { Provider } from '@angular/core';
import { InjectionToken } from '@angular/core';

export interface NovanSiteKitOptions {
	readonly assetsBasePath?: string;
	readonly enableCookieBanner?: boolean;
}

export const NOVAN_SITE_KIT_OPTIONS = new InjectionToken<NovanSiteKitOptions>(
	'NOVAN_SITE_KIT_OPTIONS',
);

export const provideNovanSiteKit = (
	options: NovanSiteKitOptions = {},
): Provider[] => [{ provide: NOVAN_SITE_KIT_OPTIONS, useValue: options }];