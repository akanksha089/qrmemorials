const Model = require("../models/packageModel");
const QueryModel = require("../models/queryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const db = require("../config/mysql_database");
const Joi = require("joi");
const { htmlToText } = require("html-to-text");
const { format } = require("date-fns");

const table_name = Model.table_name;
const module_title = Model.module_title;
const module_single_title = Model.module_single_title;
const module_add_text = Model.module_add_text;
const module_edit_text = Model.module_edit_text;
const module_slug = Model.module_slug;
const module_layout = Model.module_layout;

// ADD FORM
exports.addFrom = catchAsyncErrors(async (req, res, next) => {
  res.render(module_slug + "/add", {
    layout: module_layout,
    title: module_single_title + " " + module_add_text,
    module_slug,
  });
});


exports.createRecord = catchAsyncErrors(async (req, res, next) => {
  try {
    // Debug logging
    console.log("📁 Uploaded file:", req.file);
    console.log("📨 Raw form data:", req.body);

    // Validate required image
    if (!req.file) {
      throw new Error("Image file is required.");
    }

    // Parse features from form data
    const features = [];

    // Method 1: Check if features are already in array format
    if (req.body.features && Array.isArray(req.body.features)) {
      features.push(...req.body.features.filter(f => f.title && f.description));
    }
    // Method 2: Parse from form field names
    else {
      // Get all feature indices
      const featureIndices = new Set();
      for (const key in req.body) {
        const match = key.match(/^features\[(\d+)\]\[(title|description)\]$/);
        if (match) {
          featureIndices.add(parseInt(match[1]));
        }
      }

      // Build features array
      for (const index of featureIndices) {
        const title = req.body[`features[${index}][title]`];
        const description = req.body[`features[${index}][description]`];

        if (title && description) {
          features.push({ title, description });
        }
      }
    }

    // Validate at least one feature
    if (features.length === 0) {
      throw new Error("At least one feature with title and description is required.");
    }

    // Prepare data for database
    const packageData = {
      title: req.body.title,
      price: req.body.price,
      image: req.file ? req.file.filename : null, // Just store filename
      features: JSON.stringify(features),
      created_at: new Date(),
      updated_at: new Date()
    };

    // Save to database
    const result = await QueryModel.saveData(table_name, packageData);
    const newPackageId = result.insertId || result.id;

    // Success response
    const response = {
      success: true,
      message: "Package created successfully",
      package: {
        id: newPackageId,
        ...packageData,
        image_url: packageData.image
          ? `${req.protocol}://${req.get('host')}/uploads/packages/${packageData.image}`
          : null,
        features: features
      }
    };

    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.status(201).json(response);
    }

    req.flash("success", "Package created successfully");
    return res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);

  } catch (error) {
    console.error("Package creation error:", error);

    const errorMessage = error.details
      ? error.details.map(d => d.message).join(", ")
      : error.message;

    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }

    req.flash("error", errorMessage);
    return res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}/add`);
  }
});


// EDIT FORM
exports.editForm = catchAsyncErrors(async (req, res, next) => {
  const record = await QueryModel.findById(table_name, req.params.id, next);
  if (!record) return;

  // Parse features back into array of objects
  record.features = JSON.parse(record.features || "[]");

  res.render(module_slug + "/edit", {
    layout: module_layout,
    title: module_single_title + " " + module_edit_text,
    record,
    module_slug,
  });
});

// UPDATE RECORD
exports.updateRecord = catchAsyncErrors(async (req, res, next) => {
  try {
    // ✅ 1. Reconstruct features[] from flat form input
    const featureMap = {};

    for (const key in req.body) {
      const match = key.match(/^features\[(\d+)\]\[(title|description)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!featureMap[index]) {
          featureMap[index] = {};
        }

        featureMap[index][field] = req.body[key].trim(); // remove extra spaces
      }
    }

    const featuresArray = Object.values(featureMap).filter(
      (f) => f.title && f.description
    );

    console.log("Raw featureMap:", featureMap);
    console.log("Valid featuresArray:", featuresArray);

    // ✅ 2. Validate that at least one valid feature is present
    if (featuresArray.length === 0) {
      throw new Error("At least one valid feature with title and description is required.");
    }

    // ✅ 3. Inject features into req.body before validation
    req.body.features = featuresArray;

    // ✅ 4. Joi validation
    await Model.insertSchema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    // ✅ 5. Prepare data for update
    const data = {
      title: req.body.title,
      price: req.body.price,
      features: JSON.stringify(featuresArray),
      updated_at: new Date(),
    };

    // ✅ 6. Update DB record
    await QueryModel.findByIdAndUpdateData(table_name, req.params.id, data, next);

    // ✅ 7. Send response
    const wantsJson = req.xhr || req.headers.accept?.includes("application/json");

    if (wantsJson) {
      return res.status(200).json({
        success: true,
        message: "Package updated successfully",
      });
    } else {
      req.flash("msg_response", {
        status: 200,
        message: "Package updated successfully",
      });
      return res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);
    }

  } catch (error) {
    console.error("❌ Error in updateRecord:", error);

    const errMsg = error.details
      ? error.details.map((d) => d.message).join(", ")
      : error.message;

    const wantsJson = req.xhr || req.headers.accept?.includes("application/json");

    if (wantsJson) {
      return res.status(400).json({ success: false, error: errMsg });
    } else {
      req.flash("msg_response", { status: 400, message: errMsg });
      return res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}/edit/${req.params.id}`);
    }
  }
});



