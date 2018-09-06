import {
  API_DOMAIN,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from '../constants';

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  };
}

function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  };
}

function logoutError(errorMessage) {
  return {
    type: LOGOUT_FAILURE,
    isFetching: false,
    isAuthenticated: true,
    errorMessage
  };
}

export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout());
    try {
      const jwt = localStorage.getItem('jwt');
      const refresh_token = localStorage.getItem('refresh_token');

      return fetch(`${API_DOMAIN}/access-tokens`, {
        method: 'DELETE',
        headers: {
          'X-Access-Token': jwt,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ refresh_token })
      })
        .then(() => {
          localStorage.removeItem('jwt');
          localStorage.removeItem('refresh_token');
          dispatch(logoutSuccess());
        })
        .catch(err => {
          throw new Error(err);
        });
    } catch (err) {
      dispatch(logoutError(err));
    }
  };
}
