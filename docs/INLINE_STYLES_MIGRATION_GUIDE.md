# Inline Styles to Tailwind Migration Guide

**Quick Reference for MAXPULSE Developers**

---

## 🎯 Quick Reference Table

### Common Conversions

| Inline Style | Tailwind Class | Notes |
|--------------|----------------|-------|
| `style={{ display: 'flex' }}` | `className="flex"` | |
| `style={{ flexDirection: 'column' }}` | `className="flex-col"` | |
| `style={{ justifyContent: 'center' }}` | `className="justify-center"` | |
| `style={{ alignItems: 'center' }}` | `className="items-center"` | |
| `style={{ gap: '16px' }}` | `className="gap-4"` | 4 = 1rem = 16px |
| `style={{ padding: '24px' }}` | `className="p-6"` | 6 = 1.5rem = 24px |
| `style={{ margin: '16px' }}` | `className="m-4"` | 4 = 1rem = 16px |
| `style={{ marginTop: '8px' }}` | `className="mt-2"` | 2 = 0.5rem = 8px |
| `style={{ paddingX: '16px' }}` | `className="px-4"` | Horizontal padding |
| `style={{ paddingY: '12px' }}` | `className="py-3"` | Vertical padding |
| `style={{ width: '100%' }}` | `className="w-full"` | |
| `style={{ maxWidth: '1200px' }}` | `className="max-w-7xl"` | |
| `style={{ height: '100vh' }}` | `className="h-screen"` | |
| `style={{ position: 'fixed' }}` | `className="fixed"` | |
| `style={{ position: 'absolute' }}` | `className="absolute"` | |
| `style={{ position: 'relative' }}` | `className="relative"` | |
| `style={{ inset: 0 }}` | `className="inset-0"` | top/right/bottom/left = 0 |
| `style={{ top: 0, left: 0 }}` | `className="top-0 left-0"` | |
| `style={{ zIndex: 10 }}` | `className="z-10"` | |
| `style={{ zIndex: 9999 }}` | `className="z-[9999]"` | Arbitrary value |
| `style={{ backgroundColor: 'white' }}` | `className="bg-white"` | |
| `style={{ color: 'black' }}` | `className="text-black"` | |
| `style={{ fontSize: '14px' }}` | `className="text-sm"` | |
| `style={{ fontSize: '16px' }}` | `className="text-base"` | |
| `style={{ fontSize: '18px' }}` | `className="text-lg"` | |
| `style={{ fontSize: '24px' }}` | `className="text-2xl"` | |
| `style={{ fontWeight: 'bold' }}` | `className="font-bold"` | |
| `style={{ fontWeight: 'normal' }}` | `className="font-normal"` | |
| `style={{ fontWeight: '600' }}` | `className="font-semibold"` | |
| `style={{ textAlign: 'center' }}` | `className="text-center"` | |
| `style={{ borderRadius: '8px' }}` | `className="rounded-lg"` | |
| `style={{ borderRadius: '16px' }}` | `className="rounded-2xl"` | |
| `style={{ border: '1px solid #e5e7eb' }}` | `className="border border-gray-200"` | |
| `style={{ borderBottom: '1px solid #e5e7eb' }}` | `className="border-b border-gray-200"` | |
| `style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}` | `className="shadow-sm"` | |
| `style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}` | `className="shadow-xl"` | |
| `style={{ opacity: 0.5 }}` | `className="opacity-50"` | |
| `style={{ cursor: 'pointer' }}` | `className="cursor-pointer"` | |
| `style={{ overflow: 'hidden' }}` | `className="overflow-hidden"` | |
| `style={{ overflowY: 'auto' }}` | `className="overflow-y-auto"` | |

---

## 📏 Spacing Scale Reference

Tailwind uses a spacing scale based on `0.25rem` (4px) increments:

| Value | Rem | Pixels | Tailwind Class |
|-------|-----|--------|----------------|
| 0 | 0rem | 0px | `p-0`, `m-0` |
| 1 | 0.25rem | 4px | `p-1`, `m-1` |
| 2 | 0.5rem | 8px | `p-2`, `m-2` |
| 3 | 0.75rem | 12px | `p-3`, `m-3` |
| 4 | 1rem | 16px | `p-4`, `m-4` |
| 5 | 1.25rem | 20px | `p-5`, `m-5` |
| 6 | 1.5rem | 24px | `p-6`, `m-6` |
| 8 | 2rem | 32px | `p-8`, `m-8` |
| 10 | 2.5rem | 40px | `p-10`, `m-10` |
| 12 | 3rem | 48px | `p-12`, `m-12` |
| 16 | 4rem | 64px | `p-16`, `m-16` |

**Custom Values:** Use arbitrary values when needed: `p-[17px]`, `m-[42px]`

