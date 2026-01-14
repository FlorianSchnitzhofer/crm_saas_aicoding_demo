# CRM Frontend - API Integration

This CRM frontend is fully integrated with the REST API specification. It supports authentication, real-time data updates, and all CRM operations.

## Features

### ✅ Authentication
- JWT-based authentication with access and refresh tokens
- Login page with demo credentials
- Automatic token refresh on expiration
- Protected routes with redirect to login

### ✅ Pipeline Management
- Drag-and-drop Kanban board with real-time updates
- Cursor-based pagination for deal stages
- Optimistic UI updates for smooth UX
- ETag support for optimistic locking

### ✅ Deal Management
- Create, read, update, and delete deals
- Move deals between stages
- Priority and status management
- Label support
- Real-time activity tracking

### ✅ Activities & Notes
- Schedule activities (calls, meetings, emails, tasks)
- Add notes to deals
- Timeline view with status tracking

### ✅ Contacts & Organizations
- Manage contacts with email and phone
- Organization associations
- Contact-to-deal relationships

### ✅ File Management
- Upload files to deals
- Download with signed URLs
- File metadata tracking

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## API Client Architecture

### Services Layer (`/src/services/api.ts`)

The `APIClient` class handles all API communication:

```typescript
import { apiClient } from "@/services/api";

// Authentication
await apiClient.login(email, password);
await apiClient.refresh();
apiClient.logout();

// Deals
const deals = await apiClient.getDeals(filters, cursor, limit);
const deal = await apiClient.getDeal(dealId);
await apiClient.createDeal(dealData);
await apiClient.updateDeal(dealId, updates, etag);
await apiClient.moveDeal(dealId, { to_stage_id }, etag);

// Contacts
const contacts = await apiClient.getContacts(cursor, limit);
await apiClient.createContact(contactData);

// Activities
const activities = await apiClient.getActivities(cursor, limit);
await apiClient.createActivity(activityData);

// Notes
await apiClient.createNote({ deal_id, body });

// Files
await apiClient.uploadFile(file, dealId);
```

### Authentication Context (`/src/contexts/AuthContext.tsx`)

Manages authentication state across the application:

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use auth state
}
```

## Type System

All API types are defined in `/src/types/api.ts` based on the OpenAPI specification:

- `Deal`, `DealCreate`, `DealUpdate`
- `Contact`, `Activity`, `Note`, `File`
- `Pipeline`, `Stage`, `PipelineKanban`
- `PaginatedResponse<T>`
- `DealFilters`, `DealStatus`, `DealPriority`

## Key Implementation Details

### Optimistic Locking

The frontend supports ETag-based optimistic locking:

```typescript
const { deal, etag } = await apiClient.getDeal(dealId);
await apiClient.updateDeal(dealId, updates, etag);
```

Returns `409 Conflict` on version mismatch.

### Pagination

Cursor-based pagination is implemented throughout:

```typescript
const response = await apiClient.getDeals({}, cursor, 50);
const { data, next_cursor, total_count } = response;

// Load more with next_cursor
```

### Error Handling

API errors follow RFC 7807 Problem Details:

```typescript
try {
  await apiClient.createDeal(dealData);
} catch (error) {
  // Error includes: type, title, status, detail, code
  console.error(error.message);
}
```

### Rate Limiting

The client reads rate limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Demo Credentials

For testing the API integration:

```
Email: rep@example.com
Password: Secret123!
```

## Component Updates

### PipelineView
- Loads pipeline from `/pipelines/{id}/kanban`
- Implements drag-and-drop with API updates
- Handles optimistic UI updates

### DealDetailPanel
- Fetches deal details with ETag
- Manages activities and notes
- Supports file uploads
- Real-time status updates

### DealsView
- Lists all deals with filtering
- Supports pagination
- Table view with sortable columns

### ContactsView
- Loads contacts from API
- Grid layout with contact cards

### ActivitiesView
- Lists all activities
- Filter by deal or contact
- Status tracking

## Development

### Running with Mock API

For development without a backend, you can use MSW (Mock Service Worker):

```bash
npm install msw --save-dev
```

Create mock handlers in `/src/mocks/handlers.ts`

### Running with Real API

1. Start your backend API server
2. Update `.env` with the correct API URL
3. Run the frontend:

```bash
npm run dev
```

## API Endpoints Used

### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh

### Pipelines
- `GET /pipelines` - List pipelines
- `GET /pipelines/{id}/kanban` - Kanban view

### Deals
- `GET /deals` - List deals with filters
- `GET /deals/{id}` - Get deal details
- `POST /deals` - Create deal
- `PATCH /deals/{id}` - Update deal
- `POST /deals/{id}/move` - Move deal to stage
- `DELETE /deals/{id}` - Delete deal

### Contacts
- `GET /contacts` - List contacts
- `POST /contacts` - Create contact

### Activities
- `GET /activities` - List activities
- `POST /activities` - Create activity
- `PATCH /activities/{id}` - Update activity

### Notes
- `GET /notes` - List notes
- `POST /notes` - Create note

### Files
- `POST /files` - Upload file
- `GET /files/{id}/download` - Get download URL

## Future Enhancements

- [ ] Webhooks subscription UI
- [ ] Bulk operations UI
- [ ] Advanced filtering UI
- [ ] Reports integration
- [ ] Real-time updates with WebSockets
- [ ] Offline support with service workers
- [ ] File preview
- [ ] Email integration
- [ ] Calendar sync

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your backend allows requests from your frontend origin:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

### 401 Unauthorized

- Check that tokens are being stored in localStorage
- Verify token expiration handling
- Ensure refresh token is valid

### Network Errors

- Verify API_BASE_URL is correct
- Check that backend is running
- Inspect browser console for details

## Support

For API-related issues, refer to the OpenAPI specification or backend documentation.
