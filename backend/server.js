import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import { NotFound,errorHandler } from './middleware/errorMiddleware.js';
import mongoose from 'mongoose';

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(NotFound);
// app.use(errorHandler);
app.use('/api/users',userRoutes);
app.get('/',(req,res)=>res.send('server siap!'));

app.listen(port,async ()=>{
    console.log(`server run in port ${port}`);
    try{
        console.log("db connected :)");
        await mongoose.connect(process.env.DB);
    }catch(err){
        console.log("db diconnected :(");
    }
});
