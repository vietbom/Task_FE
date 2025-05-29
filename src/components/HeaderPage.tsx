import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../apis/Auth'

const HeaderPage: React.FC = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated, logoutLoading, logout } = useAuthStore()
    const isSignedIn = isAuthenticated && user

    const handleLogout = async() => {
        try {
            await logout()
            navigate('/user/signIn')
        } catch (error) {
            console.error("Đăng xuất tài khoản không thành công! ", error)
        }
    }

    return (
        <header className='sticky top-0 z-40 bg-white shadow-sm'>
            <div className='w-full bg-gray-200'>
                <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                        <span className='text-gray-800 text-2xl'>Task management</span>
                    </Link>
                    <div className='flex items-center gap-2'>
                        {isSignedIn ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-green-900 font-medium">
                                    Chào, {user.userName}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/user/signIn')}
                                className="px-4 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                Đăng nhập 
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderPage
