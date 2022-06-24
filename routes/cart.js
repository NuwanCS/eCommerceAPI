const router = require("express").Router();

const Cart = require("../models/Cart");
const {verigyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")


//create 

router.post("/", verifyTokenAndAdmin, async (req, res)=>{
    const newCart  = new Cart(req.body);


    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    
   
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, 
        {new:true}
        )
        res.status(200).json(updatedCart)
    }catch(err){
        res.status(500).json(err)

    }
})

//Delete

router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{

        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart successfully deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get User Cart

router.get("/find/:userID", verifyTokenAndAuthorization, async (req, res)=>{
    try{

        const cart = await Cart.findOne({userId: req.params.userID })
          res.status(200).json({cart});
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get All 

router.get("/find/", verifyTokenAndAdmin, async (req, res)=>{

    
    try{
        const carts =  await Cart.find()
        res.status(200).json(carts); 
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;
