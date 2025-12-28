# Images Directory

This directory contains static images for the application.

## Required Images

### placeholder.jpg
A default placeholder image shown when posts don't have uploaded images.

**Recommended specs:**
- Size: 800x600px or 4:3 aspect ratio
- Format: JPEG or PNG
- Content: Generic book or "No Image Available" graphic

You can add this image or the application will gracefully handle missing images by showing the image path.

## Adding Images

1. Place your images in this directory
2. Reference them in components using: `/assets/images/filename.ext`
3. Optimize images for web (compress, appropriate dimensions)

## Image Upload Directory

User-uploaded images are stored in the backend `uploads/` directory (configurable via `FILE_UPLOAD_DIR` environment variable).
