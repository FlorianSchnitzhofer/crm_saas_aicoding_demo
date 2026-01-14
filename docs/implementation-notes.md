# Implementation Notes

## Pagination
- Cursor-based pagination via `cursor` and `limit` query params; responses include `next_cursor` and optional `total_count` where the query cost is reasonable (e.g., deal lists and kanban stage summaries).
- Kanban endpoint supports per-stage cursors encoded as a JSON map of `{stage_id: cursor}` in `stage_cursor`.

## Filtering & Sorting
- Deal filters support stage, owner, label, status, value range, updated_at range, and next activity due range.
- Sorting uses a `field:direction` syntax (e.g., `updated_at:desc`), with validation on allowed fields per resource.

## Auth & RBAC
- JWT bearer tokens protect all endpoints except login/refresh.
- Roles: `admin` (full access), `manager` (team + owned objects), `rep` (owned objects only).
- Per-object access rules should be enforced on deals, activities, notes, files, contacts, and organizations (e.g., owner or team-based visibility).

## Webhooks
- Events include: `deal.created`, `deal.updated`, `deal.moved`, `deal.won`, `deal.lost`, `activity.created`, `activity.completed`, `note.created`, `file.uploaded`.
- Use `X-Signature` (HMAC SHA-256 of raw body) and `X-Timestamp` to validate webhook integrity.
- Retry strategy: exponential backoff (e.g., 5 attempts over 30 minutes). Deduplicate deliveries using `X-Delivery-Id`.

## Idempotency & Concurrency
- Writes support `Idempotency-Key` for POSTs to prevent duplicates (especially file uploads and deal creation).
- Updates and move operations require `ETag`/`If-Match` for optimistic locking; return `409 Conflict` on version mismatch.

## File Uploads
- Multipart uploads for direct file transfer; pre-signed URL flow for large files (init + direct upload + confirmation).
- Expose download URLs via a dedicated endpoint with short-lived signed URLs.

## Security & Rate Limiting
- Include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.
- Audit logging for sensitive actions (deal stage changes, won/lost updates).
- All timestamps are ISO 8601 UTC; monetary amounts use ISO 4217 currency codes.
