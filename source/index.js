const app = require('./app');
const port = process.env.PORT;

// SERVER INIT
app.listen(port, () => {
    console.log('Server is up on port ' + port);
})
