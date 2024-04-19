import { jwtDecode } from "jwt-decode";

const checkTokenExpiration = () => {
  const now = Date.now();
  const token = localStorage.getItem('token');
  if (!token || typeof token !== 'string') {
    return;
  }
  const decoded = jwtDecode(token);
  const expirationTimeMillis = decoded.exp * 1000;
  if (now >= expirationTimeMillis) {
    localStorage.removeItem('token');
  }
}

const forbiddenAccess = () => {
  const now = Date.now();
  const token = localStorage.getItem('token');
  if (!token || typeof token !== 'string') {
    return;
  }
  const decoded = jwtDecode(token);
  const expirationTimeMillis = decoded.exp * 1000;
  if (now < expirationTimeMillis) {
    window.history.back();
  }
}

export { checkTokenExpiration, forbiddenAccess };