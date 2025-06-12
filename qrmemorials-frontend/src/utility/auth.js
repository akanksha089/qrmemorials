export const saveUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
  if (user.token) {
    localStorage.setItem('authToken', user.token);
  }
};

export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};
