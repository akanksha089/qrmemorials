export const saveUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
  if (user.token) {
    localStorage.setItem('authToken', user.token);
  }
};

export const getUserData = () => {
  try {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Error parsing userData:", e);
    return {};
  }
};