import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


// Handle Profile Picture Upload

const updatedProfilePic = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Profile Picture is Required");
    }

    const localPath = req.file.path; //get local file path

    const cloudinaryResponse = await uploadOnCloudinary(localPath);

    if (!cloudinaryResponse) {
        throw new ApiError(500, "Failed to upload to cloud storage")
    }

    // Update user in database (example)
    // const user = await User.findByIdAndUpdate(
    //   req.user._id,
    //   { profilePic: cloudinaryResponse.url },
    //   { new: true }
    // )

    return res.status(200).json(
        new ApiResponse(
            200,
            { url: cloudinaryResponse.url },
            "Profile picture uploaded successfully"
        )
    )
})


// Controller-2 Handle Multiple Images Upload
const uploadGallery = asyncHandler(async (req, res) => {
    //chack if files are present
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }
    //Upload all files to cloudinary
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));

    const cloudinaryResponse = await Promise.all(uploadPromises);

    //extract URLs
    const imageUrls = cloudinaryResponse.filter(response => response !== null)
        .map(response => response.url);

    //filter 
    /**
     * Filters out any null responses from the cloudinary upload
     * Only keeps successful upload responses
     * Returns a new array with non-null values
     */

    //map 
    /**
     * Takes the filtered array and extracts just the url property from each response
     * Creates a new array containing only the URLs
     */



    if (imageUrls.length === 0) {
        throw new ApiError(500, "Failed to upload images to cloud storage");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
             { images: imageUrls },
            `${imageUrls.length} Images uploaded successfully`
        )
    )
})

//Controller-3 Handle Mixed Upload (Profile Pic + Multiple Images)
const uploadMixedContent = asyncHandler(async (req, res) => {
    if(!req.files.profilePic || !req.files.images || req.files.images.length === 0){
        throw new ApiError(400, "Profile Picture and at least one image are required");
    }

    //Upload Profile Pic
    const profilePicResponse = await uploadOnCloudinary(req.files.profilePic[0].path);


    //Upload Gallery Images
    const galleryPromises = req.files.image.map (file =>
        uploadOnCloudinary(file.path)
    )

    const galleryResponse = await Promise.all(galleryPromises);

    const galleryUrls = galleryResponse.filter(response => response !== null)
        .map(response => response.url);

    return res.status(200).json(
        new ApiResponse(
            200,
            { profilePic: profilePicResponse.url,
                gallery: galleryUrls
            },
            `Profile Picture and ${galleryUrls.length} Images uploaded successfully`
        )
    )
})

export { updatedProfilePic, uploadGallery, uploadMixedContent };