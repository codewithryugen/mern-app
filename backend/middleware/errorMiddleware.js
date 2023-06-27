export const NotFound = (req,res,next)=>{
    const error = new Error(`Not found ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export const errorHandler = (err,req,res,next)=>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    if(err.name === 'CastError' && err.kind === 'ObjectId'){
        statusCode = 404;
        message = 'Resource notFound';
    }
    res.status(statusCode).json({
        message,
        stack:process.env.ENV === 'production' ? null : err.stack
    });
}

