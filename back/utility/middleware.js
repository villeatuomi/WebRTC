const requestLogger = (req, res, next) => {
  console.log('\nMethod:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

module.exports = {
  requestLogger
}