// const multer = require("multer");

// For uploading documents either pdfs , docx , video, pictures


// const FILE_TYPE_MAP = {
//   'image/png' : 'png',
//   'image/jpeg': 'jpeg',
//   'image/jpg' : "jpg"
// }

// // user upload
// const storage_image = multer.diskStorage({

//   destination: function (req, file, cb) {
//     const isValid = FILE_TYPE_MAP[file.mimetype]
//     let uploadErr = new Error('Invalid Image Type')
//     if (isValid)  uploadErr = null
//     cb(uploadErr, "user/uploads");
//   },

//   filename: function (req, file, cb) {
//     const fileName = file.originalname.replace(" ", "-")
//     const real_name = fileName.split(fileName[fileName.lastIndexOf('.')])[0];
//     const extension = FILE_TYPE_MAP[file.mimetype]
//     cb(null, `${real_name}-${Date.now()}.${extension}`);
//   },
// });

// // product upload
// const storage_product = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const isValid = FILE_TYPE_MAP[file.mimetype]
//     let uploadErr = new Error('Invalid Image Type')
//     if (isValid)  uploadErr = null
//     cb(null, "product/uploads");
//   },
//   filename: function (req, file, cb) {
//     const fileName = file.originalname.replace(" ", "-")
//     const real_name = fileName.split(fileName[fileName.lastIndexOf('.')])[0];
//     const extension = FILE_TYPE_MAP[file.mimetype]
//     cb(null, `${real_name}-${Date.now()}.${extension}`);
//   },
// });

// const upload_product = multer({ storage:storage_product });
// const upload_image = multer({ storage: storage_image });

// module.exports = {
//   upload_image,
//   upload_product,
// };
