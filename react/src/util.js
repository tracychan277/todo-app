import config from "./config";

export async function fetchFromApi(urlPath, user, init={}) {
  const { API_ENDPOINT, API_KEY } = config.api;
  const userToken = getTokenForUser(user);
  const requestData = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userToken,
      'X-Api-Key': API_KEY,
      'Username': user.username,
    },
    ...init,
  }
  return await fetch(`${API_ENDPOINT}${urlPath}`, requestData);
}

export function getTokenForUser(user) {
  return user.getSignInUserSession().getIdToken().getJwtToken();
}
