import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;

    if ([userName, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "Username or email already exists")
    }

    const avatatLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPatch = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPatch;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPatch= req.files.coverImage[0].path
    }

    if (!avatatLocalPath) {
        throw new ApiError(400, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatatLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPatch)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Somthing went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})