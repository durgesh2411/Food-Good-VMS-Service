# LFU Team Photo Setup Guide

## Overview
This guide will help you add real photos of the Lift for Upliftment (LFU) team members to the Hall of Fame page.

## Photo Directory Structure
```
frontend/public/team/
├── dr-atul-dhakne.jpg          # Founder & President
├── dr-farooque-faras.jpg       # Vice-President
├── dr-mayank-tripathi.jpg      # Secretary
├── dr-tejas-ahire.jpg          # Treasurer
├── mentors-team.jpg            # Group photo of mentors
└── students/
    ├── tanishka-patil.jpg      # MBBS Graduate
    ├── pawan-dongare.jpg       # NEET Qualifier
    └── rutuja-shinde.jpg       # MBBS Graduate
```

## Photo Requirements

### Image Specifications
- **Format**: JPG or PNG (JPG recommended for smaller file size)
- **Dimensions**: 400x400 pixels (square aspect ratio)
- **File Size**: Less than 500KB each
- **Quality**: High resolution, professional appearance

### Individual Photos
- **Founders & Leaders**: Professional headshots with clear face visibility
- **Students**: Graduation photos or professional portraits
- **Group Photo**: Team photo of mentors/coordinators

## How to Add Photos

### Step 1: Prepare Your Photos
1. Collect high-quality photos of each team member
2. Resize them to 400x400 pixels using any image editor
3. Rename them according to the structure above
4. Optimize file size (compress if needed)

### Step 2: Add Photos to Website
1. Copy the photos to the appropriate folders:
   - Team leaders: `frontend/public/team/`
   - Students: `frontend/public/team/students/`

### Step 3: Fallback for Missing Photos
If any photo is missing, the website will show a placeholder image until you add the real photo.

## Current Photo Paths in Code

The Hall of Fame component is already configured to use these photo paths:

### Founders
- Dr. Atul Dhakne: `/team/dr-atul-dhakne.jpg`
- Dr. Farooque Faras: `/team/dr-farooque-faras.jpg`

### Team Leaders
- Dr. Mayank Tripathi: `/team/dr-mayank-tripathi.jpg`
- Dr. Tejas Ahire: `/team/dr-tejas-ahire.jpg`
- Mentors Team: `/team/mentors-team.jpg`

### Success Stories
- Tanishka Patil: `/team/students/tanishka-patil.jpg`
- Pawan Dongare: `/team/students/pawan-dongare.jpg`
- Rutuja Shinde: `/team/students/rutuja-shinde.jpg`

## Photo Sources

### Getting Photos from LFU Website
1. Visit the official LFU website
2. Right-click on team member photos
3. Save images with appropriate names
4. Resize and optimize as needed

### Social Media Sources
- LinkedIn profiles of team members
- Facebook page photos
- Official LFU social media accounts

### Professional Photos
For best results, consider taking new professional photos:
- Good lighting
- Clean background
- Professional attire
- High resolution

## Testing Your Photos

After adding photos:
1. Navigate to http://localhost:5173/hall-of-fame
2. Check that all photos load correctly
3. Verify image quality and alignment
4. Test on different screen sizes

## Troubleshooting

### Photo Not Showing
1. Check file name spelling (case-sensitive)
2. Verify file is in correct folder
3. Ensure file format is JPG/PNG
4. Clear browser cache

### Poor Image Quality
1. Use higher resolution source image
2. Check compression settings
3. Ensure square aspect ratio (400x400)

### Large File Sizes
1. Compress images using online tools
2. Convert PNG to JPG if transparency not needed
3. Reduce image dimensions if too large

## Contact for Photos

If you need help obtaining specific team member photos:
1. Contact LFU directly through their website
2. Reach out via their social media channels
3. Request photos from team members directly

## Next Steps

1. **Immediate**: Copy any available photos to the team folders
2. **Short-term**: Contact LFU for official team photos
3. **Long-term**: Organize professional photo session for team

---

**Note**: The website is fully functional with placeholder images. Real photos will enhance the authenticity and impact of the Hall of Fame page.
