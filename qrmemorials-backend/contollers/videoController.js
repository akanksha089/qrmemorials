const axios = require('axios');
const db = require("../config/mysql_database");

exports.uploadVideoToVimeo = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const { name, description, package_id } = req.body;

    if (!package_id) {
      return res.status(400).json({ success: false, message: 'package_id is required' });
    }

    // Step 1: Initiate upload to Vimeo
    const initiateRes = await axios.post(
      'https://api.vimeo.com/me/videos',
      {
        upload: {
          approach: 'tus',
          size: buffer.length,
        },
        name: name || originalname,
        description: description || '',
        privacy: {
          view: 'unlisted',
        }
      },
      {
        headers: {
          // Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
          Authorization: "Bearer c73b094d7f469ef0c0bd43d6ba0c4059",
          'Content-Type': 'application/json',
        },
      }
    );

    const uploadLink = initiateRes.data.upload.upload_link;

    // Step 2: Upload video data via TUS
    await axios.patch(uploadLink, buffer, {
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': 0,
        'Tus-Resumable': '1.0.0',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const videoUri = initiateRes.data.uri;
    const playerUrl = `https://player.vimeo.com${videoUri}`;

    // Step 3: Save to your package_gallery table
 await db.query(
  `INSERT INTO package_gallery (package_id, type, media_url, vimeo_uri) VALUES (?, 'video', ?, ?)`,
  [package_id, playerUrl, videoUri]
);

    res.status(200).json({
      success: true,
      message: 'Video uploaded to Vimeo and associated with package gallery.',
      videoUri,
      playerUrl,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video to Vimeo',
      error: error.response?.data || error.message,
    });
  }
};
