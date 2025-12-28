export const DEFAULT_AVATAR = 'https://res.cloudinary.com/dnjrnglhu/image/upload/v1766685114/download_h7ysh1.jpg';

export const getAvatarSrc = (profileImage) => {
    return profileImage || DEFAULT_AVATAR;
};