function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ response : 'Error', msg: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
		return res.status(400).json({ response : 'Error', msg: err.message });
	}
    
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ response : 'Error', msg: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ response : 'Error', msg: err.message });
}

module.exports = errorHandler;