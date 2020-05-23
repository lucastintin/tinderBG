module.exports = {
    MONGODB_URI : process.env.MONGODB_URI || "mongodb://localhost:27017/tinderbgDB",
    APIKey      : process.env.APIKey || "segred0",
    SALT_ROUND  : 10,
    PORT        : process.env.PORT || 5000
}