const requestLogger = (req, res, next) => {
  console.log(
    '\nMethod: '+req.method
    +'\nPath:   '+req.path
    +'\nBody:   ' +(req.body||'empty')
    +'\n---'
  )
  next()
}

module.exports = {
  requestLogger
}