const multer = require("multer");

exports.uploadFile = (
  imageFile,
  detail_one,
  detail_two,
  detail_three,
  attachment,
  profileImage
) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      switch (file.fieldname) {
        case "imageFile":
        case "detail_one":
        case "detail_two":
        case "detail_three":
          cb(null, "uploads/houses"); //Lokasi penyimpanan file
          break;
        case "attachment":
          cb(null, "uploads/transaction"); //Lokasi penyimpanan file
          break;
        case "profileImage":
          cb(null, "uploads/profile"); //Lokasi penyimpanan file
          break;
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  // Function untuk filter file berdasarkan type
  const fileFilter = function (req, file, cb) {
    if (
      file.fieldname === imageFile &&
      file.fieldname === detail_one &&
      file.fieldname === detail_two &&
      file.fieldname === detail_three &&
      file.fieldname === attachment &&
      file.fieldname === profileImage
    ) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|git|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }
    cb(null, true);
  };

  const sizeInMb = 10;
  const maxSize = sizeInMb * 1000 * 1000; //10Mb

  // Eksekusi upload multer dan menentukan disk storage, validation dan maxSize file
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: imageFile,
      maxCount: 1,
    },
    {
      name: detail_one,
      maxCount: 1,
    },
    {
      name: detail_two,
      maxCount: 1,
    },
    {
      name: detail_three,
      maxCount: 1,
    },
    {
      name: attachment,
      maxCount: 1,
    },
    {
      name: profileImage,
      maxCount: 1,
    },
  ]); //Menentukan jumlah file

  return (req, res, next) => {
    upload(req, res, function (err) {
      // Pesan error jika validasi gagal
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      // Jika file upload tidak ada
      if (!req.files && !err) {
        return res.status(400).send({
          message: "Please select files to upload",
        });
      }

      if (err) {
        // Jika size melebihi batas
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10Mb",
          });
        }
        console.log("Saya Error Akhir", err);
        return res.status(400).send({
          message: "Failed Akhir",
          status: err,
        });
      }
      return next();
    });
  };
};
