
const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../expressHelper/auth");

const {
    getAllUsers,
    getUserDetailsById,
    updateUser,
    deleteUser,
    adminGetOrders } = require("../controllers/admin.controller");

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetailsById)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/admin/user/:id/orders").get(isAuthenticatedUser, authorizeRoles("admin"), adminGetOrders)
module.exports = router;