export const errorMiddleware = (err, req, res, next) => {
    // const { statusCode, message } = err || (500 && "Internel server error");
    const statusCode = err.statusCode || 500
    const message = err.message || "Internel server error"

    return res.status(statusCode).json({
        success: false,
        message
    })
}