// DELETE RECORD
exports.deleteRecord = catchAsyncErrors(async (req, res, next) => {
  await QueryModel.findByIdAndDelete(table_name, req.params.id, next);

  res.status(200).json({
    success: true,
    message: "Package deleted successfully",
  });
});



exports.deleteImage = catchAsyncErrors(async (req, res, next) => {
  const updateData = {
    image: "",
  };

  const blog = await QueryModel.findByIdAndUpdateData(
    table_name,
    req.params.id,
    updateData,
    next
  );

  req.flash("msg_response", {
    status: 200,
    message: "Successfully updated " + module_single_title,
  });

  res.redirect(
    `/${process.env.ADMIN_PREFIX}/${module_slug}/edit/${req.params.id}`
  );
});

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+$/g, ""); // Remove trailing hyphens
}
exports.getAllRecords = catchAsyncErrors(async (req, res, next) => {
  // Fetching records from the database
  const [records] = await db.query(`SELECT * FROM ${table_name} ORDER BY id DESC`);

  // Ensure the records are in the correct format before passing them to the EJS
  const parsedRecords = records.map((r) => ({
    ...r,
    features: JSON.parse(r.features || "[]"),
  }));
  const message = req.flash('msg_response');
  res.render(module_slug + '/index', { layout: module_layout, title: module_title, message, records: parsedRecords, module_slug })

});


// GET SINGLE RECORD
exports.getSingleRecord = catchAsyncErrors(async (req, res, next) => {
  // Fetch the record from the database by ID
  const record = await QueryModel.findById(table_name, req.params.id, next);

  if (!record) {
    return next(new ErrorHandler("Package not found", 404));
  }

  // Parse the 'features' array from the record (if exists)
  record.features = JSON.parse(record.features || "[]");
  res.render(module_slug + '/detail', { layout: module_layout, title: module_single_title, record: record, })

});

exports.apiGetAllRecords = catchAsyncErrors(async (req, res, next) => {
  const [records] = await db.query(`SELECT * FROM ${table_name} ORDER BY id DESC`);

  const recordsWithUrls = records.map(record => ({
    ...record,
    features: JSON.parse(record.features || '[]'),
    image_url: record.image
      ? `${req.protocol}://${req.get('host')}/uploads/packages/${record.image}`
      : null
  }));

  res.status(200).json({
    success: true,
    data: recordsWithUrls
  });
});

exports.apiGetSingleRecord = catchAsyncErrors(async (req, res, next) => {
  const record = await QueryModel.findById(table_name, req.params.id, next);

  if (!record) {
    return next(new ErrorHandler("Record not found", 404));
  }
  record.features = JSON.parse(record.features || '[]');
  record.image_url = record.image ? `${req.protocol}://${req.get('host')}/uploads/packages/${record.image}`
    : null;
  res.status(200).json({
    success: true,
    data: record,
  });
});

