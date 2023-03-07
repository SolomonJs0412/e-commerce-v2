
const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../expressHelper/auth");

const {
    getAllUsers,
    getUserDetailsById,
    updateUser,
    deleteUser,
    adminGetOrder,
    getAllOrder = require("../controllers/admin.controller");

const { deleteOrder } = require("../controllers/order.controller");

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetailsById)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/admin/user/:id/orders").get(isAuthenticatedUser, authorizeRoles("admin"), adminGetOrders)
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrder)
module.exports = router;
