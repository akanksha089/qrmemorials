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

// CREATE RECORD
// exports.createRecord = catchAsyncErrors(async (req, res, next) => {
//   try {
//     // ✅ 1. Parse and reconstruct 'features' from form fields BEFORE validation
//     const featureMap = {};

//     for (const key in req.body) {
//       const match = key.match(/^features\[(\d+)\]\[(title|description)\]$/);
//       if (match) {
//         const index = parseInt(match[1]);
//         const field = match[2];

//         if (!featureMap[index]) {
//           featureMap[index] = {};
//         }

//         featureMap[index][field] = req.body[key];
//       }
//     }

//     const featuresArray = Object.values(featureMap).filter(
//       f => f.title && f.description
//     );

//     if (featuresArray.length === 0) {
//       throw new Error("At least one valid feature with title and description is required.");
//     }

//     // ✅ Inject parsed array into req.body for Joi validation
//     req.body.features = featuresArray;

//     // ✅ 2. Joi validation
//     await Model.insertSchema.validateAsync(req.body, {
//       abortEarly: false,
//       allowUnknown: true,
//     });

//     // ✅ 3. Prepare data for DB
//     const now = new Date();
//     const data = {
//       title: req.body.title,
//       price: req.body.price,
//       features: JSON.stringify(featuresArray),
//       created_at: now,
//       updated_at: now,
//     };

//     const insertResult = await QueryModel.saveData(table_name, data);
//     const insertId = insertResult.insertId || insertResult.id;

//     // ✅ 4. Respond
//     const wantsJson = req.xhr || req.headers.accept?.includes("application/json");

//     const responseData = {
//       success: true,
//       message: "Package created successfully",
//       record: {
//         id: insertId,
//         ...data,
//         features: featuresArray,
//       },
//     };

//     if (wantsJson) {
//       return res.status(201).json(responseData);
//     } else {
//       req.flash("msg_response", {
//         status: 200,
//         message: "Package created successfully",
//       });
//       return res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);
//     }
//   } catch (error) {
//     console.error("❌ Error in createRecord:", error);

//     const errMsg = error.details
//       ? error.details.map((d) => d.message)
//       : error.message;

//     const wantsJson = req.xhr || req.headers.accept?.includes("application/json");
//     if (wantsJson) {
//       return res.status(400).json({ success: false, error: errMsg });
//     } else {
//       req.flash("msg_response", { status: 400, message: errMsg });
//       return res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}/add`);
//     }
//   }
// });
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
   res.render(module_slug+'/index',{ layout: module_layout,title : module_title,message, records: parsedRecords,module_slug})

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
  res.render(module_slug+'/detail',{ layout: module_layout,title : module_single_title,    record: record, })

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
 const  record = await QueryModel.findById(table_name, req.params.id, next);

  if (!record) {
    return next(new ErrorHandler("Record not found", 404));
  }
record.features = JSON.parse(record.features || '[]');
record.image_url= record.image ?  `${req.protocol}://${req.get('host')}/uploads/packages/${record.image}`
    : null;
  res.status(200).json({
    success: true,
    data:record,
  });
});

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "..."; // Truncate and add ellipsis
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return format(date, "d MMM, yyyy"); // Format in m-d-Y
}
