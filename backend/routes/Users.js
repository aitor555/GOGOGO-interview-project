//Users routes go here
const express 		= require('express');
const router 		= express.Router();

router.get('/user', getAllUsers);