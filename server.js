const http=require('http');
const app=require('./app');
const Server=http.createServer(app);
const PORT = process.env.PORT || 5000;

Server.listen(PORT,()=>{
    console.log(`server started on ${PORT}`);
})






