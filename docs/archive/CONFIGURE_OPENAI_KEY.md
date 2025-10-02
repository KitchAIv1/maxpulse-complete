# Configure OpenAI API Key for Real AI Analysis

## 🎯 **CRITICAL**: Enable Real AI Analysis

Currently, the Edge Function is using **template responses** because no OpenAI API key is configured.

## 📋 **Steps to Configure:**

### **Option 1: Supabase Dashboard (Recommended)**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `YOUR_PROJECT_REF`
3. Navigate to: **Settings** → **Edge Functions**
4. Click **"Add new secret"**
5. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `your-openai-api-key-here`
6. Click **Save**

### **Option 2: Supabase CLI (Alternative)**

```bash
# Set the OpenAI API key
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here

# Verify it's set
supabase secrets list
```

## 🔍 **How to Get OpenAI API Key:**

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-...`)
4. Use this key in the configuration above

## ✅ **After Configuration:**

1. **Redeploy Edge Function** (if needed):
   ```bash
   supabase functions deploy ai-analysis
   ```

2. **Test Assessment**: Take a new assessment
3. **Check Logs**: Should see `🤖 Calling OpenAI API...` instead of `🔄 No OpenAI API key, using pattern-based analysis`

## 🎯 **Expected Results:**

- **Before**: Template responses, same analysis for everyone
- **After**: Real AI analysis, personalized insights, unique recommendations
- **Data Collection**: Authentic AI data for building smart templates

## 🚨 **Important Notes:**

- **Cost**: Real AI analysis costs ~$0.02-0.05 per assessment
- **Quality**: Much better personalized insights
- **Mission**: Essential for collecting diverse AI data for template building
- **Fallback**: If API fails, automatically falls back to templates

---

**This is the final step to activate real AI analysis for your data collection mission! 🚀**
