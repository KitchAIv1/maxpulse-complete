# 🎨 MAXPULSE Logo Assets

## 📁 Upload Your Logo Files Here

Place your MAXPULSE logo files in this directory with the following naming convention:

### **Required Logo Files:**

1. **`logo-full.png`** - Complete logo with text and icon
   - **Usage:** Login page, main branding areas
   - **Recommended size:** 400x120px (or similar aspect ratio)
   - **Format:** PNG with transparent background

2. **`logo-horizontal.png`** - Horizontal layout version
   - **Usage:** Header navigation, public layout
   - **Recommended size:** 200x60px
   - **Format:** PNG with transparent background

3. **`logo-icon.png`** - Icon/symbol only (no text)
   - **Usage:** Favicon, compact spaces, mobile headers
   - **Recommended size:** 64x64px (square)
   - **Format:** PNG with transparent background

4. **`logo-vertical.png`** - Vertical layout version (optional)
   - **Usage:** Sidebar branding, special layouts
   - **Recommended size:** 120x200px
   - **Format:** PNG with transparent background

5. **`logo-white.png`** - White version for dark backgrounds
   - **Usage:** Dark themes, overlays, hero sections
   - **Recommended size:** Same as logo-full.png
   - **Format:** PNG with transparent background

## 🔧 Current Integration Status

✅ **Logo Component Created** - Reusable component with fallback support
✅ **Header Updated** - Dashboard header now uses logo component
✅ **Public Layout Updated** - Navigation logo integrated
✅ **Login Page Updated** - Main branding logo integrated

## 📍 Where Your Logo Will Appear

### **Dashboard Application:**
- **Header Navigation** (`/dashboard/src/components/Header.tsx`)
- **Public Layout** (`/dashboard/src/components/PublicLayout.tsx`)
- **Login Page** (`/dashboard/src/components/LoginPage.tsx`)

### **Assessment Application:**
- Ready for integration (same folder structure created)

## 🚀 Automatic Fallback System

The logo component includes intelligent fallback:
- **Primary:** Loads your uploaded logo image
- **Fallback:** Shows "MAXPULSE" text with Brain icon if image fails
- **Responsive:** Automatically adjusts size based on context

## 📝 Upload Instructions

1. **Save your logo files** with the exact names listed above
2. **Upload to this folder:** `/dashboard/public/images/branding/`
3. **Refresh the application** - logos will appear automatically
4. **No code changes needed** - the system will detect and use your logos

## 🎯 Logo Specifications

- **File Format:** PNG (preferred) or SVG
- **Background:** Transparent
- **Color Mode:** RGB
- **Quality:** High resolution for crisp display
- **Aspect Ratio:** Maintain consistent proportions

## 🔄 Testing Your Logo

After uploading, test your logo in:
- [ ] Dashboard header (logged in view)
- [ ] Public homepage navigation
- [ ] Login page main branding
- [ ] Mobile responsive views

---

**Need help?** The logo component automatically handles sizing, positioning, and fallbacks. Just upload your files and they'll work immediately!
