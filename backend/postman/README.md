# Postman Assets

These files use the format Postman understands for import:

- `Collection v2.1 JSON` for request collections
- `Environment JSON` for shared variables

## Files

- `auth.postman_collection.json`
- `captcha.postman_collection.json`
- `otp.postman_collection.json`
- `catalog.postman_collection.json`
- `admin.postman_collection.json`
- `droom-backend.local.postman_environment.json`

Each `*.postman_collection.json` file is its own Postman collection, grouped by feature area so importing them creates separate collections such as `Auth`, `Catalog`, and `Admin`.

## Import

1. Open Postman.
2. Click `Import`.
3. Import the environment file first:
   - `postman/droom-backend.local.postman_environment.json`
4. Import any or all collection files from `postman/`.
5. Select the `Droom Backend Local` environment.

## Suggested flow

1. `Captcha` collection:
   - Run `Get Captcha`
   - `captchaId` is stored automatically from the response
   - Set `captchaText` in the environment from the backend server logs
   - Run `Verify Captcha`
2. `OTP` collection:
   - Run `Send OTP`
   - Enter the OTP from backend logs into `otp`
   - Run `Verify OTP For Register` or `Verify OTP For Login`
3. `Auth` collection:
   - Run `Register User` or `Login User`
   - `accessToken` is stored automatically when present
4. `Catalog` collection:
   - Run category, brand, and model requests to populate IDs automatically
5. `Admin` collection:
   - Create catalog entities if needed
   - Upload files if needed
   - Create, fetch, and update vehicles

## Notes

- The backend mounts routes under:
  - `/user`
  - `/captcha`
  - `/otp`
  - `/api`
- Admin catalog write APIs are available at:
  - `/api/admin/categories`
  - `/api/admin/brands`
  - `/api/admin/models`
- File upload requests use sample local paths like `/tmp/example-car.jpg`. Replace them with real files before sending.
- OTP values are not returned by the API; this backend logs them to the server console.
- Captcha text is also not returned by the API; only `captchaId` and `captchaSvg` are returned, while the readable captcha text is logged by the backend.
