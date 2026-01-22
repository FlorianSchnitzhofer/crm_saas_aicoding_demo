# CRM REST-API Spezifikation (Pipedrive-orientiert)

## Überblick
Diese Spezifikation beschreibt eine REST-API für ein CRM-System nach dem Vorbild von Pipedrive. Die API ist ressourcenorientiert, verwendet JSON und arbeitet mit HTTP-Statuscodes.

- **Base URL:** `https://api.example-crm.com/v1`
- **Content-Type:** `application/json`
- **Zeitzone:** ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`)
- **Idempotenz:** Für schreibende Operationen optional via `Idempotency-Key`

## Authentifizierung
**OAuth 2.0** (Bearer Token) oder **API Key** als Header.

```
Authorization: Bearer <access_token>
X-API-Key: <api_key>
```

## Standard-Response-Hülle
```
{
  "data": { ... },
  "meta": {
    "request_id": "req_123",
    "pagination": {"next_cursor": "..."}
  }
}
```

## Fehlerformat
```
{
  "error": {
    "code": "validation_error",
    "message": "Name ist erforderlich",
    "details": [{"field": "name", "issue": "required"}]
  }
}
```

---

## Kernressourcen

### 1) Benutzer (Users)
- **GET** `/users` – Liste
- **GET** `/users/{id}` – Details
- **POST** `/users` – Erstellen
- **PATCH** `/users/{id}` – Aktualisieren
- **DELETE** `/users/{id}` – Entfernen

**User Objekt**
```
{
  "id": "usr_123",
  "name": "Maria Muster",
  "email": "maria@example.com",
  "role": "admin",
  "active": true,
  "created_at": "2024-01-01T10:00:00Z"
}
```

### 2) Organisationen (Organizations)
- **GET** `/organizations`
- **GET** `/organizations/{id}`
- **POST** `/organizations`
- **PATCH** `/organizations/{id}`
- **DELETE** `/organizations/{id}`

**Query-Parameter (Liste)**
- `search` (String)
- `owner_id` (String)
- `updated_since` (Datetime)
- `cursor` (String)
- `limit` (int, max 200)

**Organization Objekt**
```
{
  "id": "org_123",
  "name": "Acme GmbH",
  "owner_id": "usr_123",
  "address": "Musterstraße 1, 10115 Berlin",
  "phone": "+49 30 123456",
  "email": "info@acme.de",
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

### 3) Personen (Persons)
- **GET** `/persons`
- **GET** `/persons/{id}`
- **POST** `/persons`
- **PATCH** `/persons/{id}`
- **DELETE** `/persons/{id}`

**Person Objekt**
```
{
  "id": "per_456",
  "name": "Jan Beispiel",
  "owner_id": "usr_123",
  "org_id": "org_123",
  "emails": ["jan@example.com"],
  "phones": ["+49 170 1234567"],
  "created_at": "2024-01-11T09:00:00Z"
}
```

### 4) Pipelines & Stages
- **GET** `/pipelines`
- **POST** `/pipelines`
- **PATCH** `/pipelines/{id}`
- **DELETE** `/pipelines/{id}`

- **GET** `/pipelines/{id}/stages`
- **POST** `/pipelines/{id}/stages`
- **PATCH** `/stages/{id}`
- **DELETE** `/stages/{id}`

**Pipeline Objekt**
```
{
  "id": "pipe_001",
  "name": "Sales",
  "order": 1,
  "created_at": "2024-01-01T10:00:00Z"
}
```

**Stage Objekt**
```
{
  "id": "stage_001",
  "pipeline_id": "pipe_001",
  "name": "Qualifizierung",
  "order": 1,
  "probability": 0.2
}
```

### 5) Deals
- **GET** `/deals`
- **GET** `/deals/{id}`
- **POST** `/deals`
- **PATCH** `/deals/{id}`
- **DELETE** `/deals/{id}`
- **POST** `/deals/{id}/won`
- **POST** `/deals/{id}/lost`

**Query-Parameter (Liste)**
- `owner_id`, `org_id`, `person_id`, `stage_id`, `status` (open|won|lost)
- `value_min`, `value_max`
- `updated_since`, `cursor`, `limit`

**Deal Objekt**
```
{
  "id": "deal_789",
  "title": "CRM Einführung",
  "value": 25000,
  "currency": "EUR",
  "status": "open",
  "owner_id": "usr_123",
  "org_id": "org_123",
  "person_id": "per_456",
  "pipeline_id": "pipe_001",
  "stage_id": "stage_001",
  "expected_close_date": "2024-06-30",
  "created_at": "2024-02-01T09:00:00Z"
}
```

**Beispiel: Deal erstellen**
`POST /deals`
```
{
  "title": "CRM Einführung",
  "value": 25000,
  "currency": "EUR",
  "org_id": "org_123",
  "person_id": "per_456",
  "pipeline_id": "pipe_001",
  "stage_id": "stage_001"
}
```

### 6) Aktivitäten (Activities)
- **GET** `/activities`
- **GET** `/activities/{id}`
- **POST** `/activities`
- **PATCH** `/activities/{id}`
- **DELETE** `/activities/{id}`

**Activity Objekt**
```
{
  "id": "act_001",
  "type": "call",
  "subject": "Follow-up",
  "due_date": "2024-03-10",
  "due_time": "14:00",
  "deal_id": "deal_789",
  "person_id": "per_456",
  "owner_id": "usr_123",
  "done": false
}
```

### 7) Notizen (Notes)
- **GET** `/notes`
- **POST** `/notes`
- **PATCH** `/notes/{id}`
- **DELETE** `/notes/{id}`

**Note Objekt**
```
{
  "id": "note_001",
  "content": "Kunde interessiert sich für Enterprise-Plan.",
  "deal_id": "deal_789",
  "person_id": "per_456",
  "org_id": "org_123",
  "created_at": "2024-02-02T12:00:00Z"
}
```

### 8) Produkte (Products)
- **GET** `/products`
- **GET** `/products/{id}`
- **POST** `/products`
- **PATCH** `/products/{id}`
- **DELETE** `/products/{id}`

**Product Objekt**
```
{
  "id": "prod_001",
  "name": "CRM Lizenz",
  "code": "CRM-STD",
  "price": 49,
  "currency": "EUR",
  "active": true
}
```

### 9) Deal-Produkte
- **GET** `/deals/{id}/products`
- **POST** `/deals/{id}/products`
- **PATCH** `/deal-products/{id}`
- **DELETE** `/deal-products/{id}`

**DealProduct Objekt**
```
{
  "id": "dprod_001",
  "deal_id": "deal_789",
  "product_id": "prod_001",
  "quantity": 10,
  "discount": 0.1,
  "total": 441
}
```

---

## Filter, Suche & Pagination
- Cursor-basierte Pagination: `cursor`, `limit`
- Volltextsuche: `search`
- Sortierung: `sort=field` oder `sort=-field`

**Beispiel**
`GET /deals?status=open&sort=-updated_at&limit=50`

---

## Webhooks
- **GET** `/webhooks`
- **POST** `/webhooks`
- **DELETE** `/webhooks/{id}`

**Webhook Objekt**
```
{
  "id": "wh_001",
  "event": "deal.updated",
  "target_url": "https://example.com/webhooks",
  "secret": "whsec_123"
}
```

**Ereignisse**
- `deal.created`, `deal.updated`, `deal.won`, `deal.lost`
- `person.created`, `organization.updated`

---

## Berechtigungen & Rollen
- Rollen: `admin`, `manager`, `user`
- Ressourcen besitzen `owner_id`.
- Zugriff abhängig von Team-/Sichtbarkeitsregeln.

---

## Rate Limiting
- Standard: 1000 Requests / 10 Minuten pro Token
- Response-Header:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Beispiel-Fehler
**409 Conflict** (Duplikat)
```
{
  "error": {
    "code": "conflict",
    "message": "Organisation existiert bereits"
  }
}
```

**422 Unprocessable Entity** (Validierung)
```
{
  "error": {
    "code": "validation_error",
    "message": "Ungültiger Deal-Wert",
    "details": [{"field": "value", "issue": "min"}]
  }
}
```
