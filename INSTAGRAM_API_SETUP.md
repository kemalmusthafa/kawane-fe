# Instagram Basic Display API Setup Guide

Panduan lengkap untuk setup Instagram Basic Display API untuk mendapatkan posts yang real dari akun @kawane.studio.

## 📋 Prerequisites

1. **Facebook Developer Account**: Anda perlu akun Facebook Developer
2. **Instagram Business Account**: Akun Instagram harus dalam mode Business
3. **Website Domain**: Domain yang sudah terverifikasi

## 🔧 Step-by-Step Setup

### 1. Create Facebook App

1. Buka [Facebook Developers](https://developers.facebook.com/)
2. Login dengan akun Facebook Anda
3. Klik **"Create App"**
4. Pilih **"Consumer"** atau **"Business"**
5. Isi informasi:
   - **App Name**: Kawane Studio Instagram Feed
   - **App Contact Email**: your-email@domain.com
   - **App Purpose**: Other

### 2. Add Instagram Basic Display Product

1. Di dashboard app, klik **"+ Add Product"**
2. Cari **"Instagram Basic Display"**
3. Klik **"Set Up"**

### 3. Configure Instagram Basic Display

1. **Valid OAuth Redirect URIs**:
   ```
   https://kawane-fe.vercel.app/auth/instagram/callback
   http://localhost:3000/auth/instagram/callback
   ```

2. **Deauthorize Callback URL**:
   ```
   https://kawane-fe.vercel.app/auth/instagram/deauthorize
   ```

3. **Data Deletion Request URL**:
   ```
   https://kawane-fe.vercel.app/auth/instagram/data-deletion
   ```

### 4. Get App Credentials

1. Di **App Settings** > **Basic**:
   - **App ID**: Copy ini
   - **App Secret**: Copy ini

2. Di **Instagram Basic Display** > **Basic Display**:
   - **Instagram App ID**: Copy ini

### 5. Generate Access Token

#### Method 1: Using Graph API Explorer

1. Buka [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Generate User Token dengan permissions:
   - `instagram_basic`
   - `pages_show_list`
4. Exchange untuk Long-lived Token

#### Method 2: Using Instagram Basic Display API

1. Buka URL ini (replace dengan App ID Anda):
   ```
   https://api.instagram.com/oauth/authorize?client_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user_profile,user_media&response_type=code
   ```

2. Authorize aplikasi
3. Exchange code untuk access token

### 6. Environment Variables

Tambahkan ke file `.env.local`:

```env
# Instagram API Configuration
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN="your-long-lived-access-token"
NEXT_PUBLIC_INSTAGRAM_APP_ID="your-app-id"
NEXT_PUBLIC_INSTAGRAM_APP_SECRET="your-app-secret"
```

## 🔄 API Endpoints

### Get User Info
```
GET https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=ACCESS_TOKEN
```

### Get User Media
```
GET https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=12&access_token=ACCESS_TOKEN
```

### Get Media Details
```
GET https://graph.instagram.com/MEDIA_ID?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=ACCESS_TOKEN
```

## 🛠️ Implementation in Code

Widget sudah siap untuk menggunakan Instagram API. Cukup tambahkan environment variables dan widget akan otomatis menggunakan real data.

### Fallback System

Widget memiliki sistem fallback:
1. **Primary**: Instagram Basic Display API (jika credentials tersedia)
2. **Fallback**: Mock data dengan gambar dari Unsplash

## 🔒 Security Notes

1. **Access Token**: Jangan expose di frontend untuk production
2. **App Secret**: Hanya untuk server-side
3. **Rate Limiting**: Instagram API memiliki rate limits
4. **Token Refresh**: Long-lived tokens perlu di-refresh setiap 60 hari

## 📱 Testing

1. **Development**: Gunakan mock data
2. **Staging**: Test dengan real API
3. **Production**: Deploy dengan real credentials

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid Access Token"**:
   - Check token validity
   - Regenerate token jika expired

2. **"Rate Limit Exceeded"**:
   - Implement caching
   - Reduce API calls frequency

3. **"Media Not Found"**:
   - Check media permissions
   - Verify media exists

### Debug Mode

Enable debug mode di environment:
```env
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_VERBOSE_LOGGING=true
```

## 📚 Resources

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Instagram API Rate Limits](https://developers.facebook.com/docs/instagram-api/overview#rate-limiting)

## 🎯 Next Steps

1. Setup Facebook App
2. Configure Instagram Basic Display
3. Get Access Token
4. Add Environment Variables
5. Test dengan real data
6. Deploy ke production

Widget akan otomatis detect apakah API credentials tersedia dan menggunakan real data atau fallback ke mock data.
