const router = require('express').Router()
const postController = require('../controllers/post.controller')
const uploadController = require('../controllers/upload.controller')
const multer = require('multer')
const upload = multer()


router.get('/', postController.readPost)
router.post('/', upload.single('file'), postController.createPost)
router.put('/', postController.updatePost)
router.delete('/:id', postController.deletePost)
router.patch('/like-post/:id', postController.likePost)
router.patch('/unlike-post/:id', postController.unlikePost)

//comments

router.patch('/comment-post/:id', postController.commentPost)
router.patch('/edit-comment-post:id', postController.editCommentPost)
router.patch('/delete-comment-post/:id', postController.deleteCommentPost)


// upload
router.post('/upload', upload.single('file'), uploadController.uploadProfil)

module.exports = router