// Controller: getPurchasedPackagesForUser
exports.getPurchasedPackagesForUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const [records] = await db.query(`
    SELECT 
      p.*, 
      oi.quantity,
      o.id AS order_id,
      o.created_at AS order_date
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN packages p ON p.id = oi.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [userId]);

  const packages = records.map(pkg => ({
    ...pkg,
    features: JSON.parse(pkg.features || '[]'),
    image_url: pkg.image ? `${req.protocol}://${req.get("host")}/uploads/packages/${pkg.image}` : null
  }));

  res.status(200).json({
    success: true,
    packages
  });
});


exports.createPackageBiography = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      package_id,
      full_name,
      cemetery_name,
      birth_date,
      death_date,
      cemetery_location,
      photo_position,
      biography_text,
      grave_location,
      link_text_1,
      link_url_1,
      link_text_2,
      link_url_2,
      link_text_3,
      link_url_3,
      link_text_4,
      link_url_4,
      account_type
    } = req.body;

    const files = req.files || {};

    // Log for debugging
    console.log("Uploaded Files:", files);

    const profile_photo = files.profile_photo?.[0]?.filename || null;
    const background_photo = files.background_photo?.[0]?.filename || null;
    const biography_photo = files.biography_photo?.[0]?.filename || null;

    // Insert into DB
    await db.query(
      `INSERT INTO package_biographies 
        (package_id, full_name, cemetery_name, birth_date, death_date, profile_photo, background_photo, cemetery_location, biography_photo, photo_position, biography_text, grave_location, link_text_1, link_url_1, link_text_2, link_url_2, link_text_3, link_url_3, link_text_4, link_url_4, account_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        package_id,
        full_name,
        cemetery_name,
        birth_date,
        death_date,
        profile_photo,
        background_photo,
        cemetery_location,
        biography_photo,
        photo_position,
        biography_text,
        grave_location,
        link_text_1,
        link_url_1,
        link_text_2,
        link_url_2,
        link_text_3,
        link_url_3,
        link_text_4,
        link_url_4,
        account_type
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Biography created successfully",
    });

  } catch (error) {
    // Handle and forward error only once
    console.error("Biography creation failed:", error);
    return next(error); // forwarded to global error handler
  }
});

exports.updatePackageBiography = catchAsyncErrors(async (req, res, next) => {
  const biographyId = req.params.id;

  const {
    package_id,
    full_name,
    cemetery_name,
    birth_date,
    death_date,
    cemetery_location,
    photo_position,
    biography_text,
    grave_location,
    link_text_1,
    link_url_1,
    link_text_2,
    link_url_2,
    link_text_3,
    link_url_3,
    link_text_4,
    link_url_4,
    account_type,
  } = req.body;

  const files = req.files || {};
  const profile_photo = files.profile_photo?.[0]?.filename || null;
  const background_photo = files.background_photo?.[0]?.filename || null;
  const biography_photo = files.biography_photo?.[0]?.filename || null;

  // Prepare fields and values to update
  const updateFields = [
    "package_id = ?",
    "full_name = ?",
    "cemetery_name = ?",
    "birth_date = ?",
    "death_date = ?",
    "cemetery_location = ?",
    "photo_position = ?",
    "biography_text = ?",
    "grave_location = ?",
    "link_text_1 = ?",
    "link_url_1 = ?",
    "link_text_2 = ?",
    "link_url_2 = ?",
    "link_text_3 = ?",
    "link_url_3 = ?",
    "link_text_4 = ?",
    "link_url_4 = ?",
    "account_type = ?"
  ];

  // Add photo columns if new files uploaded (optional)
  if (profile_photo) updateFields.push("profile_photo = ?");
  if (background_photo) updateFields.push("background_photo = ?");
  if (biography_photo) updateFields.push("biography_photo = ?");

  // Collect values in the same order
  const values = [
    package_id,
    full_name,
    cemetery_name,
    birth_date,
    death_date,
    cemetery_location,
    photo_position,
    biography_text,
    grave_location,
    link_text_1,
    link_url_1,
    link_text_2,
    link_url_2,
    link_text_3,
    link_url_3,
    link_text_4,
    link_url_4,
    account_type,
  ];

  if (profile_photo) values.push(profile_photo);
  if (background_photo) values.push(background_photo);
  if (biography_photo) values.push(biography_photo);

  values.push(biographyId);

  const sql = `UPDATE package_biographies SET ${updateFields.join(", ")} WHERE id = ?`;

  await db.query(sql, values);

  res.status(200).json({ success: true, message: "Biography updated successfully" });
});

exports.apiGetSingleBiography = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const [rows] = await db.query("SELECT * FROM package_biographies WHERE id = ?", [id]);

  if (!rows.length) {
    return res.status(404).json({ success: false, error: "Biography not found" });
  }

  const biography = rows[0];

  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/packages`;

  biography.profile_photo = biography.profile_photo
    ? `${baseUrl}/${biography.profile_photo}`
    : null;

  biography.background_photo = biography.background_photo
    ? `${baseUrl}/${biography.background_photo}`
    : null;

  biography.biography_photo = biography.biography_photo
    ? `${baseUrl}/${biography.biography_photo}`
    : null;

  res.status(200).json({ success: true, biography });
});

