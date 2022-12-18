const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const xml2js = require("xml2js");
const unzipper = require("unzipper");
const catchAsync = require("../../utils/catchAsync");

exports.createDocument = catchAsync(async (req, res, next) => {
  var dir = path.join(
    __dirname,
    "../public/uploads/xml",
    req.file.filename.split(".zip")[0]
  );

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  await fs
    .createReadStream(req.file.path)
    .pipe(
      unzipper.Extract({
        path: path.join(
          __dirname,
          "../public/uploads/xml",
          req.file.filename.split(".zip")[0]
        ),
      })
    )
    .promise();

  console.log(req.file);

  const document = new Document({
    fileName: req.file.filename.split(".zip")[0],
    path: dir + "/word/document.xml",
    ext: req.file.originalname.split(".")[1],
  });

  const newDocument = await document.save();
  return res.json({
    newDocument,
  });
});
