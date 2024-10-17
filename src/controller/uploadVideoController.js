const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "../../prj-stag-gobumpr-service-6567-86059d44965a.json"
  ),
  projectId: "prj-stag-gobumpr-service-6567",
});




// Middleware to handle file uploads
const upload = multer({ dest: "uploads/" });

// Function to upload video to GCS
async function uploadVideoToGCS(req, res) {
  try {
    const bucketName = "bkt-gobumper-stag-02";
    const destinationFileName = `rsavideos/${req.file.originalname}`;

    await storage.bucket(bucketName).upload(req.file.path, {
      destination: destinationFileName,
      contentType: "video/mp4",
    });

    // Calculate expiration date one year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    // Generate a signed URL for the uploaded file
    const [url] = await storage
      .bucket(bucketName)
      .file(destinationFileName)
      .getSignedUrl({ action: "read", expires: oneYearFromNow });

    // Send the URL as part of the response
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    res.status(200).json({
      success: true,
      message: "Video uploaded to GCS successfully",
      url,
    });
  } catch (error) {
    console.error("Error uploading video to GCS:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while uploading video to GCS",
    });
  }
}

module.exports = { upload, uploadVideoToGCS };

//rsa -images