// Controller: uploadGalleryImages
exports.uploadGalleryImages = catchAsyncErrors(async (req, res, next) => {
  const packageId = req.params.id;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, message: 'No images uploaded.' });
  }

  // Insert images into gallery with type = 'image'
  const insertValues = files.map(file => [
    packageId,
    'image',
    file.filename, // media_url
    null           // vimeo_uri for images is null
  ]);

  await db.query(
    'INSERT INTO package_gallery (package_id, type, media_url, vimeo_uri) VALUES ?',
    [insertValues]
  );

  const imageUrls = files.map(file => `${req.protocol}://${req.get('host')}/uploads/gallery/${file.filename}`);

  res.status(200).json({
    success: true,
    message: `${files.length} images uploaded successfully.`,
    images: imageUrls
  });
});


exports.getPackageGallery = catchAsyncErrors(async (req, res, next) => {
  const packageId = req.params.id;

  const [rows] = await db.query(
     `SELECT type, media_url 
     FROM package_gallery 
     WHERE package_id = ? AND type = 'image' 
     ORDER BY created_at DESC`,
    [packageId]
  );

  const mediaItems = rows.map(row => ({
    type: row.type,
    url: row.type === 'image'
      ? `${req.protocol}://${req.get('host')}/uploads/gallery/${row.media_url}`
      : row.media_url
  }));

  res.status(200).json({
    success: true,
    gallery: mediaItems
  });
});

exports.createPackageEulogy = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      package_id,
      eulogy_text,
    } = req.body;

    // Insert into DB
    await db.query(
      `INSERT INTO package_eulogy 
        (package_id, eulogy_text)
       VALUES (?, ?)`,
      [
        package_id,
        eulogy_text,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Eulogy created successfully",
    });

  } catch (error) {
    // Handle and forward error only once
    console.error("Eulogy creation failed:", error);
    return next(error); // forwarded to global error handler
  }
});

exports.updatePackageEulogy = catchAsyncErrors(async (req, res, next) => {
  const eulogyId = req.params.id;

  const {
    package_id,
    eulogy_text,
  } = req.body;

  // Prepare fields and values to update
  const updateFields = [
    "package_id = ?",
    "eulogy_text = ?",
  ];


  // Collect values in the same order
  const values = [
    package_id,
    eulogy_text,
  ];

  values.push(eulogyId);

  const sql = `UPDATE package_eulogy SET ${updateFields.join(", ")} WHERE id = ?`;

  await db.query(sql, values);

  res.status(200).json({ success: true, message: "Eulogy updated successfully" });
});

exports.apiGetSingleEulogy = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const [rows] = await db.query("SELECT * FROM package_eulogy WHERE id = ?", [id]);

  if (!rows.length) {
    return res.status(404).json({ success: false, error: "Eulogy not found" });
  }

  const eulogy = rows[0];

  res.status(200).json({ success: true, eulogy });
});

