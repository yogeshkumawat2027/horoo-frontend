const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('masterAdminToken');
};

export const isAdminAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('masterAdminToken');
  const auth = localStorage.getItem('masterAdminAuth');
  return !!token && !!auth;
};

export const adminApiCall = async (endpoint, options = {}) => {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error('Not authenticated. Please login first.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('masterAdminToken');
          localStorage.removeItem('masterAdminAuth');
          window.location.href = '/master-admin';
        }
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('Admin API error:', error);
    throw error;
  }
};

export const logoutAdmin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('masterAdminToken');
    localStorage.removeItem('masterAdminAuth');
    sessionStorage.clear();
  }
};


export const verifyAdminToken = async () => {
  try {
    const response = await adminApiCall('/auth/verify-token');
    return response.success;
  } catch (error) {
    return false;
  }
};
