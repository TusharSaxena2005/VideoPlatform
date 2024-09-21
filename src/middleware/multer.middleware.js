import multer from "multer";
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`File deleted successfully`);
        }
    });
};


export const upload = multer({
    storage,
})

export { deleteFile }