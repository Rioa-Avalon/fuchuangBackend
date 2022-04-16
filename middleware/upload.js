const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;

const storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
        console.log(file.mimetype)
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${file.originalname}`;
            return filename + ' file not support';
        }

        return {
            bucketName: 'images',
            filename: `${Date.now()}-${file.originalname}`
        }
    }
});

module.exports = multer({ storage });