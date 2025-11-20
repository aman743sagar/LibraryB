const roleMiddleware =  (req, res, next) => {
    if (!req.userRole) {
        return res.status(403).json({ success: false, message: "Role not found" });
    }

    if (req.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    next(); // user is admin
};

module.exports = roleMiddleware;