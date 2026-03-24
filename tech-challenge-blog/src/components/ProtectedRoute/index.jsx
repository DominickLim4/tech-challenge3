import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../../hooks/useAuth'
import { Loading } from '../Loading'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading fullPage text="Verificando autenticação..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
