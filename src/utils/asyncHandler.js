const asyncHandler = (requestHandller) => {
    (req, res, next) => {
        Promise.resolve(requestHandller(req,res,next)).reject((err) => next(err))
    }
}

export { asyncHandler }






/*
const asyncHandler = (fn) = async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/