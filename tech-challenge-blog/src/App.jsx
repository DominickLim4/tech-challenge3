import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from './styles/theme'
import GlobalStyles from './styles/GlobalStyles'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { Loading } from './components/Loading'

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'))
const EditPostPage = lazy(() => import('./pages/EditPostPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const PageFallback = () => <Loading fullPage text="Carregando página..." />

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/create"
                element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditPostPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
