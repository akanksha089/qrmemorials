const axios = require('axios');
const db = require("../config/mysql_database");
const fs = require('fs');
const path = require('path');
// exports.uploadVideoToVimeo = async (req, res) => {
//   try {
//     const { originalname, buffer } = req.file;
//     const { name, description, package_id } = req.body;

//     if (!package_id) {
//       return res.status(400).json({ success: false, message: 'package_id is required' });
//     }

//     // Step 1: Initiate upload to Vimeo
//     const initiateRes = await axios.post(
//       'https://api.vimeo.com/me/videos',
//       {
//         upload: {
//           approach: 'tus',
//           size: buffer.length,
//         },
//         name: name || originalname,
//         description: description || '',
//         privacy: {
//           view: 'unlisted',
//         }
//       },
//       {
//         headers: {
//           // Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
//           Authorization: "Bearer c73b094d7f469ef0c0bd43d6ba0c4059",
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const uploadLink = initiateRes.data.upload.upload_link;

//     // Step 2: Upload video data via TUS
//     await axios.patch(uploadLink, buffer, {
//       headers: {
//         'Content-Type': 'application/offset+octet-stream',
//         'Upload-Offset': 0,
//         'Tus-Resumable': '1.0.0',
//       },
//       maxContentLength: Infinity,
//       maxBodyLength: Infinity,
//     });

//     const videoUri = initiateRes.data.uri;
//     const playerUrl = `https://player.vimeo.com${videoUri}`;

//     // Step 3: Save to your package_gallery table
//  await db.query(
//   `INSERT INTO package_gallery (package_id, type, media_url, vimeo_uri) VALUES (?, 'video', ?, ?)`,
//   [package_id, playerUrl, videoUri]
// );

//     res.status(200).json({
//       success: true,
//       message: 'Video uploaded to Vimeo and associated with package gallery.',
//       videoUri,
//       playerUrl,
//     });
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to upload video to Vimeo',
//       error: error.response?.data || error.message,
//     });
//   }
// };




exports.uploadVideoToVimeo = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const { name, description, package_id } = req.body;

    if (!package_id) {
      return res.status(400).json({ success: false, message: 'package_id is required' });
    }

    const videoName = name || originalname;

    try {
      // Step 1: Initiate Vimeo Upload
      const initiateRes = await axios.post(
        'https://api.vimeo.com/me/videos',
        {
          upload: {
            approach: 'tus',
            size: buffer.length,
          },
          name: videoName,
          description: description || '',
          privacy: { view: 'unlisted' },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`, // use valid token!
            'Content-Type': 'application/json',
          },
        }
      );

      const uploadLink = initiateRes.data.upload.upload_link;

      // Step 2: Upload video binary to Vimeo
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

      // Step 3: Save to DB
      await db.query(
        `INSERT INTO package_gallery (package_id, type, media_url, vimeo_uri) VALUES (?, 'video', ?, ?)`,
        [package_id, playerUrl, videoUri]
      );

      return res.status(200).json({
        success: true,
        message: 'Video uploaded to Vimeo successfully',
        videoUri,
        playerUrl,
      });

    } catch (vimeoError) {
      console.warn('⚠️ Vimeo upload failed. Saving locally...', vimeoError?.response?.data || vimeoError.message);

      // Fallback: Save locally
      const uploadsDir = path.join(__dirname, '../uploads/videos');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, `${Date.now()}_${originalname}`);
      fs.writeFileSync(filePath, buffer);

      const mediaUrl = `/uploads/videos/${path.basename(filePath)}`;

      await db.query(
        `INSERT INTO package_gallery (package_id, type, media_url, vimeo_uri) VALUES (?, 'video', ?, NULL)`,
        [package_id, mediaUrl]
      );

      return res.status(200).json({
        success: true,
        message: ' Video upload successfully.',
        mediaUrl,
      });
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      error: error.message,
    });
  }
};

exports.getPackageVideos = async (req, res) => {
  try {
    const package_id = req.params.packageId;

    if (!package_id) {
      return res.status(400).json({ success: false, message: 'package_id is required' });
    }

    const [videos] = await db.query(
      `SELECT id, media_url, vimeo_uri FROM package_gallery WHERE package_id = ? AND type = 'video'`,
      [package_id]
    );

    const hostUrl = `${req.protocol}://${req.get('host')}`;

    const updatedVideos = videos.map(video => {
      let fullMediaUrl = null;

      if (video.media_url) {
        const encodedPath = encodeURI(video.media_url); // Encode path (spaces, special chars)
        fullMediaUrl = `${hostUrl}${encodedPath}`;
      }

      return {
        id: video.id,
        media_url: fullMediaUrl,
        vimeo_uri: video.vimeo_uri,
        vimeo_url: video.vimeo_uri ? `https://player.vimeo.com${video.vimeo_uri}` : null,
      };
    });

    res.status(200).json({
      success: true,
      videos: updatedVideos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve videos',
      error: error.message,
    });
  }
};