---

## 🎨 Color Reference

### MAXPULSE Brand Colors (from tailwind.config.js)

```typescript
// ✅ USE THESE
className="bg-brand-primary"      // #8B1538
className="bg-brand-secondary"    // #B45309
className="bg-brand-light"        // #A91D47
className="bg-brand-dark"         // #6B1229

className="bg-metallic-red"       // #8B1538
className="bg-metallic-bronze"    // #B45309

// ❌ DON'T USE HARDCODED COLORS
style={{ backgroundColor: '#8B1538' }}  // BAD
```

### Gray Scale

```typescript
className="bg-gray-50"    // Lightest
className="bg-gray-100"
className="bg-gray-200"
className="bg-gray-300"
className="bg-gray-400"
className="bg-gray-500"
className="bg-gray-600"
className="bg-gray-700"
className="bg-gray-800"
className="bg-gray-900"   // Darkest
```

### Transparency

```typescript
className="bg-black/10"   // 10% opacity
className="bg-black/20"   // 20% opacity
className="bg-black/50"   // 50% opacity
className="bg-white/80"   // 80% opacity
```

---

## 🔄 Real-World Examples

### Example 1: Modal Wrapper

**BEFORE:**
```typescript
<div 
  style={{
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px'
  }}
>
```

**AFTER:**
```typescript
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
```

---

### Example 2: Card Component

**BEFORE:**
```typescript
<div 
  style={{
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    marginBottom: '16px'
  }}
>
```

**AFTER:**
```typescript
<div className="bg-white rounded-2xl p-6 shadow-xl mb-4">
```

---

### Example 3: Flexbox Layout

**BEFORE:**
```typescript
<div 
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb'
  }}
>
```

**AFTER:**
```typescript
<div className="flex justify-between items-center p-6 border-b border-gray-200">
```

---

### Example 4: Typography

**BEFORE:**
```typescript
<span 
  style={{
    color: 'black',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px'
  }}
>
```

**AFTER:**
```typescript
<span className="text-black text-lg font-bold mb-2">
```

---

### Example 5: Conditional Styling

**BEFORE:**
```typescript
<div 
  style={{ 
    backgroundColor: isActive ? '#8B1538' : '#e5e7eb',
    color: isActive ? 'white' : 'black',
    padding: '12px'
  }}
>
```

**AFTER:**
```typescript
<div className={`p-3 ${isActive ? 'bg-brand-primary text-white' : 'bg-gray-200 text-black'}`}>
```

---

### Example 6: Dynamic Background Image (Keep Inline)

**BEFORE & AFTER - KEEP AS IS (Dynamic Content):**
```typescript
<div 
  className="absolute inset-0 bg-cover bg-center"
  style={{ 
    backgroundImage: `url(${dynamicImageUrl})`,
    backgroundPosition: isMobile ? 'center top' : 'center 20%'
  }}
>
```

---

## 🎯 Migration Checklist

### For Each Component:

- [ ] Identify all inline `style` attributes
- [ ] Determine if style is static or dynamic
  - [ ] **Static** → Convert to Tailwind classes
  - [ ] **Dynamic** → Keep inline, document why
- [ ] Convert static styles using this guide
- [ ] Test visual appearance (no changes expected)
- [ ] Remove unused style variables/objects
- [ ] Update any related tests
- [ ] Mark component as "Tailwind Compliant" in commit

---

## 🚫 When to Keep Inline Styles

### ✅ Acceptable Use Cases

1. **Dynamic URLs**
   ```typescript
   style={{ backgroundImage: `url(${userAvatar})` }}
   ```

2. **Calculated Values**
   ```typescript
   style={{ width: `${progress}%` }}
   ```

3. **Animation States**
   ```typescript
   style={{ transform: `translateX(${offset}px)` }}
   ```

4. **Runtime Theme Variables**
   ```typescript
   style={{ color: theme.primaryColor }}
   ```

### ❌ NOT Acceptable

1. **Static Colors**
   ```typescript
   style={{ color: 'black' }}  // Use className="text-black"
   ```

2. **Fixed Dimensions**
   ```typescript
   style={{ padding: '24px' }}  // Use className="p-6"
   ```

3. **Layout Properties**
   ```typescript
   style={{ display: 'flex' }}  // Use className="flex"
   ```

---

## 🔧 Advanced Patterns

### Custom CSS Classes for Repeated Patterns

If you have a pattern repeated 3+ times, create a custom class:

**styles/components.css:**
```css
@layer components {
  .modal-overlay {
    @apply fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4;
  }
  
  .card-container {
    @apply bg-white rounded-2xl p-6 shadow-xl mb-4;
  }
  
  .section-header {
    @apply text-2xl font-bold text-brand-primary mb-6;
  }
}
```

