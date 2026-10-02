# Meta Access Token Refresh Implementation

## Overview

This implementation provides automatic Meta access token refresh to ensure long-term operation of the Instagram automation without manual token updates.

## Problem

Meta access tokens expire after a period:
- **Short-lived tokens:** ~1-2 hours
- **Long-lived tokens:** ~60 days

Without automatic refresh, the automation would fail when the token expires, requiring manual intervention to update the `.env` file.

## Solution

Implemented a token management system that:
1. Validates tokens before use
2. Automatically refreshes tokens before expiry
3. Stores token state in memory with expiry tracking
4. Checks token health every 24 hours
5. Uses Meta's official token refresh API

## Official Meta Documentation References

1. **Long-Lived Access Tokens**
   - https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/
   - Explains how to generate and refresh long-lived tokens

2. **System User Token Refresh**
   - https://developers.facebook.com/docs/marketing-api/system-users/install-apps-and-generate-tokens/
   - Official API for refreshing expiring system user tokens

3. **Access Tokens Overview**
   - https://developers.facebook.com/docs/facebook-login/access-tokens
   - General access token lifecycle and management

## Implementation Details

### New File: `backend/src/services/tokenManager.service.js`

**Key Functions:**

- `getValidToken()` - Returns a valid token, refreshing if needed
- `validateToken(token)` - Validates token using debug_token endpoint
- `refreshToken()` - Refreshes token using Meta's oauth/access_token endpoint
- `initialize()` - Initializes token manager and sets up scheduled checks
- `getTokenState()` - Returns current token state (for monitoring)
- `setToken(newToken, expiresInDays)` - Manually set a new token

**Configuration:**

- `REFRESH_BUFFER_DAYS = 10` - Refresh tokens 10 days before expiry
- `REFRESH_CHECK_INTERVAL = 24 hours` - Check token health every 24 hours

**Token Storage:**

In-memory storage with:
- `accessToken` - Current valid token
- `expiresAt` - Token expiry date
- `lastRefreshedAt` - Last refresh timestamp

### Modified File: `backend/src/services/instagram.service.js`

**Changes:**

1. Imported `getValidToken` from tokenManager
2. Changed `getAccessToken()` from synchronous to async
3. Updated `sendInstagramDM()` to use `await getAccessToken()`
4. Updated `sendPrivateReply()` to use `await getAccessToken()`

**Before:**
```javascript
function getAccessToken() {
  return env.META_ACCESS_TOKEN || "";
}
```

**After:**
```javascript
async function getAccessToken() {
  try {
    const token = await getValidToken();
    return token || "";
  } catch (error) {
    logger.error("Failed to get valid access token", {
      error: error.message
    });
    return "";
  }
}
```

### Modified File: `backend/server.js`

**Changes:**

Added token manager initialization on server startup:

```javascript
const { initialize: initializeTokenManager } = require("./src/services/tokenManager.service");

const server = app.listen(env.PORT, async () => {
  logger.info(`Server listening on port ${env.PORT}`);

  // Initialize token manager for automatic Meta access token refresh
  await initializeTokenManager();
});
```

### Modified File: `backend/src/config/env.js`

**Added Environment Variables:**

- `META_IG_USER_ID` - Instagram professional account ID
- `META_GRAPH_API_VERSION` - Graph API version (default: v21.0)

## Required Environment Variables

Update your `.env` file with:

```bash
# Meta App Configuration
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_ACCESS_TOKEN=your_long_lived_page_access_token
META_IG_USER_ID=your_instagram_account_id_or_me
META_GRAPH_API_VERSION=v21.0
```

## How Token Refresh Works

### 1. Initialization (Server Startup)

```
Server starts
↓
Token manager initializes
↓
Validates current token using debug_token endpoint
↓
If invalid, attempts refresh
↓
Sets up 24-hour check interval
```

### 2. Token Validation

```
getValidToken() called
↓
Check if token exists
↓
Check if expiry is known
↓
If no expiry info, validate via debug_token
↓
If expired or near expiry (within 10 days), refresh
↓
Return valid token
```

### 3. Token Refresh

```
refreshToken() called
↓
GET https://graph.facebook.com/v21.0/oauth/access_token
↓
Parameters:
  - grant_type: fb_exchange_token
  - client_id: META_APP_ID
  - client_secret: META_APP_SECRET
  - set_token_expires_in_60_days: true
  - fb_exchange_token: current_token
↓
Meta returns new token with expires_in (seconds)
↓
Update token state with new token and expiry
↓
Log success
```

### 4. Scheduled Checks

```
Every 24 hours
↓
Call getValidToken()
↓
If token needs refresh, automatically refresh
↓
Log any errors
```

## Token Refresh API

According to Meta documentation, the refresh endpoint is:

```
GET https://graph.facebook.com/{graph-api-version}/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id={app-id}&
    client_secret={app-secret}&
    set_token_expires_in_60_days=true&
    fb_exchange_token={your-access-token}
```

