import { type EndpointType } from '@kts-specials/mediaproject-stores';

import { API_URL } from './apiUrl';

const createApiEndpoint = (path: string, method: EndpointType['method'] = 'GET'): EndpointType => ({
  url: `${API_URL}${path}`,
  method,
});

export const ENDPOINTS = {
  auth: createApiEndpoint('user/auth', 'GET'),
  flag: createApiEndpoint('user/flag', 'POST'),
  restart: createApiEndpoint('user/restart', 'POST'),
  getUser: createApiEndpoint('user/get', 'GET'),
  uiConfig: createApiEndpoint('config/get', 'GET'),
} as const;
