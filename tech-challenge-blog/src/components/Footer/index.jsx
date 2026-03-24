import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.gray900};
  color: ${({ theme }) => theme.colors.gray400};
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
  margin-top: auto;
`

const FooterInner = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`

const FooterSection = styled.div``

const FooterLogo = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const FooterDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: 0;
`

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const FooterLink = styled(Link)`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`

const FooterBottom = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: ${({ theme }) => theme.spacing[8]} auto 0;
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray700};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <FooterWrapper>
      <FooterInner>
        <FooterSection>
          <FooterLogo>
            Tech<span>Blog</span>
          </FooterLogo>
          <FooterDescription>
            Plataforma de blog para professores e estudantes compartilharem conhecimento e
            conteúdo educacional de qualidade.
          </FooterDescription>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Navegação</FooterTitle>
          <FooterLink to="/">Início</FooterLink>
          <FooterLink to="/login">Entrar</FooterLink>
          <FooterLink to="/admin">Painel Admin</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Informações</FooterTitle>
          <FooterLink to="/">Sobre</FooterLink>
          <FooterLink to="/">Contato</FooterLink>
          <FooterLink to="/">Privacidade</FooterLink>
        </FooterSection>
      </FooterInner>

      <FooterBottom>
        <p>
          &copy; {currentYear} TechBlog — Tech Challenge FIAP. Todos os direitos reservados.
        </p>
      </FooterBottom>
    </FooterWrapper>
  )
}

export default Footer
