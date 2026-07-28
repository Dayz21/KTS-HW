import { ApiCallResponse } from '@kts-front/call-api';

import { ApiResponse, ExtendedErrorResponse } from 'store/globals/api/types';

export default function <T, E>(response: ApiCallResponse<T, E>): ApiResponse<T, E> {
  if (response.isError) {
    return {
      isError: true,
      isCancelled: (response as ExtendedErrorResponse<E>).isCancelled,
      data: response.data,
    };
  }

  return {
    isError: false,
    data: response.data,
  };
}