exports.createFamilyMembers = catchAsyncErrors(async (req, res, next) => {
  const { package_id, members } = req.body;

  if (!package_id || !Array.isArray(members)) {
    return res.status(400).json({ success: false, message: "Missing package_id or members array" });
  }

  const insertValues = members.map(member => [package_id, member.relation, member.name, member.sortNumber]);

  await db.query(
    `INSERT INTO package_family_members (package_id, relation, name, sort_number) VALUES ?`,
    [insertValues]
  );

  res.status(201).json({ success: true, message: "Family members added successfully" });
});
exports.getFamilyMembers = catchAsyncErrors(async (req, res, next) => {
  const { packageId } = req.params;

  const [rows] = await db.query(
    `SELECT id, relation, name, sort_number FROM package_family_members WHERE package_id = ? ORDER BY sort_number ASC`,
    [packageId]
  );

  res.status(200).json({ success: true, members: rows });
});
exports.updateFamilyMembers = catchAsyncErrors(async (req, res, next) => {
  const { package_id, members } = req.body;

  if (!package_id || !Array.isArray(members)) {
    return res.status(400).json({ success: false, message: "Missing package_id or members array" });
  }

  // Delete old members
  await db.query(`DELETE FROM package_family_members WHERE package_id = ?`, [package_id]);

  // Insert new ones
  const insertValues = members.map(member => [package_id, member.relation, member.name, member.sortNumber]);

  await db.query(
    `INSERT INTO package_family_members (package_id, relation, name, sort_number) VALUES ?`,
    [insertValues]
  );

  res.status(200).json({ success: true, message: "Family members updated successfully" });
});

