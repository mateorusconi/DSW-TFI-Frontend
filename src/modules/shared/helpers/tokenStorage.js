const TOKEN_KEY = "medportal.token";

export function saveToken(token) {
  if (typeof token !== "string" || token.trim() === "") {
    throw new Error("No se recibió un token válido para guardar.");
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}
