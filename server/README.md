# CMB Community Backend

Express + MongoDB + S3 API for the TCJP site: phone-OTP auth, posts (image/video),
threaded comments, likes. Anonymous is a per-post/comment flag — real author is
always stored; only admins (and the author) see through it.

## Run

```bash
cp .env.example .env   # fill MONGODB_URI + JWT secrets at minimum
npm install
npm run dev            # http://localhost:4000
```

Dev defaults: `SMS_PROVIDER=console` logs the OTP to stdout and the code is always
`123456`, so you can log in with no SMS provider. Set `SMS_PROVIDER=msg91` +
`MSG91_*` for real SMS.

## API docs (Swagger)

Interactive UI: **http://localhost:4000/docs** · raw OpenAPI 3.0 JSON: `/docs.json`.
Click **Authorize** in the UI and paste an access token to try authenticated
routes. Spec lives in `src/docs/openapi.js`.

## API

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/otp/request` | – | `{phone}` → sends OTP |
| POST | `/auth/otp/verify` | – | `{phone,code}` → `{user,isNewUser,accessToken,refreshToken}` |
| POST | `/auth/profile` | yes | `{username,displayName}` finish signup |
| POST | `/auth/refresh` | – | `{refreshToken}` → rotated tokens |
| POST | `/auth/logout` | – | revoke refresh token |
| GET | `/auth/me` | yes | current user |
| POST | `/media/presign` | yes | `{type,contentType,size}` → S3 presigned PUT |
| GET | `/posts` | optional | `?cursor&limit` cursor feed |
| POST | `/posts` | yes | `{title,body,media[],anonymous}` |
| GET | `/posts/:id` | optional | |
| PATCH | `/posts/:id` | owner/admin | |
| DELETE | `/posts/:id` | owner/admin | soft-remove |
| POST/DELETE | `/posts/:id/like` | yes | |
| GET | `/posts/:id/comments` | optional | flat list, client rebuilds tree |
| POST | `/posts/:id/comments` | yes | `{body,parentId?,anonymous}`, depth ≤3 |
| DELETE | `/comments/:id` | owner/admin | |
| POST/DELETE | `/comments/:id/like` | yes | |

## Upload flow

1. `POST /media/presign` → `{uploadUrl, key, url}`
2. Client `PUT`s the file bytes to `uploadUrl` (same Content-Type sent to presign)
3. Client includes `{type,key,url}` in the post's `media[]`

Images ≤8 MB (`jpg/png/webp/gif`), video ≤100 MB (`mp4/webm/mov`). Bucket must be
public-read (or fronted by CloudFront via `S3_PUBLIC_BASE_URL`).

## Make an admin

```js
// mongo shell
db.users.updateOne({ phone: "+91..." }, { $set: { role: "admin" } })
```