**Response:**
```json
{
  "access_token": "{new-token}",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

## Getting a Long-Lived Token

### Step 1: Get Short-Lived User Token

Use Facebook Login or Graph API Explorer to get a short-lived token.

### Step 2: Exchange for Long-Lived User Token

```
GET https://graph.facebook.com/v21.0/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id={app-id}&
    client_secret={app-secret}&
    fb_exchange_token={short-lived-token}
```

### Step 3: Get Long-Lived Page Token

```
GET https://graph.facebook.com/v21.0/{user-id}/accounts?
    access_token={long-lived-user-token}
```

Use the `access_token` from the page you want.

### Step 4: Add to .env

Add the long-lived Page access token to your `.env` file:
```bash
META_ACCESS_TOKEN=EAA...
```

## Monitoring and Debugging

### Check Token State

Add a monitoring endpoint to `backend/src/app.js`:

```javascript
app.get("/health/token", async (req, res) => {
  const { getTokenState } = require("./services/tokenManager.service");
  const state = getTokenState();
  res.json(state);
});
```

**Response:**
```json
{
  "accessToken": "***REDACTED***",
  "expiresAt": "2026-12-01T00:00:00.000Z",
  "lastRefreshedAt": "2026-10-02T16:00:00.000Z",
  "hasToken": true
}
```

### Log Messages

The token manager logs important events:

- `"Initializing token manager"`
- `"Token validated, expiry set to 60 days from now"`
- `"Token invalid, attempting refresh"`
- `"Token expires in X days, refreshing"`
- `"Token refreshed successfully"`
- `"Token refresh failed"`

## Testing

### 1. Test Token Validation

```bash
curl http://localhost:10000/health/token
```

### 2. Test Manual Refresh

Add a test endpoint:

```javascript
app.post("/admin/token/refresh", async (req, res) => {
  const { refreshToken } = require("./services/tokenManager.service");
  const result = await refreshToken();
  res.json({ success: !!result });
});
```

### 3. Test with Expired Token

Temporarily set an expired token in `.env` and restart the server. The token manager should attempt to refresh it automatically.

## Production Considerations

### Database Persistence (Optional)

For production, consider persisting token state to a database instead of in-memory storage:

```javascript
// Example: Store in database
async function saveTokenState(state) {
  await db.tokenState.upsert({
    where: { id: 1 },
    update: state,
    create: { id: 1, ...state }
  });
}

async function loadTokenState() {
  const state = await db.tokenState.findUnique({ where: { id: 1 } });
  if (state) {
    tokenState = {
      accessToken: state.accessToken,
      expiresAt: new Date(state.expiresAt),
      lastRefreshedAt: new Date(state.lastRefreshedAt)
    };
  }
}
```

### Token Rotation

Meta supports token rotation for enhanced security. The current implementation keeps the old token valid until it expires. For stricter security, you could invalidate the old token immediately after refresh.

### Error Handling

The token manager handles errors gracefully:
- If refresh fails, it logs the error
- The old token remains usable until it expires
- Scheduled checks continue to attempt refresh

### Monitoring Alerts

Set up monitoring alerts for:
- Token refresh failures
- Tokens nearing expiry (within 3 days)
- Tokens that have expired

## Troubleshooting

### Issue: "Failed to refresh invalid token"

**Cause:** The current token is expired and cannot be refreshed.

**Solution:** Generate a new long-lived token manually and update `.env`:
1. Go to Meta Developer Dashboard
2. Generate new Page Access Token
3. Update `META_ACCESS_TOKEN` in `.env`
4. Restart server

### Issue: "Missing META_APP_ID or META_APP_SECRET"

**Cause:** Required environment variables not configured.

**Solution:** Add to `.env`:
```bash
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
```

### Issue: Token refresh fails with API error

**Cause:** App ID/Secret incorrect or app permissions revoked.

**Solution:**
1. Verify META_APP_ID and META_APP_SECRET in Meta Developer Dashboard
2. Check app has necessary permissions (instagram_manage_messages, pages_messaging)
3. Verify Page Access Token is still valid

## Security Best Practices

1. **Never commit .env files** - Add `.env` to `.gitignore`
2. **Use environment-specific configs** - Different tokens for dev/staging/prod
3. **Rotate tokens regularly** - Even with auto-refresh, consider manual rotation
4. **Monitor token usage** - Check for unusual activity
5. **Limit token permissions** - Only grant necessary permissions
6. **Use app secrets securely** - Never expose in client-side code

## Summary

**Files Created:**
- `backend/src/services/tokenManager.service.js` - Token management service

**Files Modified:**
- `backend/src/services/instagram.service.js` - Use dynamic tokens
- `backend/server.js` - Initialize token manager on startup
- `backend/src/config/env.js` - Added META_IG_USER_ID and META_GRAPH_API_VERSION

**Benefits:**
- Automatic token refresh before expiry
- No manual intervention required
- Graceful error handling
- Comprehensive logging
- Production-ready with monitoring support

**Next Steps:**
1. Update `.env` with META_APP_ID and META_APP_SECRET
2. Generate a new long-lived Page Access Token
3. Restart the server
4. Monitor logs for token manager initialization
5. Test Instagram webhook to verify automation works
