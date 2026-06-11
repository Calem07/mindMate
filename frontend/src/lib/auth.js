export function getSession() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') || 'STUDENT',
    name: localStorage.getItem('userName') || 'Student',
    email: localStorage.getItem('userEmail') || '',
  };
}

export function setSession({ token, role, name, email }) {
  if (token) localStorage.setItem('token', token);
  if (role) localStorage.setItem('role', role);
  if (name) localStorage.setItem('userName', name);
  if (email) localStorage.setItem('userEmail', email);
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('user_pet');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}
