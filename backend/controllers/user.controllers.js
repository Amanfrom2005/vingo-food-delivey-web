import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if(!userId){return res.status(400).json({massage: "userId not found"})};
        const user = await User.findById(userId);
        if(!user){return res.status(400).json({massage: "user not found"})};
        return res.status(200).json(user)
    } catch (error) {
        return res.status(200).json({massage: `get current user error ${error}`})
    }
}