const PostSchema = require('../model/post');
exports.post = (req,res,next) =>{
  url = req.protocol+'://'+req.get('host');
  const post= new PostSchema({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+'/images/'+req.file.filename,
    creator: req.userData.uId
  });
  post.save().then((result) => {

    res.status(201).json({
      message:"Post added Succesfully",
      post: {
        ...result,
        id: result._id
      }
    });
  }).catch((error) => {
    res.status(401).json({
      message: 'Post is not added!'
    })
  })
}

exports.update = (req,res,next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    url = req.protocol+'://'+req.get('host');
    imagePath = url+'/images/'+req.file.filename
  }

  const post = new PostSchema({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.uId
  })
  PostSchema.updateOne({_id : req.params.id,creator: req.userData.uId},post)
  .then(result => {
    if(result.n>0) {
      res.status(200).json({message: "Updated!",
      post :{
        ...result,
        imagePath: result.imagePath
      }
      });
    } else {
      res.status(401).json({
        message: "Unathorized Access!"
      })
    }

  }).catch((error) => {
    res.status(500).json({
      message: 'Post is not updaated yet!'
    });
  });
}

exports.getPostById = (req,res,next) => {
  PostSchema.findById(req.params.id)
  .then(post =>{
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post is not found'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Post is fetched!'
    });
  });
}

exports.getPost = (req,res,next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  let fetchPost;
  const postQuery = PostSchema.find();
   if(pageSize && currentPage) {
     postQuery
     .skip(pageSize * (currentPage -1))
     .limit(pageSize);
   }
 postQuery
 .then((result) =>{
  fetchPost = result;
  return PostSchema.count();
 })
 .then((count) => {
    res.status(200).json({
     message: 'Post Fetched Succesfull',
     posts: fetchPost,
     maxCount:count
    })
 })
 .catch(error => {
   res.status(500).json({
     message: 'Post is not fetched!'
   });
 });
 }

 exports.delete = (req,res,next) => {
  PostSchema.deleteOne({_id: req.params.id,creator: req.userData.uId})
  .then((result) => {
    if(result.n>0) {
      res.status(200).json({
        message: 'Post is deleted'
      });
    }
    else {
      res.status(401).json({
        message: 'Unauthorized access!'
      })
    }

  })
  .catch(error => {
    res.status(500).json({
      message: 'Post can not be deleted!'
    });
  });
}
