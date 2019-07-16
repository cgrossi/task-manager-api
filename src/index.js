const express =require('express');
const app = express();

require('./db/mongoose');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT

// Middleware
// Automatically parse json with express middleware
app.use(express.json())
// Tell express to use routes imported from another file
app.use(userRouter)
app.use(taskRouter)

// Listener for server
app.listen(port, () => {
  console.log('Server is running on ' + port)
})