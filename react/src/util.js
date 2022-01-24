import config from "./config";

export async function fetchFromApi(urlPath, userToken, init={}) {
  const { API_ENDPOINT, API_KEY } = config.api;
  const requestData = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userToken,
      'x-api-key': API_KEY,
    },
    ...init,
  }
  return await fetch(`${API_ENDPOINT}${urlPath}`, requestData);
}

export function getTokenForUser(user) {
  return user.getSignInUserSession().getIdToken().getJwtToken();
}
