const jwt = require("jsonwebtoken")


const verigyToken = (req, res, next)=>{
    const authHeader = req.headers.token
    if(authHeader){

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err){
                return res.status(401).json("Token invalid!")
            }

            req.user = user
            next();
        })
    }else{
        return res.status(401).json("You are not authenticated!")
    }
}

const verifyTokenAndAuthorization = (req, res, next)=>{
    verigyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
        
            next();

        }else{
            res.status(403).json("User not authorized")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next)=>{
    verigyToken(req, res, ()=>{
        if( req.user.isAdmin){
        
            next();

        }else{
            res.status(403).json("User not authorized")
        }
    })
}
module.exports = {verigyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin} ;