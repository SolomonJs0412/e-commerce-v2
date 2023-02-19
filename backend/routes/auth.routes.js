const express = require("express");
const router = express.Router();

const { isAuthenticatedUser } = require("../expressHelper/auth");

const {
    createUser,
    loginUser,
    logoutUser,
    getUserInfo,
    updateUserInfo,
    updatePassword,
    resetPassword,
    forgotPassword } = require("../controllers/auth.controller");

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserInfo);
router.route("/me/info").put(isAuthenticatedUser, updateUserInfo);
router.route("/me/info/password").put(isAuthenticatedUser, updatePassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/forgot").post(isAuthenticatedUser, forgotPassword);

module.exports = router;