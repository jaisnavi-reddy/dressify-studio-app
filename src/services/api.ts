const API_BASE_URL = 'http://localhost:5000/api';

export const authAPI = {
    signup: (name: string, email: string, password: string) =>
        fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        }).then(r => r.json()),

    login: (email: string, password: string) =>
        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(r => r.json()),

    googleLogin: (googleToken: string) =>
        fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleToken })
        }).then(r => r.json()),

    verifyToken: (token: string) =>
        fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        }).then(r => r.json())
};

export const userAPI = {
    getProfile: (token: string) =>
        fetch(`${API_BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),

    updateProfile: (token: string, data: any) =>
        fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(r => r.json()),

    saveDesign: (token: string, designData: any, name: string) =>
        fetch(`${API_BASE_URL}/users/save-design`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ designData, name })
        }).then(r => r.json()),

    getSavedDesigns: (token: string) =>
        fetch(`${API_BASE_URL}/users/saved-designs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json())
};
