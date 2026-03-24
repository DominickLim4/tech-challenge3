/**
 * Mock API server para desenvolvimento local.
 *
 * Credenciais de teste:
 *   email:  admin@techblog.com
 *   senha:  admin123
 *
 * Uso: node mock/server.cjs
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

const DB_PATH = path.join(__dirname, 'db.json')
const PORT = 3000

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { resolve({}) }
    })
  })
}

function send(res, status, data) {
  const json = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(json)
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    return res.end()
  }

  // Remove o prefixo /api se presente
  const url = req.url.replace(/^\/api/, '').split('?')[0]
  const method = req.method

  // POST /auth/login
  if (method === 'POST' && url === '/auth/login') {
    const body = await parseBody(req)
    if (body.email === 'admin@techblog.com' && body.password === 'admin123') {
      return send(res, 200, {
        token: 'mock-jwt-token-local-dev',
        user: { id: '1', name: 'Professor Admin', email: body.email, role: 'professor' },
      })
    }
    return send(res, 401, { message: 'E-mail ou senha incorretos.' })
  }

  // GET /posts  (suporta ?search=)
  if (method === 'GET' && url === '/posts') {
    const query = new URL(req.url, `http://localhost:${PORT}`)
    const search = query.searchParams.get('search') || ''
    let posts = readDb().posts
    if (search) {
      const q = search.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.content || '').toLowerCase().includes(q)
      )
    }
    return send(res, 200, posts)
  }

  // GET /posts/:id
  const postMatch = url.match(/^\/posts\/(.+)$/)
  if (method === 'GET' && postMatch) {
    const post = readDb().posts.find((p) => String(p.id) === postMatch[1])
    if (!post) return send(res, 404, { message: 'Post não encontrado.' })
    return send(res, 200, post)
  }

  // POST /posts
  if (method === 'POST' && url === '/posts') {
    const body = await parseBody(req)
    const db = readDb()
    const newPost = {
      id: String(Date.now()),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.posts.push(newPost)
    writeDb(db)
    return send(res, 201, newPost)
  }

  // PUT /posts/:id
  if (method === 'PUT' && postMatch) {
    const body = await parseBody(req)
    const db = readDb()
    const idx = db.posts.findIndex((p) => String(p.id) === postMatch[1])
    if (idx === -1) return send(res, 404, { message: 'Post não encontrado.' })
    db.posts[idx] = { ...db.posts[idx], ...body, updatedAt: new Date().toISOString() }
    writeDb(db)
    return send(res, 200, db.posts[idx])
  }

  // DELETE /posts/:id
  if (method === 'DELETE' && postMatch) {
    const db = readDb()
    const idx = db.posts.findIndex((p) => String(p.id) === postMatch[1])
    if (idx === -1) return send(res, 404, { message: 'Post não encontrado.' })
    db.posts.splice(idx, 1)
    writeDb(db)
    return send(res, 200, { message: 'Post excluído com sucesso.' })
  }

  send(res, 404, { message: 'Rota não encontrada.' })
})

server.listen(PORT, () => {
  console.log(`\nMock API rodando em http://localhost:${PORT}`)
  console.log('\nEndpoints disponíveis:')
  console.log('  POST   /api/auth/login')
  console.log('  GET    /api/posts')
  console.log('  GET    /api/posts/:id')
  console.log('  POST   /api/posts')
  console.log('  PUT    /api/posts/:id')
  console.log('  DELETE /api/posts/:id')
  console.log('\nCredenciais de teste:')
  console.log('  email:  admin@techblog.com')
  console.log('  senha:  admin123\n')
})
