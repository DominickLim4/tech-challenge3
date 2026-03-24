import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`

const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 128px);
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  animation: ${float} 3s ease-in-out infinite;
  letter-spacing: -4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 5rem;
  }
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  max-width: 480px;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const ActionsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
`

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: none;
  }
`

const SecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
  }
`

function NotFoundPage() {
  return (
    <PageWrapper>
      <ErrorCode aria-label="Erro 404">404</ErrorCode>
      <Title>Página não encontrada</Title>
      <Message>
        Ops! A página que você está procurando não existe ou foi movida para outro endereço.
      </Message>
      <ActionsRow>
        <PrimaryLink to="/">← Voltar ao início</PrimaryLink>
        <SecondaryLink to="/login">Entrar no sistema</SecondaryLink>
      </ActionsRow>
    </PageWrapper>
  )
}

export default NotFoundPage
