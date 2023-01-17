const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file", file);

    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/webp"
    ) {
      req.storeFile = "photo";
      cb(null, path.join(__dirname, "../public/resources/photos"));
    } else if (
      file.mimetype.includes(".document") ||
      file.mimetype.includes(".sheet")
    ) {
      req.storeFile = "document";
      cb(null, path.join(__dirname, "../public/resources/documents"));
    } else if (file.mimetype == "video/mp4") {
      req.storeFile = "video";
      cb(null, path.join(__dirname, "../public/resources/videos"));
    }
  },
  filename: function (req, file, cb) {
    console.log(file);
    let mimetype;
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/webp"
    ) {
      mimetype = file.mimetype.split("/")[file.mimetype.split.length - 1];
    } else if (
      file.mimetype.includes(".document") ||
      file.mimetype.includes(".sheet")
    ) {
      if (file.mimetype.includes(".document")) {
        mimetype = "docx";
      } else if (file.mimetype.includes(".sheet")) {
        mimetype = ".xlsx";
      }
    } else if (file.mimetytpe == "video/mp4") {
      mimetype = file.mimetype.split("/")[1];
    }
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + mimetype;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

function fileFilter(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  console.log(req, file, cb);

  // To reject this file pass `false`, like so:
  cb(null, false);

  // To accept the file pass `true`, like so:
  cb(null, true);

  // You can always pass an error if something goes wrong:
  // cb(new Error("I don't have a clue!"));
}

const upload = multer({ storage: storage });

module.exports = upload;
