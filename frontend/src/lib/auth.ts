export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  country: 'INDIA' | 'AMERICA';
  accessToken: string;
}

export const saveAuth = (user: AuthUser) => {
  localStorage.setItem('token', user.accessToken);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuth = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuth();
};
