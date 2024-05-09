const Post = require("../model/VideoModel");

// exports.createPost = async (req, res) => {
//   try {
//     const {
//       mUserId,
//       mSearchStr,
//       mDateFrom,
//       mDateTo,
//       mDate,
//       mTitle,
//       mDescription,
//       isLiked,
//       mComment,
//     } = req.body;

//     const newPost = await Post.create({
//       mUserId,
//       mSearchStr,
//       mDateFrom,
//       mDateTo,
//       mDate,
//       mTitle,
//       mThumbnailImage: req.file.path, // Save the image file path in the database
//       mDescription,
//       mVideoUrl: req.file.path, // Save the video file path in the database
//       isLiked,
//       mComment,
//     });

//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createPost = async (req, res) => {
  try {
    const { userId, title, description, currentDateTime } = req.body;
    const videoURL = req.file.path; // Use the path of the uploaded file
    const thumbnailImage = req.file.path;

    const newPost = await Post.create({
      userId,
      videoURL,
      thumbnailImage,
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

exports.getVideosByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const videos = await Post.findAll({ where: { userId, isDisabled: 1 } });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.insertVideosToGarages = async (selectedGarages, selectedVideos) => {
  try {
    const bulkInsertData = [];

    for (const garageId of selectedGarages) {
      // Check existing records for current garageId
      const existingVideoIds = await Post.findAll({
        where: {
          userId: garageId,
          videoId: selectedVideos.map(video => video.id),
        },
        attributes: ['videoId'], // Only fetch videoId to check existing records
        raw: true,
      });

      // Filter selectedVideos based on existing records for current garageId
      const filteredVideos = selectedVideos.filter(video => {
        return !existingVideoIds.some(existing => existing.videoId === video.id);
      });

      // Create bulk insert data for filtered videos
      for (const video of filteredVideos) {
        const videoData = {
          userId: garageId,
          videoId: video.id,
          VideoUrl: video.url,
          Title: video.name,
          Description: video.description,
        };
        bulkInsertData.push(videoData);
      }
    }
    if (bulkInsertData.length > 0) {
      await Post.bulkCreate(bulkInsertData);
    }

    return {
      success: true,
      message: "Videos inserted to garages successfully",
    };
  } catch (error) {
    console.error("Error inserting videos to garages:", error);
    return {
      success: false,
      error: "An error occurred while inserting videos to garages",
    };
  }
};
// exports.insertVideosToGarages = async (selectedGarages, selectedVideos) => {
//   try {
//     const bulkInsertData = [];

//     for (const garageId of selectedGarages) {
//       for (const video of selectedVideos) {
//         const videoData = {
//           userId: garageId,
//           videoId: video.id,
//           VideoUrl: video.url,
//           Title: video.name,
//           Description: video.description,
//         };
//         bulkInsertData.push(videoData);
//       }
//     }

//     await Post.bulkCreate(bulkInsertData);

//     return {
//       success: true,
//       message: "Videos inserted to garages successfully",
//     };
//   } catch (error) {
//     console.error("Error inserting videos to garages:", error);
//     return {
//       success: false,
//       error: "An error occurred while inserting videos to garages",
//     };
//   }
// };

exports.updatedisableFlag = async (req, res) => {
  const { videoIds, isEnabled } = req.body;

  try {
    // Update isEnabled to 0 for the selected videos
    for (const videoId of videoIds) {
      const result = await Post.update(
        { isDisabled: 0 },
        { where: { videoId: videoId } }
      );

      if (result[0] > 0) {
        // Video was updated successfully
        console.log(`Video ${videoId} updated: isEnabled set to ${isEnabled}`);
      } else {
        // No video found with the given ID
        console.log(`No video found with ID ${videoId}`);
      }
    }

    res.status(200).json({ success: true, message: 'Videos deleted successfully' });

  } catch (error) {
    console.error('Error deleting videos:', error);
    res.status(500).json({ success: false, message: 'Failed to delete videos' });
  }
};

