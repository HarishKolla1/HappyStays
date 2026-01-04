const cookieToken = (user, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // makes the token available only to backend
        secure: process.env.NODE_ENV === 'production',   // Only send over HTTPS in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Allow cross-origin requests in production
    };


    user.password = undefined;
    res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user
    });
};

module.exports = cookieToken;