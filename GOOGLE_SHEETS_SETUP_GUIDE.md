# 🔧 **GOOGLE SHEETS AUTHENTICATION SETUP GUIDE**

*Step-by-step guide to enable Google Sheets validation*

---

## 📋 **PREREQUISITES**

- ✅ Google Account with admin access
- ✅ MaxPulse backend system (already complete)
- ✅ Distributor activation codes ready

---

## 🚀 **PHASE 1: GOOGLE CLOUD SETUP**

### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project"
3. Name: "MaxPulse Authentication"
4. Click "Create"

### **Step 2: Enable Google Sheets API**
1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click "Google Sheets API"
4. Click "Enable"

### **Step 3: Create API Key**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API Key (save securely)
4. Click "Restrict Key" (recommended)
5. Under "API restrictions", select "Google Sheets API"
6. Click "Save"

---

## 📊 **PHASE 2: GOOGLE SHEETS SETUP**

### **Step 1: Create Validation Spreadsheet**
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create new spreadsheet
3. Name: "MaxPulse Distributor Validation"

### **Step 2: Set Up Columns**
```
| A              | B                  | C               | D      | E         | F           | G         |
|----------------|--------------------|-----------------| -------|-----------|-------------|-----------|
| Distributor    | Email              | Activation Code | Status | Used Date | Purchase ID | Territory |
| Name           |                    |                 |        |           |             |           |
|----------------|--------------------|-----------------| -------|-----------|-------------|-----------|
| John Smith     | john@example.com   | MP-2024-001234  | active | NULL      | PO-12345    | West      |
| Sarah Johnson  | sarah@example.com  | MP-2024-001235  | active | NULL      | PO-12346    | East      |
| Mike Chen      | mike@example.com   | MP-2024-001236  | active | NULL      | PO-12347    | North     |
```

### **Step 3: Make Sheet Public (Read-Only)**
1. Click "Share" button
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Copy the Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

---

## ⚙️ **PHASE 3: MAXPULSE CONFIGURATION**

### **Step 1: Update Environment Variables**
```bash
# Edit dashboard/.env.local
VITE_GOOGLE_SHEET_ID=your_actual_sheet_id_here
VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

### **Step 2: Enable Feature Flags**
```bash
# Edit dashboard/.env.local
VITE_GOOGLE_SHEETS_VALIDATION=true
VITE_EMAIL_SIGNUP=true
```

### **Step 3: Restart Development Server**
```bash
cd dashboard && npm run dev
```

---

## 🧪 **PHASE 4: TESTING**

### **Test Signup Flow**
1. Go to: `http://localhost:3003/dashboard/#/login`
2. Click "Sign Up" tab
3. Enter test data:
   - Name: "John Smith"
   - Email: "john@example.com"
   - Code: "MP-2024-001234"
4. Verify real-time validation works
5. Submit form and check email flow

---

## 🔒 **SECURITY CONSIDERATIONS**

### **API Key Security**
- ✅ Restrict API key to Google Sheets API only
- ✅ Consider IP restrictions for production
- ✅ Monitor API usage in Google Cloud Console

### **Sheet Security**
- ✅ Use "Viewer" permissions only
- ✅ Don't include sensitive data in sheet
- ✅ Regularly audit access logs

---

## 📈 **PRODUCTION DEPLOYMENT**

### **Environment Variables for Production**
```bash
# Production .env
VITE_GOOGLE_SHEET_ID=production_sheet_id
VITE_GOOGLE_API_KEY=production_api_key
VITE_GOOGLE_SHEETS_VALIDATION=true
VITE_EMAIL_SIGNUP=true
```

### **Monitoring**
- Monitor API usage in Google Cloud Console
- Set up alerts for quota limits
- Track validation success/failure rates

---

## 🎯 **ESTIMATED SETUP TIME**

- **Google Cloud Setup**: 5-10 minutes
- **Google Sheets Creation**: 5-10 minutes  
- **MaxPulse Configuration**: 2-3 minutes
- **Testing**: 5-10 minutes

**Total: ~20-30 minutes for complete setup**

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**
1. **API Key not working**: Check if Google Sheets API is enabled
2. **Sheet not found**: Verify Sheet ID is correct and sheet is public
3. **Validation failing**: Check sheet column structure matches expected format
4. **CORS errors**: Ensure API key has proper restrictions

### **Support Resources**
- Google Sheets API Documentation
- Google Cloud Console error logs
- MaxPulse system health dashboard
