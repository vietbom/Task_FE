import { useEffect } from "react"
import { useAuthStore } from "./apis/Auth"
import HeaderPage from "./components/HeaderPage"
import { Navigate, Route, Routes } from "react-router-dom"
import SignIn from "./components/user/SignIn"
import SignUp from "./components/user/SignUp"
import HomeTask from "./components/task/HomeTask"
import AddTask from "./components/task/AddTask"

function App() {
  const { checkAuth, isAuthenticated, loading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderPage />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/user/signIn" replace />
              )
            }
          />

          <Route
            path="/user/signIn"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <SignIn />
              )
            }
          />

          <Route 
            path="/user/signUp" 
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <SignUp />
              )
            } 
          />

          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <HomeTask/>
              ) : (
                <Navigate to='/home' replace />
              )
            }
          />

          <Route
            path="/user/addTask"
            element={
              isAuthenticated ? (
                <AddTask/>
              ) : (
                <Navigate to='/home' replace />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
