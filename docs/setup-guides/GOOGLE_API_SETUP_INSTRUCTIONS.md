# 🔧 **GOOGLE SHEETS API SETUP - COMPLETE GUIDE**

*Follow these steps exactly to enable Google Sheets authentication*

---

## 🚀 **STEP 1: GOOGLE CLOUD PROJECT**

### **Create Project**
1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Click**: "New Project" (top-left, next to Google Cloud logo)
3. **Project Name**: `MaxPulse Authentication`
4. **Organization**: Leave as default
5. **Click**: "Create"
6. **Wait**: For project creation (30-60 seconds)

---

## 📊 **STEP 2: ENABLE GOOGLE SHEETS API**

### **Enable API**
1. **Ensure**: Your new project is selected (top dropdown)
2. **Go to**: "APIs & Services" → "Library" (left sidebar)
3. **Search**: "Google Sheets API"
4. **Click**: "Google Sheets API" result
5. **Click**: "Enable" button
6. **Wait**: For API to be enabled

---

## 🔑 **STEP 3: CREATE API KEY**

### **Generate API Key**
1. **Go to**: "APIs & Services" → "Credentials" (left sidebar)
2. **Click**: "Create Credentials" → "API Key"
3. **Copy**: The API key immediately (save it somewhere safe!)
4. **Click**: "Restrict Key" (recommended for security)

### **Restrict API Key (Security)**
1. **API Restrictions**: Select "Restrict key"
2. **Select APIs**: Check "Google Sheets API"
3. **Application Restrictions**: 
   - For development: "None"
   - For production: "HTTP referrers" → Add your domain
4. **Click**: "Save"

---

## 📋 **STEP 4: CREATE GOOGLE SHEET**

### **Create Validation Sheet**
1. **Go to**: [Google Sheets](https://sheets.google.com/)
2. **Click**: "Blank" to create new sheet
3. **Rename**: "MaxPulse Distributor Validation"

### **Set Up Sheet Structure**
**Row 1 (Headers):**
```
A1: Distributor Name
B1: Email
C1: Activation Code
D1: Status
E1: Used Date
F1: Purchase ID
G1: Territory
```

**Sample Data (Rows 2-4):**
```
Row 2: John Smith | john@example.com | MP-2024-001234 | active | | PO-12345 | West
Row 3: Sarah Johnson | sarah@example.com | MP-2024-001235 | active | | PO-12346 | East  
Row 4: Mike Chen | mike@example.com | MP-2024-001236 | active | | PO-12347 | North
```

### **Make Sheet Public (Read-Only)**
1. **Click**: "Share" button (top-right)
2. **Click**: "Change to anyone with the link"
3. **Permission**: Set to "Viewer" (not Editor!)
4. **Click**: "Done"

### **Get Sheet ID**
1. **Copy**: The URL of your sheet
2. **Extract**: Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_SHEET_ID]/edit
   ```
3. **Save**: The Sheet ID (long string of letters/numbers)

---

## ⚙️ **STEP 5: CONFIGURE MAXPULSE**

### **What You Need**
- ✅ Google API Key (from Step 3)
- ✅ Google Sheet ID (from Step 4)

### **Update Configuration**
I'll help you update the MaxPulse configuration once you have these values!

---

## 🧪 **STEP 6: TESTING**

### **Test Data for Signup**
Use this test data once setup is complete:
- **Name**: John Smith
- **Email**: john@example.com  
- **Code**: MP-2024-001234

---

## 🔒 **SECURITY NOTES**

### **API Key Security**
- ✅ Never commit API keys to Git
- ✅ Use environment variables only
- ✅ Restrict API key to Google Sheets API only
- ✅ Monitor usage in Google Cloud Console

### **Sheet Security**
- ✅ Use "Viewer" permissions only (never Editor)
- ✅ Don't include sensitive personal data
- ✅ Regularly review who has access

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**
1. **"API not enabled"**: Go back to Step 2, ensure Google Sheets API is enabled
2. **"Permission denied"**: Check sheet is public with "Viewer" access
3. **"Invalid API key"**: Verify API key is copied correctly, no extra spaces
4. **"Sheet not found"**: Double-check Sheet ID extraction from URL

---

## 📞 **NEXT STEPS**

Once you have:
- ✅ Google API Key
- ✅ Google Sheet ID

Let me know and I'll configure MaxPulse to use them!
