const server = require('./utility/wss').Server

const PORT = 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})