/**
 * src/context/AuthContext.jsx
 * ============================
 * Global authentication context.
 * Provides: user, login(), logout(), isAuthenticated
 */
import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

function loadUser() {
    try {
        const raw = localStorage.getItem('user')
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadUser)
    const navigate = useNavigate()

    /** Called after a successful /auth/login response */
    const login = useCallback((token, userObj) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userObj))
        setUser(userObj)
    }, [])

    /** Clears session and redirects to /login */
    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        navigate('/login', { replace: true })
    }, [navigate])

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

/** Hook — throws if used outside AuthProvider */
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
