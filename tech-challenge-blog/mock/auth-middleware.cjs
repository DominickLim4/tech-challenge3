/**
 * Mock authentication middleware para json-server.
 * Intercepta POST /api/auth/login e retorna um JWT fake para testes locais.
 *
 * Credenciais de teste:
 *   email:  admin@techblog.com
 *   senha:  admin123
 */

module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/auth/login') {
    const { email, password } = req.body || {}

    if (email === 'admin@techblog.com' && password === 'admin123') {
      return res.json({
        token: 'mock-jwt-token-for-local-dev-only',
        user: {
          id: '1',
          name: 'Professor Admin',
          email: 'admin@techblog.com',
          role: 'professor',
        },
      })
    }

    return res.status(401).json({ message: 'E-mail ou senha incorretos.' })
  }

  next()
}
