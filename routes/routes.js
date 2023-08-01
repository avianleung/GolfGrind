const s3Storage = require("multer-s3");

module.exports = (app) => {
  const entries = require("../controllers/controller.js");
  var router = require("express").Router();
  
  const multer = require("multer");
  const multerS3 = require("multer-s3");
  const { S3Client } = require("@aws-sdk/client-s3");

  // create s3 instance using S3Client 
  // (this is how we create s3 instance in v3)
  const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      region: "ca-central-1" // this is the region that you select in AWS account
  })

  const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
  });

  const upload = multer({
    storage: s3Storage,
})

  // Retrieve all Entries
  router.get("/", entries.getAllEntries);

  // Create a new Entry
  router.post("/", upload.single('file'), entries.createEntry);

  // Update an Entry with id
  router.put("/:entryId", entries.updateEntry);

  // Delete an Entry with id
  router.delete("/:entryId", entries.deleteEntry);

  // Add a Comment to an Entry
  router.post("/:entryId", entries.addCommentToEntry);

  // Delete a Comment from Entry
  router.delete("/:entryId/:commentId", entries.deleteCommentFromEntry);

  app.use("/api/golfgrind", router);
};
