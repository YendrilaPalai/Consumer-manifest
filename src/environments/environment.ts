// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AuthorizationConfig, GeneralEnvironmentInfo } from "src/app/authorization_config";

export const environment: AuthorizationConfig & GeneralEnvironmentInfo  = {
  production: false,
  issuer_uri: 'https://fam-uat.kp.org',
  client_id: 'UAA CA_OAUTH_UAT1',
  client_secret:'Ss0GUjugmc4DW2oCDGt17cf5I36cPeaeGSC2WCDcMqZaJft2hs5YL6SyV5htEGxg',
  redirect_uri: 'http://localhost:8080/home-page',
  logoutUrl:'https://fam-uat.kp.org/idp/startSLO.ping',
  grant_type:'authorization_code', 
  scope: 'profile openid email',
  extras: { 'access_type': 'offline'},
};

export const env = {
  production: false,
  API_URL:'http://localhost:1111',
  API_DEV_URL:'https://consumer-manifest.dev.onprem-adf.kp.org',
  api:'/api',
  version:'/v1',
  domains:'/domains',
  manifest:'/manifest',
  getManifests:'/getManifests',
  levelSearch:'/levelSearch/',
  getDomains:'/getDomains',
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
