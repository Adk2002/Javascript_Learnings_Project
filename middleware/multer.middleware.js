import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname === "profilePic"){
            cb(null, 'uploads/profilePics/');
        }else if (file.fieldname === "images"){
            cb(null, 'uploads/images/');
        }else{
            cb(new Error("Invalid field name"), null);
        }
    },

    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        const ext = path.extname(file.originalname); //get original file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); //Create filename: filedname-timestamp-extension
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed!'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

export const uploadProfilePic = upload.single('profilePic');
export const uploadImages = upload.array('images', 10);

// For handling both profilePic and images in a single request
export const uploadMixed = upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'images', maxCount: 10 }
])