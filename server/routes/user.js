const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');


// get route for the current user
//reoved the password field to improve security 
router.get('/me',auth,async(req,res)=>{
	try{
		const user  = await User.findById(req.user).select('-password');
		if(!user){
			return res.status(404).json({message:"User not found"});
		}
		res.json(user);
	}
	catch(err){
		console.error(err.message);
		res.status(500).json({message:"Server error"});
	}
});

router.get('/:id',auth,async(req,res)=>{
	try{
		const user = await User.findById(req.params.id).select('-password');
		if(!user){
			return res.status(404).json({msg:"User not found"});
		}
		res.json(user);

	}catch(err){
		console.error(err.message);
		if(err.kind == 'ObjectId'){
			return res.status(404).json({msg:"Profile not found"});
		}
		res.status(500).send('Server error');
	}
});


module.exports = router;