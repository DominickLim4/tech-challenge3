import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../hooks/useAuth'

const HeaderWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const HeaderInner = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing[4]};
  }
`

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  letter-spacing: -0.5px;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: none;
  }

  span {
    color: ${({ theme }) => theme.colors.text};
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.backgroundCard};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing[4]};
    gap: ${({ theme }) => theme.spacing[2]};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const NavItem = styled(NavLink)`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    text-align: center;
    padding: ${({ theme }) => theme.spacing[3]};
  }
`

const LogoutButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.error};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.errorLight};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    text-align: center;
    padding: ${({ theme }) => theme.spacing[3]};
  }
`

const UserBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.text};
    border-radius: 2px;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:nth-child(1) {
      transform: ${({ $open }) => ($open ? 'rotate(45deg) translate(6px, 6px)' : 'none')};
    }
    &:nth-child(2) {
      opacity: ${({ $open }) => ($open ? 0 : 1)};
    }
    &:nth-child(3) {
      transform: ${({ $open }) => ($open ? 'rotate(-45deg) translate(6px, -6px)' : 'none')};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
  }
`

function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <HeaderWrapper>
      <HeaderInner>
        <Logo to="/" onClick={closeMenu} aria-label="Tech Challenge Blog - Página inicial">
          Tech<span>Blog</span>
        </Logo>

        <HamburgerButton
          onClick={() => setMenuOpen((prev) => !prev)}
          $open={menuOpen}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
        >
          <span />
          <span />
          <span />
        </HamburgerButton>

        <Nav id="main-nav" $open={menuOpen} role="navigation" aria-label="Navegação principal">
          <NavItem to="/" end onClick={closeMenu}>
            Início
          </NavItem>

          {isAuthenticated ? (
            <>
              <NavItem to="/admin" onClick={closeMenu}>
                Painel Admin
              </NavItem>
              <NavItem to="/admin/create" onClick={closeMenu}>
                Novo Post
              </NavItem>
              {user?.name && <UserBadge aria-label={`Usuário: ${user.name}`}>{user.name}</UserBadge>}
              <LogoutButton onClick={handleLogout} aria-label="Sair da conta">
                Sair
              </LogoutButton>
            </>
          ) : (
            <NavItem to="/login" onClick={closeMenu}>
              Entrar
            </NavItem>
          )}
        </Nav>
      </HeaderInner>
    </HeaderWrapper>
  )
}

export default Header
