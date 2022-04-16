const upload = require('../middleware/upload');
const router = require('express').Router();


// @route   POST /api/image/upload
// @desc    Upload image
router.post("/upload", upload.single(""), async (req, res) => {
    if (req.file === undefined) {
        return res.status(400).json({ msg: "No file uploaded" });
    }
    const imgUrl = req.file.filename
    return res.send(imgUrl)
})


module.exports = router;