exports.createPackageTributes = catchAsyncErrors(async (req, res, next) => {
  try {
    // Destructure necessary fields from request body
    const {
      package_id,
      full_name,
      email,
      relation,
      memory_text,
      tribute_text,
    } = req.body;

    // Handle file uploads
    const files = req.files || {}; // Default to empty object if no files are uploaded

    // Log the uploaded files for debugging
    console.log("Uploaded Files:", files);

    // Check if profile photo is uploaded, otherwise set it to null
    const profile_photo = files.profile_photo?.[0]?.filename || null;

    // Log request body for debugging
    console.log("Request Body:", req.body);

    // Insert the tribute data into the database
    const result = await db.query(
      `INSERT INTO package_tributes 
       (package_id, full_name, email, relation, memory_text, profile_photo, tribute_text)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        package_id,
        full_name,
        email,
        relation,
        memory_text,
        profile_photo,
        tribute_text
      ]
    );

    // Log the result of the query for debugging
    console.log("DB Insert Result:", result);

    // Respond with success message
    return res.status(201).json({
      success: true,
      message: "Tribute created successfully",
    });

  } catch (error) {
    // Log the error for debugging
    console.error("Error during tribute creation:", error);

    // Forward the error to the global error handler
    return next(error); 
  }
});

// exports.updatePackageTributes = catchAsyncErrors(async (req, res, next) => {
//   const tributesId = req.params.id;

//   const {
//     package_id,
//     full_name,
//     email,
//     relation,
//     memory_text,
//     tribute_text,
//   } = req.body;

//   const files = req.files || {};
//   const profile_photo = files.profile_photo?.[0]?.filename || null;

//   // Prepare fields and values to update
//   const updateFields = [
//     "package_id = ?",
//     "full_name = ?",
//     "email = ?",
//     "relation = ?",
//     "memory_text = ?",
//     "profile_photo = ?",
//     "tribute_text = ?",
//   ];

//   // Add photo columns if new files uploaded (optional)
//   if (profile_photo) updateFields.push("profile_photo = ?");

//   // Collect values in the same order
//   const values = [
//     package_id,
//     full_name,
//     email,
//     relation,
//     memory_text,
//     tribute_text,
//     profile_photo,
//   ];

//   if (profile_photo) values.push(profile_photo);

//   values.push(tributesId);

//   const sql = `UPDATE package_tributes SET ${updateFields.join(", ")} WHERE id = ?`;

//   await db.query(sql, values);

//   res.status(200).json({ success: true, message: "Tributes updated successfully" });
// });
exports.updatePackageTributes = catchAsyncErrors(async (req, res, next) => {
  const tributesId = req.params.id;

  const {
    package_id,
    full_name,
    email,
    relation,
    memory_text,
    tribute_text,
  } = req.body;

  const files = req.files || {};
  const profile_photo = files.profile_photo?.[0]?.filename || null;

  // Prepare update fields and values
  const updateFields = [
    "package_id = ?",
    "full_name = ?",
    "email = ?",
    "relation = ?",
    "memory_text = ?",
    "tribute_text = ?",
  ];

  const values = [
    package_id,
    full_name,
    email,
    relation,
    memory_text,
    tribute_text,
  ];

  // Only update photo if new file is uploaded
  if (profile_photo) {
    updateFields.push("profile_photo = ?");
    values.push(profile_photo);
  }

  // Add ID for WHERE clause
  values.push(tributesId);

  // Build SQL dynamically
  const sql = `UPDATE package_tributes SET ${updateFields.join(", ")} WHERE id = ?`;

  // Run update query
  await db.query(sql, values);

  // Fetch updated row
  const [updatedRows] = await db.query("SELECT * FROM package_tributes WHERE id = ?", [tributesId]);

  const updatedTribute = updatedRows[0];

  // Construct base URL dynamically
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/packages`;

  // Append full image URL if profile_photo exists
  updatedTribute.profile_photo = updatedTribute.profile_photo
    ? `${baseUrl}/${updatedTribute.profile_photo}`
    : null;

  res.status(200).json({
    success: true,
    message: "Tribute updated successfully",
    updatedTribute,
  });
});


exports.apiGetAllTributes = catchAsyncErrors(async (req, res, next) => {
  const [rows] = await db.query("SELECT * FROM package_tributes");

  if (!rows.length) {
    return res.status(404).json({ success: false, message: "No tributes found" });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/packages`;

  const tributes = rows.map((tribute) => ({
    ...tribute,
    profile_photo: tribute.profile_photo ? `${baseUrl}/${tribute.profile_photo}` : null,
  }));

  res.status(200).json({
    success: true,
    count: tributes.length,
    tributes,
  });
});

exports.apiGetSingleTributes = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const [rows] = await db.query("SELECT * FROM package_tributes WHERE id = ?", [id]);

  if (!rows.length) {
    return res.status(404).json({ success: false, error: "Tributes not found" });
  }

  const tributes = rows[0];

  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/packages`;

  tributes.profile_photo = tributes.profile_photo
    ? `${baseUrl}/${tributes.profile_photo}`
    : null;

  res.status(200).json({ success: true, tributes });
});


exports.viewBiography = async (req, res) => {
  const { packageId } = req.params;
  const [[bioRow]] = await db.query(
    'SELECT * FROM package_biographies WHERE package_id = ?',
    [packageId]
  );
  if (!bioRow) return res.status(404).json({ success: false, message: 'Not found' });

  if (bioRow.account_type === 'public') {
    return res.json({ success: true, biography: bioRow });
  }

  // private account → check access_requests
  const requesterEmail = req.query.email;
  if (requesterEmail) {
    const [[reqRow]] = await db.query(
      'SELECT status FROM access_requests WHERE package_id = ? AND requester_email = ?',
      [packageId, requesterEmail]
    );
    if (reqRow && reqRow.status === 'approved') {
      return res.json({ success: true, biography: bioRow });
    }
    return res.json({ success: true, biography: null, status: reqRow ? reqRow.status : null });
  }

  res.json({ success: true, biography: null, status: null });
};

exports.requestAccess = async (req, res) => {
  const { packageId } = req.params;
  const { email, name } = req.body;

  await db.query(
    `INSERT INTO access_requests (package_id, requester_email, requester_name)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       requester_name = VALUES(requester_name),
       status = 'pending'`,
    [packageId, email, name]
  );

  res.json({ success: true, message: 'Request submitted, pending approval' });
};


exports.approveRequest = async (req, res) => {
  const { requestId } = req.params;
  await db.query(
    'UPDATE access_requests SET status="approved" WHERE id = ?',
    [requestId]
  );
  res.json({ success: true, message: 'Request approved' });
};

exports.getAccessRequests = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        ar.id AS requestId,
        ar.requester_email AS email,
        ar.requester_name AS name,
        ar.status
       FROM access_requests ar
       ORDER BY ar.created_at DESC`
    );

    const requests = rows.map((row) => ({
      id: row.requestId,
      name: row.name || "N/A",
      email: row.email,
      active: row.status === "approved",
      requestId: row.requestId,
    }));

    res.json({ success: true, requests });
  } catch (err) {
    console.error("❌ Error fetching access requests:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "..."; // Truncate and add ellipsis
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return format(date, "d MMM, yyyy"); // Format in m-d-Y
}
