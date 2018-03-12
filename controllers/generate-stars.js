module.exports = (req, res) => {
  if (req.user.type != 'admin') return res({ error: 'NOT_ADMIN' })
}