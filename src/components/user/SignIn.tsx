import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../apis/Auth"
import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react"

const SignIn: React.FC = () => {
    const [showPsw, setShowPsw] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const { signIn, signInLoading, error, clearError, isAuthenticated, user } = useAuthStore()

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/home')
        }
    }, [isAuthenticated, user, navigate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) clearError()
        setFormData({...formData, [e.currentTarget.name]: e.currentTarget.value})
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        clearError()

        try {
            await signIn(formData.email, formData.password)
        } catch (error) {
            // Error is handled by the store
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Đăng nhập
                    </h2>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-red-200 text-red-700 rounded-lg flex items-center text-sm">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập email..."
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    disabled={signInLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    type={showPsw ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="******"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    disabled={signInLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPsw(!showPsw)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    disabled={signInLoading}
                                >
                                    {showPsw ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4 text-sm text-gray-600">
                            <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => navigate('/forgot-password')}
                                disabled={signInLoading}
                            >
                                Quên mật khẩu?
                            </button>
                            <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => navigate('/user/signUp')}
                                disabled={signInLoading}
                            >
                                Đăng ký tài khoản
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={signInLoading}
                                className="w-full flex justify-center items-center py-2.5 border bg-green-500 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {signInLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang đăng nhập
                                    </>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn