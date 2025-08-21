const express = require("express");
const multer = require("multer");
const {
  addFrom,
  createRecord,
  editForm,
  updateRecord,
  deleteRecord,
  getAllRecords,
  getSingleRecord,
  deleteImage,
  apiGetAllRecords,
  apiGetSingleRecord,
  getPurchasedPackagesForUser,
  createPackageBiography,
  updatePackageBiography,
  apiGetSingleBiography,
  uploadGalleryImages ,
  getPackageGallery, 
  apiGetSingleEulogy,
  updatePackageEulogy,
  createPackageEulogy,
  createFamilyMembers,
  getFamilyMembers,
  updateFamilyMembers,
  createPackageTributes,
  updatePackageTributes,
  apiGetSingleTributes,
  apiGetAllTributes,
  viewBiography, requestAccess, approveRequest, getAccessRequests
} = require("../contollers/packageController");
const { isAuthenticatedUser, authorizeRoles, isApiAuthenticatedUser } = require("../middleware/auth");
const Model = require("../models/packageModel");
const module_slug = Model.module_slug;
const router = express.Router();
const uploadGallery = require('../middleware/uploadGallery');

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file);
    callback(null, "./uploads/packages");
  },
  filename: function (req, file, callback) {
    console.log(file);
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: Storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB

 });

router
  .route("/" + module_slug + "/add")
  .get(isAuthenticatedUser, authorizeRoles("admin"), addFrom);
router
  .route("/" + module_slug + "/add")
  .post(
    upload.single("image"),
    isAuthenticatedUser,
    authorizeRoles("admin"),
    createRecord
  );
router
  .route("/" + module_slug + "/edit/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), editForm);
router
  .route("/" + module_slug + "/update/:id")
  .post(
     upload.single("image"),
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateRecord
  );
router
  .route("/" + module_slug + "/delete/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), deleteRecord);
router
  .route("/" + module_slug + "")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllRecords);
router
  .route("/" + module_slug + "/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleRecord);
router
  .route("/" + module_slug + "/delete-image/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), deleteImage);

/** REST API**/
router.route("/api-" + module_slug + "").get(apiGetAllRecords);
router.route("/api-" + module_slug + "/:id").get(apiGetSingleRecord);
router.route("/purchased-packages" ).get(isApiAuthenticatedUser, getPurchasedPackagesForUser);
router.post(
  "/packages/biography",
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "background_photo", maxCount: 1 },
    { name: "biography_photo", maxCount: 1 },
  ]),
  isApiAuthenticatedUser,
  createPackageBiography
);
router.route("/packages/biography/:id").get( apiGetSingleBiography);
router.route("/packages/biography/update/:id").post(
  upload.fields([
    { name: "profile_photo" },
    { name: "background_photo" },
    { name: "biography_photo" }
  ]),
  isApiAuthenticatedUser,
  updatePackageBiography
);
router.post(
  "/packages/tributes",
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
  ]),
  // isApiAuthenticatedUser,
  createPackageTributes
);
router.route("/packages/tributes/:id").get(isApiAuthenticatedUser, apiGetSingleTributes);
router.route("/packages/all-tributes/:packageId").get( apiGetAllTributes);
router.route("/packages/tributes/update/:id").post(
  upload.fields([
    { name: "profile_photo" }
  ]),
  isApiAuthenticatedUser,
  updatePackageTributes
);
router.post("/packages/eulogy",isApiAuthenticatedUser,
  createPackageEulogy
);
router.route("/packages/eulogy/:id").get( apiGetSingleEulogy);
router.route("/packages/eulogy/update/:id").post(
  isApiAuthenticatedUser,
  updatePackageEulogy
);
router.post('/packages/:id/gallery', uploadGallery.array('images', 10),  isApiAuthenticatedUser, uploadGalleryImages);
router.route("/packages/gallery/:id").get( getPackageGallery);
router.post("/packages/family", isApiAuthenticatedUser, createFamilyMembers);
router.get("/packages/family/:packageId",  getFamilyMembers);
router.put("/packages/family/:packageId", isApiAuthenticatedUser, updateFamilyMembers);
router.get("/access-requests", isApiAuthenticatedUser, getAccessRequests);

router.get('/biography/:packageId',  viewBiography);
router.post('/:packageId/access-request',  requestAccess);
router.post('/access-request/:requestId/approve', isApiAuthenticatedUser, approveRequest);

module.exports = router;
