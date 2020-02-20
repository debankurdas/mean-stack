 const express = require('express');
 const multer = require('multer');
 const checkAuth = require('../middleware/check-auth');
 const router = express.Router();
 const postController = require('../controllers/postController');

 const MIME_TYPE = {
   'image/png':'png',
   'image/jpeg':'jpeg',
   'image/jpg':'jpg'
 };
 const storage = multer.diskStorage({
   destination: (req,file,cb) => {
    const isValid = MIME_TYPE[file.mimetype];
     let error= new Error("Invalid");
     if(isValid)
     {
       error = null;
     }
    cb(error,"backend/images");
   },
   filename: (req,file,cb) => {
     const name = file.originalname.toLowerCase().split(' ').join('-');
     const ext = MIME_TYPE[file.mimetype];
     cb(null,name+'-'+Date.now()+'.'+ext);
   }
 });
//post
 router.post((''),checkAuth,multer({storage:storage}).single("image"),postController.post);
 //update
router.put(('/:id'),checkAuth,multer({storage:storage}).single("image"),postController.update );
//get post by id
router.get(('/:id'), postController.getPostById);
//get post
router.get((''),postController.getPost);
//delete
router.delete(('/:id'),checkAuth,postController.delete);

module.exports = router ;
