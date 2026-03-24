import { useState } from 'react'
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../hooks/useAuth'

const PageWrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.background};
`

const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[10]};
  width: 100%;
  max-width: 440px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`

const LoginSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: 0;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 2px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
`

const AlertBox = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.errorLight : theme.colors.successLight};
  color: ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.error : theme.colors.success};
  border: 1px solid ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.error : theme.colors.success};
`

const SubmitButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-top: ${({ theme }) => theme.spacing[2]};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

const BackToHome = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [fields, setFields] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/admin'

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const validate = () => {
    const newErrors = {}
    if (!fields.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = 'Digite um e-mail válido.'
    }
    if (!fields.password) {
      newErrors.password = 'Senha é obrigatória.'
    } else if (fields.password.length < 4) {
      newErrors.password = 'Senha deve ter no mínimo 4 caracteres.'
    }
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError('')

    try {
      await login({ email: fields.email, password: fields.password })
      navigate(from, { replace: true })
    } catch (err) {
      if (err.response?.status === 401) {
        setApiError('E-mail ou senha incorretos. Verifique e tente novamente.')
      } else if (err.response?.status === 429) {
        setApiError('Muitas tentativas. Aguarde alguns instantes e tente novamente.')
      } else {
        setApiError(
          err.response?.data?.message ||
          'Erro ao fazer login. Verifique sua conexão e tente novamente.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Acesso ao sistema</LoginTitle>
          <LoginSubtitle>Entre com suas credenciais de professor</LoginSubtitle>
        </LoginHeader>

        <Form onSubmit={handleSubmit} noValidate aria-label="Formulário de login">
          {apiError && (
            <AlertBox $type="error" role="alert" aria-live="assertive">
              {apiError}
            </AlertBox>
          )}

          <FormGroup>
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              value={fields.email}
              onChange={handleChange}
              $hasError={Boolean(errors.email)}
              disabled={loading}
              placeholder="seu@email.com"
              autoComplete="email"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <ErrorText id="email-error" role="alert">{errors.email}</ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              value={fields.password}
              onChange={handleChange}
              $hasError={Boolean(errors.password)}
              disabled={loading}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <ErrorText id="password-error" role="alert">{errors.password}</ErrorText>
            )}
          </FormGroup>

          <SubmitButton type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
        </Form>

        <BackToHome>
          <Link to="/">← Voltar para o início</Link>
        </BackToHome>
      </LoginCard>
    </PageWrapper>
  )
}

export default LoginPage