**Usage:**
```typescript
<div className="modal-overlay">
  <div className="card-container">
    <h2 className="section-header">Title</h2>
  </div>
</div>
```

---

## 📱 Responsive Design

### Mobile-First Approach

```typescript
// ❌ BAD - Inline media queries
<div style={{ 
  padding: window.innerWidth < 768 ? '16px' : '24px'
}}>

// ✅ GOOD - Tailwind responsive modifiers
<div className="p-4 md:p-6">
//  mobile: 16px ──┘  └─ desktop: 24px
```

### Breakpoints

| Prefix | Min Width | CSS |
|--------|-----------|-----|
| `sm:` | 640px | `@media (min-width: 640px)` |
| `md:` | 768px | `@media (min-width: 768px)` |
| `lg:` | 1024px | `@media (min-width: 1024px)` |
| `xl:` | 1280px | `@media (min-width: 1280px)` |
| `2xl:` | 1536px | `@media (min-width: 1536px)` |

**Example:**
```typescript
<div className="text-sm md:text-base lg:text-lg">
  // Mobile: small, Tablet: base, Desktop: large
</div>
```

---

## 🧪 Testing Your Migration

### Visual Comparison

1. **Take Screenshots Before Refactoring**
   ```bash
   npm run test:visual:baseline
   ```

2. **Refactor Component**

3. **Compare After Refactoring**
   ```bash
   npm run test:visual:compare
   ```

### Manual QA Checklist

- [ ] Component looks identical in Chrome
- [ ] Component looks identical in Safari
- [ ] Component looks identical in Firefox
- [ ] Mobile responsive behavior unchanged
- [ ] Dark mode (if applicable) unchanged
- [ ] Hover states work correctly
- [ ] Animation timing unchanged
- [ ] Print styles (if applicable) work

---

## 💡 Pro Tips

1. **Use VS Code Extensions**
   - Tailwind CSS IntelliSense (autocomplete)
   - Headwind (class sorting)
   - Tailwind Fold (collapse long classNames)

2. **Organize Classes by Category**
   ```typescript
   // Layout → Display → Positioning → Sizing → Colors → Typography → Effects
   className="flex flex-col justify-center items-center w-full max-w-4xl bg-white text-black text-lg font-bold shadow-lg"
   ```

3. **Use Template Literals for Complex Conditionals**
   ```typescript
   const cardClasses = `
     flex flex-col p-6 rounded-2xl
     ${isActive ? 'bg-brand-primary text-white' : 'bg-gray-100 text-black'}
     ${isHovered ? 'shadow-xl scale-105' : 'shadow-md'}
     transition-all duration-300
   `.trim();
   
   <div className={cardClasses}>
   ```

4. **Extract Class Builders**
   ```typescript
   // utils/classNames.ts
   export const getButtonClasses = (variant: string, size: string) => {
     const base = "font-bold rounded transition-colors";
     const variants = {
       primary: "bg-brand-primary text-white hover:bg-brand-dark",
       secondary: "bg-gray-200 text-black hover:bg-gray-300"
     };
     const sizes = {
       sm: "px-3 py-1 text-sm",
       md: "px-4 py-2 text-base",
       lg: "px-6 py-3 text-lg"
     };
     return `${base} ${variants[variant]} ${sizes[size]}`;
   };
   ```

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [CSS to Tailwind Converter](https://transform.tools/css-to-tailwind)
- [Tailwind Play (Online Playground)](https://play.tailwindcss.com/)

---

## 🆘 Common Issues & Solutions

### Issue 1: Class Not Working

**Problem:** `className="bg-custom-color"` not working

**Solution:** Check if color is defined in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'custom-color': '#your-hex',
    }
  }
}
```

### Issue 2: Arbitrary Values Not Working

**Problem:** `className="w-[247px]"` not applying

**Solution:** Ensure you're using square brackets and valid CSS units

### Issue 3: Hover/Focus States

**Problem:** Inline hover styles need conversion

**Solution:** Use state modifiers:
```typescript
// ❌ Inline
onMouseEnter={() => setHovered(true)}
style={{ backgroundColor: hovered ? '#8B1538' : 'white' }}

// ✅ Tailwind
className="bg-white hover:bg-brand-primary"
```

---

## ✅ Final Checklist Before Committing

- [ ] No inline `style` attributes (except dynamic content)
- [ ] All classes use Tailwind utilities
- [ ] Responsive modifiers used where needed
- [ ] Component tested in all browsers
- [ ] Visual appearance unchanged
- [ ] Code is cleaner and more maintainable

---

**Version:** 1.0  
**Last Updated:** November 2, 2025  
**Maintained By:** MAXPULSE Development Team

