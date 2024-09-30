const express = require ('express');
const router = express.Router();
const userController = require('../controller/userController');

// User Calling APIs
router.post('./registerUser', userController.registerUser);
router.post('./loginUser' , userController.loginUser);
router.get('/getAllUser', userController.getAllUsers);

module.exports = router;