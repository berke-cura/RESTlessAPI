const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log("Starts of check auth middleware")
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_Key);
        req.userData = decoded;
        console.log("Done Check auth")
        next();
    } catch (error) {
        console.log("An error occured in check-auth")
        return res.status(401).json({message: 'Auth failed'});
    }
};