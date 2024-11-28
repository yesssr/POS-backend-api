const multer = require("multer");
const { SendError } = require("../middleware/error");

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(file.originalname);

  if (extname) {
    cb(null, true);
  } else {
    cb(
      new SendError("Image uploaded is not of type jpg/jpeg or png", 400),
      false
    );
  }
};

exports.uploadImage = () => {
  const upload = multer({
    fileFilter: fileFilter,
    limits: { fileSize: 5000000 },
  });
  return upload;
}
