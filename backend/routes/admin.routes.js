
const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../expressHelper/auth");
const { showAllUsers } = require("../controllers/admin.controller");

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), showAllUsers);

module.exports = router;