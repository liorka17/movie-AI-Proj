require("dotenv").config(); // טעינת משתני סביבה

const setSocialLinks = (req, res, next) => {
    res.locals.socialLinks = {
        facebook: process.env.FACEBOOK_URL,
        instagram: process.env.INSTAGRAM_URL,
        discord: process.env.DISCORD_URL,
        linkedin: process.env.LINKEDIN_URL
    };
    next();
};

module.exports = setSocialLinks;
