const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../expressHelper/auth");

const {
    createUser,
    loginUser,
    logoutUser,
    getUserInfo } = require("../controllers/auth.controller");

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserInfo);

module.exports = router;