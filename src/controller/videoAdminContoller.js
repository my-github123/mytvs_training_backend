const AdminVideo = require("../model/VideoAdminModel");

exports.createAdminPost = async (req, res) => {
  try {
    const { adminUserId, videoUrl, title, description, currentDateTime } = req.body;
    // const videoURL = req.file.path;
    const newPost = await AdminVideo.create({
      adminUserId,
      videoUrl,
      title,
      description,
      currentDateTime,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getVideosByAdminId = async (req, res) => {
  const { adminUserId } = req.params;

  try {
    const videos = await AdminVideo.findAll({ where: { adminUserId } });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


