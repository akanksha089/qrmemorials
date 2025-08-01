import { jwtDecode } from 'jwt-decode';

export const saveUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
  if (user.token) {
    localStorage.setItem('authToken', user.token);
  }
};

// export const getUserData = () => {
//   try {
//     const data = localStorage.getItem('userData');
//     return data ? JSON.parse(data) : {};
//   } catch (e) {
//     console.error("Error parsing userData:", e);
//     return {};
//   }
// };
export const getUserData = () => {
  try {
    const data = localStorage.getItem('userData');
    const user = data ? JSON.parse(data) : {};

    if (user.token) {
      const decoded = jwtDecode(user.token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token is expired
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        return {}; // Clear user data
      }
    }

    return user;
  } catch (e) {
    console.error("Error parsing or decoding userData:", e);
    return {};
  }
};
