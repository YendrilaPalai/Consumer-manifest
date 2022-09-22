// Copyright 2018 Ping Identity
//
// Licensed under the MIT License (the "License"); you may not use this file
// except in compliance with the License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  AuthorizationConfig,
  GeneralEnvironmentInfo,
} from '../app/authorization_config';

export const environment: AuthorizationConfig & GeneralEnvironmentInfo = {
  production: false,
  issuer_uri: 'https://fam-uat.kp.org',
  client_id: 'UAA CA_OAUTH_UAT1',
  client_secret:
    'Ss0GUjugmc4DW2oCDGt17cf5I36cPeaeGSC2WCDcMqZaJft2hs5YL6SyV5htEGxg',
  redirect_uri: 'http://localhost:8080/home-page',
  logoutUrl: 'https://fam-uat.kp.org/idp/startSLO.ping',
  grant_type: 'authorization_code',
  scope: 'profile openid email',
  extras: { access_type: 'offline' },
};

export const env = {
  production: false,
  API_URL: 'http://localhost:1111',
  API_DEV_URL: 'https://consumer-manifest.dev.onprem-adf.kp.org',
  api: '/api',
  version: '/v1',
  domains: '/domains',
  manifest: '/manifest',
  getManifests: '/getManifests',
  levelSearch: '/levelSearch/',
  getDomains: '/getDomains',
  consumers: '/consumers',
  domain: '/domain',
  createManifest: '/createManifest',
  manifests:'/manifests',
  publishManifest:'/publishManifest',
};
