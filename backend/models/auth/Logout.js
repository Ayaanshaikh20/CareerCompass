
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("a_t", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("r_t", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    next();
  } catch (error) {
    res.status(500).json({
      message: "Error logging out user",
      status: 500,
    });
  }
};
