# Post Images Directory

This directory contains images organized by blog post for better maintainability and GitHub Pages compatibility.

## Structure

Each post has its own subdirectory named after the post file:

```
assets/img/posts/
├── 2023-04-09-kaniko-ecr-gitlab/
├── 2023-04-10-dotnet-docker/
├── 2023-04-18-cloudfront-s3/
├── 2025-09-22-aws-waf/
├── 2026-01-07-aws-well-architected/
└── 2026-01-18-s3-static-websites/
```

## Usage in Posts

Reference images in your markdown posts using:

```markdown
![Alt text](/assets/img/posts/YYYY-MM-DD-post-slug/image-name.jpg)
```

## Why This Structure?

- **GitHub Pages Compatible**: Works without jekyll-postfiles plugin
- **Organized**: Each post's assets are grouped together
- **Maintainable**: Easy to find and update post-specific images
- **Scalable**: Simple to add new posts with their own images

## Adding Images for New Posts

1. Create a new folder matching your post filename (without extension)
2. Add your images to that folder
3. Reference them in your post using the path format above
