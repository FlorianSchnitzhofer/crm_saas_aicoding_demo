import fs from "node:fs";
import path from "node:path";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { all, get, run } from "./db.js";

const app = express();
const api = express.Router();
const uploadDir = path.resolve("backend", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });
const jwtSecret = process.env.JWT_SECRET || "dev-secret";

app.use(express.json());

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Missing bearer token." });
    return;
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const now = () => new Date().toISOString();

const issueTokens = (user) => {
  const access = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    jwtSecret,
    { expiresIn: "1h" }
  );
  const refresh = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: "7d" });
  return { access_token: access, refresh_token: refresh, token_type: "bearer" };
};

api.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "email and password required." });
    return;
  }
  const user = await get("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }
  res.json(issueTokens(user));
});

api.post("/auth/refresh", async (req, res) => {
  const { refresh_token: refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: "refresh_token required." });
    return;
  }
  try {
    const payload = jwt.verify(refreshToken, jwtSecret);
    const user = await get("SELECT * FROM users WHERE id = ?", [payload.sub]);
    if (!user) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }
    res.json(issueTokens(user));
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
});

api.use(authMiddleware);

api.get("/users", async (_req, res) => {
  const users = await all(
    "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC"
  );
  res.json({ data: users });
});

api.post("/users", async (req, res) => {
  const { name, email, role, password } = req.body;
  if (!name || !email || !role || !password) {
    res.status(400).json({ error: "name, email, role, password required." });
    return;
  }
  const id = uuidv4();
  const hash = await bcrypt.hash(password, 10);
  const timestamp = now();
  await run(
    "INSERT INTO users (id, name, email, role, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, email, role, hash, timestamp, timestamp]
  );
  res.status(201).json({ id, name, email, role, created_at: timestamp, updated_at: timestamp });
});

api.get("/users/:userId", async (req, res) => {
  const user = await get(
    "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
    [req.params.userId]
  );
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  res.json(user);
});

api.patch("/users/:userId", async (req, res) => {
  const { name, email, role, password } = req.body;
  const user = await get("SELECT * FROM users WHERE id = ?", [req.params.userId]);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  const updated = {
    name: name ?? user.name,
    email: email ?? user.email,
    role: role ?? user.role,
    password_hash: user.password_hash
  };
  if (password) {
    updated.password_hash = await bcrypt.hash(password, 10);
  }
  const timestamp = now();
  await run(
    "UPDATE users SET name = ?, email = ?, role = ?, password_hash = ?, updated_at = ? WHERE id = ?",
    [updated.name, updated.email, updated.role, updated.password_hash, timestamp, req.params.userId]
  );
  res.json({ id: req.params.userId, ...updated, updated_at: timestamp });
});

api.delete("/users/:userId", async (req, res) => {
  await run("DELETE FROM users WHERE id = ?", [req.params.userId]);
  res.status(204).send();
});

api.get("/pipelines", async (_req, res) => {
  const pipelines = await all("SELECT * FROM pipelines ORDER BY created_at DESC");
  res.json({ data: pipelines });
});

api.post("/pipelines", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "name required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO pipelines (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
    [id, name, timestamp, timestamp]
  );
  res.status(201).json({ id, name, created_at: timestamp, updated_at: timestamp });
});

api.get("/pipelines/:pipelineId", async (req, res) => {
  const pipeline = await get("SELECT * FROM pipelines WHERE id = ?", [req.params.pipelineId]);
  if (!pipeline) {
    res.status(404).json({ error: "Pipeline not found." });
    return;
  }
  res.json(pipeline);
});

api.patch("/pipelines/:pipelineId", async (req, res) => {
  const { name } = req.body;
  const pipeline = await get("SELECT * FROM pipelines WHERE id = ?", [req.params.pipelineId]);
  if (!pipeline) {
    res.status(404).json({ error: "Pipeline not found." });
    return;
  }
  const timestamp = now();
  await run("UPDATE pipelines SET name = ?, updated_at = ? WHERE id = ?", [
    name ?? pipeline.name,
    timestamp,
    req.params.pipelineId
  ]);
  res.json({ ...pipeline, name: name ?? pipeline.name, updated_at: timestamp });
});

api.delete("/pipelines/:pipelineId", async (req, res) => {
  await run("DELETE FROM pipelines WHERE id = ?", [req.params.pipelineId]);
  res.status(204).send();
});

api.get("/pipelines/:pipelineId/stages", async (req, res) => {
  const stages = await all("SELECT * FROM stages WHERE pipeline_id = ? ORDER BY order_index", [
    req.params.pipelineId
  ]);
  res.json({ data: stages });
});

api.post("/pipelines/:pipelineId/stages", async (req, res) => {
  const { name, order_index: orderIndex } = req.body;
  if (!name || orderIndex === undefined) {
    res.status(400).json({ error: "name and order_index required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO stages (id, pipeline_id, name, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, req.params.pipelineId, name, orderIndex, timestamp, timestamp]
  );
  res.status(201).json({
    id,
    pipeline_id: req.params.pipelineId,
    name,
    order_index: orderIndex,
    created_at: timestamp,
    updated_at: timestamp
  });
});

api.get("/stages/:stageId", async (req, res) => {
  const stage = await get("SELECT * FROM stages WHERE id = ?", [req.params.stageId]);
  if (!stage) {
    res.status(404).json({ error: "Stage not found." });
    return;
  }
  res.json(stage);
});

api.patch("/stages/:stageId", async (req, res) => {
  const { name, order_index: orderIndex } = req.body;
  const stage = await get("SELECT * FROM stages WHERE id = ?", [req.params.stageId]);
  if (!stage) {
    res.status(404).json({ error: "Stage not found." });
    return;
  }
  const timestamp = now();
  await run(
    "UPDATE stages SET name = ?, order_index = ?, updated_at = ? WHERE id = ?",
    [name ?? stage.name, orderIndex ?? stage.order_index, timestamp, req.params.stageId]
  );
  res.json({
    ...stage,
    name: name ?? stage.name,
    order_index: orderIndex ?? stage.order_index,
    updated_at: timestamp
  });
});

api.delete("/stages/:stageId", async (req, res) => {
  await run("DELETE FROM stages WHERE id = ?", [req.params.stageId]);
  res.status(204).send();
});

api.get("/deals", async (req, res) => {
  const { stage_id: stageId, owner_id: ownerId, status, q, limit = 50, offset = 0 } = req.query;
  const filters = [];
  const params = [];
  if (stageId) {
    filters.push("stage_id = ?");
    params.push(stageId);
  }
  if (ownerId) {
    filters.push("owner_id = ?");
    params.push(ownerId);
  }
  if (status) {
    filters.push("status = ?");
    params.push(status);
  }
  if (q) {
    filters.push("title LIKE ?");
    params.push(`%${q}%`);
  }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const deals = await all(
    `SELECT * FROM deals ${where} ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  res.json({ data: deals, limit: Number(limit), offset: Number(offset) });
});

api.post("/deals", async (req, res) => {
  const {
    title,
    value_amount: valueAmount = 0,
    value_currency: valueCurrency = "EUR",
    status = "open",
    stage_id: stageId,
    owner_id: ownerId,
    organization_id: organizationId,
    contact_id: contactId,
    expected_close_date: expectedCloseDate
  } = req.body;
  if (!title || !stageId || !ownerId) {
    res.status(400).json({ error: "title, stage_id, owner_id required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO deals (id, title, value_amount, value_currency, status, stage_id, owner_id, organization_id, contact_id, expected_close_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      title,
      valueAmount,
      valueCurrency,
      status,
      stageId,
      ownerId,
      organizationId ?? null,
      contactId ?? null,
      expectedCloseDate ?? null,
      timestamp,
      timestamp
    ]
  );
  res.status(201).json({
    id,
    title,
    value_amount: valueAmount,
    value_currency: valueCurrency,
    status,
    stage_id: stageId,
    owner_id: ownerId,
    organization_id: organizationId ?? null,
    contact_id: contactId ?? null,
    expected_close_date: expectedCloseDate ?? null,
    created_at: timestamp,
    updated_at: timestamp,
    version: 1
  });
});

api.get("/deals/:dealId", async (req, res) => {
  const deal = await get("SELECT * FROM deals WHERE id = ?", [req.params.dealId]);
  if (!deal) {
    res.status(404).json({ error: "Deal not found." });
    return;
  }
  res.json(deal);
});

api.patch("/deals/:dealId", async (req, res) => {
  const deal = await get("SELECT * FROM deals WHERE id = ?", [req.params.dealId]);
  if (!deal) {
    res.status(404).json({ error: "Deal not found." });
    return;
  }
  const payload = {
    title: req.body.title ?? deal.title,
    value_amount: req.body.value_amount ?? deal.value_amount,
    value_currency: req.body.value_currency ?? deal.value_currency,
    status: req.body.status ?? deal.status,
    stage_id: req.body.stage_id ?? deal.stage_id,
    owner_id: req.body.owner_id ?? deal.owner_id,
    organization_id: req.body.organization_id ?? deal.organization_id,
    contact_id: req.body.contact_id ?? deal.contact_id,
    expected_close_date: req.body.expected_close_date ?? deal.expected_close_date
  };
  const timestamp = now();
  const nextVersion = deal.version + 1;
  await run(
    "UPDATE deals SET title = ?, value_amount = ?, value_currency = ?, status = ?, stage_id = ?, owner_id = ?, organization_id = ?, contact_id = ?, expected_close_date = ?, updated_at = ?, version = ? WHERE id = ?",
    [
      payload.title,
      payload.value_amount,
      payload.value_currency,
      payload.status,
      payload.stage_id,
      payload.owner_id,
      payload.organization_id,
      payload.contact_id,
      payload.expected_close_date,
      timestamp,
      nextVersion,
      req.params.dealId
    ]
  );
  res.json({ ...deal, ...payload, updated_at: timestamp, version: nextVersion });
});

api.delete("/deals/:dealId", async (req, res) => {
  await run("DELETE FROM deals WHERE id = ?", [req.params.dealId]);
  res.status(204).send();
});

api.post("/deals/:dealId/move", async (req, res) => {
  const { stage_id: stageId } = req.body;
  if (!stageId) {
    res.status(400).json({ error: "stage_id required." });
    return;
  }
  const deal = await get("SELECT * FROM deals WHERE id = ?", [req.params.dealId]);
  if (!deal) {
    res.status(404).json({ error: "Deal not found." });
    return;
  }
  const timestamp = now();
  const nextVersion = deal.version + 1;
  await run("UPDATE deals SET stage_id = ?, updated_at = ?, version = ? WHERE id = ?", [
    stageId,
    timestamp,
    nextVersion,
    req.params.dealId
  ]);
  res.json({ ...deal, stage_id: stageId, updated_at: timestamp, version: nextVersion });
});

api.post("/deals/bulk", async (req, res) => {
  const { ids, status, stage_id: stageId } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: "ids array required." });
    return;
  }
  const timestamp = now();
  const updates = [];
  if (status) {
    updates.push({ field: "status", value: status });
  }
  if (stageId) {
    updates.push({ field: "stage_id", value: stageId });
  }
  if (updates.length === 0) {
    res.status(400).json({ error: "status or stage_id required." });
    return;
  }
  const setClause = updates.map((item) => `${item.field} = ?`).join(", ");
  const params = updates.map((item) => item.value);
  params.push(timestamp);
  const placeholders = ids.map(() => "?").join(", ");
  await run(
    `UPDATE deals SET ${setClause}, updated_at = ?, version = version + 1 WHERE id IN (${placeholders})`,
    [...params, ...ids]
  );
  res.json({ updated: ids.length });
});

api.get("/contacts", async (_req, res) => {
  const contacts = await all("SELECT * FROM contacts ORDER BY created_at DESC");
  res.json({ data: contacts });
});

api.post("/contacts", async (req, res) => {
  const { first_name: firstName, last_name: lastName, email, phone, title, organization_id: orgId } =
    req.body;
  if (!firstName || !lastName) {
    res.status(400).json({ error: "first_name and last_name required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO contacts (id, organization_id, first_name, last_name, email, phone, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, orgId ?? null, firstName, lastName, email ?? null, phone ?? null, title ?? null, timestamp, timestamp]
  );
  res.status(201).json({
    id,
    organization_id: orgId ?? null,
    first_name: firstName,
    last_name: lastName,
    email: email ?? null,
    phone: phone ?? null,
    title: title ?? null,
    created_at: timestamp,
    updated_at: timestamp
  });
});

api.get("/contacts/:contactId", async (req, res) => {
  const contact = await get("SELECT * FROM contacts WHERE id = ?", [req.params.contactId]);
  if (!contact) {
    res.status(404).json({ error: "Contact not found." });
    return;
  }
  res.json(contact);
});

api.patch("/contacts/:contactId", async (req, res) => {
  const contact = await get("SELECT * FROM contacts WHERE id = ?", [req.params.contactId]);
  if (!contact) {
    res.status(404).json({ error: "Contact not found." });
    return;
  }
  const payload = {
    organization_id: req.body.organization_id ?? contact.organization_id,
    first_name: req.body.first_name ?? contact.first_name,
    last_name: req.body.last_name ?? contact.last_name,
    email: req.body.email ?? contact.email,
    phone: req.body.phone ?? contact.phone,
    title: req.body.title ?? contact.title
  };
  const timestamp = now();
  await run(
    "UPDATE contacts SET organization_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?, title = ?, updated_at = ? WHERE id = ?",
    [
      payload.organization_id,
      payload.first_name,
      payload.last_name,
      payload.email,
      payload.phone,
      payload.title,
      timestamp,
      req.params.contactId
    ]
  );
  res.json({ ...contact, ...payload, updated_at: timestamp });
});

api.delete("/contacts/:contactId", async (req, res) => {
  await run("DELETE FROM contacts WHERE id = ?", [req.params.contactId]);
  res.status(204).send();
});

api.get("/organizations", async (_req, res) => {
  const organizations = await all("SELECT * FROM organizations ORDER BY created_at DESC");
  res.json({ data: organizations });
});

api.post("/organizations", async (req, res) => {
  const { name, domain, industry } = req.body;
  if (!name) {
    res.status(400).json({ error: "name required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO organizations (id, name, domain, industry, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, domain ?? null, industry ?? null, timestamp, timestamp]
  );
  res.status(201).json({
    id,
    name,
    domain: domain ?? null,
    industry: industry ?? null,
    created_at: timestamp,
    updated_at: timestamp
  });
});

api.get("/organizations/:organizationId", async (req, res) => {
  const organization = await get("SELECT * FROM organizations WHERE id = ?", [
    req.params.organizationId
  ]);
  if (!organization) {
    res.status(404).json({ error: "Organization not found." });
    return;
  }
  res.json(organization);
});

api.patch("/organizations/:organizationId", async (req, res) => {
  const organization = await get("SELECT * FROM organizations WHERE id = ?", [
    req.params.organizationId
  ]);
  if (!organization) {
    res.status(404).json({ error: "Organization not found." });
    return;
  }
  const payload = {
    name: req.body.name ?? organization.name,
    domain: req.body.domain ?? organization.domain,
    industry: req.body.industry ?? organization.industry
  };
  const timestamp = now();
  await run(
    "UPDATE organizations SET name = ?, domain = ?, industry = ?, updated_at = ? WHERE id = ?",
    [payload.name, payload.domain, payload.industry, timestamp, req.params.organizationId]
  );
  res.json({ ...organization, ...payload, updated_at: timestamp });
});

api.delete("/organizations/:organizationId", async (req, res) => {
  await run("DELETE FROM organizations WHERE id = ?", [req.params.organizationId]);
  res.status(204).send();
});

api.get("/activities", async (req, res) => {
  const { deal_id: dealId, owner_id: ownerId } = req.query;
  const filters = [];
  const params = [];
  if (dealId) {
    filters.push("deal_id = ?");
    params.push(dealId);
  }
  if (ownerId) {
    filters.push("owner_id = ?");
    params.push(ownerId);
  }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const activities = await all(`SELECT * FROM activities ${where} ORDER BY created_at DESC`, params);
  res.json({ data: activities });
});

api.post("/activities", async (req, res) => {
  const { deal_id: dealId, owner_id: ownerId, type, subject, due_date: dueDate } = req.body;
  if (!ownerId || !type || !subject) {
    res.status(400).json({ error: "owner_id, type, subject required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO activities (id, deal_id, owner_id, type, subject, due_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, dealId ?? null, ownerId, type, subject, dueDate ?? null, timestamp, timestamp]
  );
  res.status(201).json({
    id,
    deal_id: dealId ?? null,
    owner_id: ownerId,
    type,
    subject,
    due_date: dueDate ?? null,
    created_at: timestamp,
    updated_at: timestamp
  });
});

api.get("/activities/:activityId", async (req, res) => {
  const activity = await get("SELECT * FROM activities WHERE id = ?", [req.params.activityId]);
  if (!activity) {
    res.status(404).json({ error: "Activity not found." });
    return;
  }
  res.json(activity);
});

api.patch("/activities/:activityId", async (req, res) => {
  const activity = await get("SELECT * FROM activities WHERE id = ?", [req.params.activityId]);
  if (!activity) {
    res.status(404).json({ error: "Activity not found." });
    return;
  }
  const payload = {
    deal_id: req.body.deal_id ?? activity.deal_id,
    owner_id: req.body.owner_id ?? activity.owner_id,
    type: req.body.type ?? activity.type,
    subject: req.body.subject ?? activity.subject,
    due_date: req.body.due_date ?? activity.due_date,
    completed_at: req.body.completed_at ?? activity.completed_at
  };
  const timestamp = now();
  await run(
    "UPDATE activities SET deal_id = ?, owner_id = ?, type = ?, subject = ?, due_date = ?, completed_at = ?, updated_at = ? WHERE id = ?",
    [
      payload.deal_id,
      payload.owner_id,
      payload.type,
      payload.subject,
      payload.due_date,
      payload.completed_at,
      timestamp,
      req.params.activityId
    ]
  );
  res.json({ ...activity, ...payload, updated_at: timestamp });
});

api.delete("/activities/:activityId", async (req, res) => {
  await run("DELETE FROM activities WHERE id = ?", [req.params.activityId]);
  res.status(204).send();
});

api.get("/notes", async (req, res) => {
  const { deal_id: dealId } = req.query;
  const notes = await all(
    "SELECT * FROM notes WHERE (? IS NULL OR deal_id = ?) ORDER BY created_at DESC",
    [dealId ?? null, dealId ?? null]
  );
  res.json({ data: notes });
});

api.post("/notes", async (req, res) => {
  const { deal_id: dealId, author_id: authorId, content } = req.body;
  if (!authorId || !content) {
    res.status(400).json({ error: "author_id and content required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO notes (id, deal_id, author_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, dealId ?? null, authorId, content, timestamp, timestamp]
  );
  res.status(201).json({
    id,
    deal_id: dealId ?? null,
    author_id: authorId,
    content,
    created_at: timestamp,
    updated_at: timestamp
  });
});

api.get("/notes/:noteId", async (req, res) => {
  const note = await get("SELECT * FROM notes WHERE id = ?", [req.params.noteId]);
  if (!note) {
    res.status(404).json({ error: "Note not found." });
    return;
  }
  res.json(note);
});

api.patch("/notes/:noteId", async (req, res) => {
  const note = await get("SELECT * FROM notes WHERE id = ?", [req.params.noteId]);
  if (!note) {
    res.status(404).json({ error: "Note not found." });
    return;
  }
  const payload = {
    content: req.body.content ?? note.content
  };
  const timestamp = now();
  await run("UPDATE notes SET content = ?, updated_at = ? WHERE id = ?", [
    payload.content,
    timestamp,
    req.params.noteId
  ]);
  res.json({ ...note, ...payload, updated_at: timestamp });
});

api.delete("/notes/:noteId", async (req, res) => {
  await run("DELETE FROM notes WHERE id = ?", [req.params.noteId]);
  res.status(204).send();
});

api.get("/files", async (_req, res) => {
  const files = await all("SELECT * FROM files ORDER BY created_at DESC");
  res.json({ data: files });
});

api.post("/files", upload.single("file"), async (req, res) => {
  const { deal_id: dealId, uploader_id: uploaderId } = req.body;
  if (!req.file || !uploaderId) {
    res.status(400).json({ error: "file and uploader_id required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO files (id, deal_id, uploader_id, filename, mime_type, size_bytes, storage_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      dealId ?? null,
      uploaderId,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      req.file.path,
      timestamp
    ]
  );
  res.status(201).json({
    id,
    deal_id: dealId ?? null,
    uploader_id: uploaderId,
    filename: req.file.originalname,
    mime_type: req.file.mimetype,
    size_bytes: req.file.size,
    created_at: timestamp
  });
});

api.get("/files/:fileId", async (req, res) => {
  const file = await get("SELECT * FROM files WHERE id = ?", [req.params.fileId]);
  if (!file) {
    res.status(404).json({ error: "File not found." });
    return;
  }
  res.json(file);
});

api.delete("/files/:fileId", async (req, res) => {
  const file = await get("SELECT * FROM files WHERE id = ?", [req.params.fileId]);
  if (file?.storage_path && fs.existsSync(file.storage_path)) {
    fs.unlinkSync(file.storage_path);
  }
  await run("DELETE FROM files WHERE id = ?", [req.params.fileId]);
  res.status(204).send();
});

api.get("/files/:fileId/download", async (req, res) => {
  const file = await get("SELECT * FROM files WHERE id = ?", [req.params.fileId]);
  if (!file) {
    res.status(404).json({ error: "File not found." });
    return;
  }
  res.download(file.storage_path, file.filename);
});

api.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).json({ error: "q required." });
    return;
  }
  const term = `%${q}%`;
  const deals = await all("SELECT * FROM deals WHERE title LIKE ? LIMIT 20", [term]);
  const contacts = await all(
    "SELECT * FROM contacts WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? LIMIT 20",
    [term, term, term]
  );
  const organizations = await all("SELECT * FROM organizations WHERE name LIKE ? LIMIT 20", [term]);
  res.json({ deals, contacts, organizations });
});

api.get("/reports/funnel", async (_req, res) => {
  const rows = await all(
    "SELECT stage_id, COUNT(*) as count, SUM(value_amount) as total_value FROM deals WHERE status = 'open' GROUP BY stage_id"
  );
  res.json({ data: rows });
});

api.get("/reports/win-rate", async (_req, res) => {
  const totals = await get(
    "SELECT SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as won, COUNT(*) as total FROM deals"
  );
  const winRate = totals?.total ? totals.won / totals.total : 0;
  res.json({ won: totals?.won ?? 0, total: totals?.total ?? 0, win_rate: winRate });
});

api.get("/reports/forecast", async (_req, res) => {
  const rows = await all(
    "SELECT strftime('%Y-%m', expected_close_date) as month, SUM(value_amount) as forecast_value FROM deals WHERE status = 'open' AND expected_close_date IS NOT NULL GROUP BY month"
  );
  res.json({ data: rows });
});

api.get("/reports/activity-counts", async (_req, res) => {
  const rows = await all(
    "SELECT owner_id, COUNT(*) as count FROM activities GROUP BY owner_id"
  );
  res.json({ data: rows });
});

api.get("/webhooks", async (_req, res) => {
  const webhooks = await all("SELECT * FROM webhooks ORDER BY created_at DESC");
  res.json({ data: webhooks });
});

api.post("/webhooks", async (req, res) => {
  const { url, events, secret, active = true } = req.body;
  if (!url || !events || !secret) {
    res.status(400).json({ error: "url, events, secret required." });
    return;
  }
  const id = uuidv4();
  const timestamp = now();
  await run(
    "INSERT INTO webhooks (id, url, events, secret, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, url, JSON.stringify(events), secret, active ? 1 : 0, timestamp, timestamp]
  );
  res.status(201).json({
    id,
    url,
    events,
    secret,
    active,
    created_at: timestamp,
    updated_at: timestamp
  });
});

api.get("/webhooks/:webhookId", async (req, res) => {
  const webhook = await get("SELECT * FROM webhooks WHERE id = ?", [req.params.webhookId]);
  if (!webhook) {
    res.status(404).json({ error: "Webhook not found." });
    return;
  }
  res.json({ ...webhook, events: JSON.parse(webhook.events) });
});

api.patch("/webhooks/:webhookId", async (req, res) => {
  const webhook = await get("SELECT * FROM webhooks WHERE id = ?", [req.params.webhookId]);
  if (!webhook) {
    res.status(404).json({ error: "Webhook not found." });
    return;
  }
  const payload = {
    url: req.body.url ?? webhook.url,
    events: req.body.events ? JSON.stringify(req.body.events) : webhook.events,
    secret: req.body.secret ?? webhook.secret,
    active: req.body.active ?? Boolean(webhook.active)
  };
  const timestamp = now();
  await run(
    "UPDATE webhooks SET url = ?, events = ?, secret = ?, active = ?, updated_at = ? WHERE id = ?",
    [
      payload.url,
      payload.events,
      payload.secret,
      payload.active ? 1 : 0,
      timestamp,
      req.params.webhookId
    ]
  );
  res.json({
    id: req.params.webhookId,
    url: payload.url,
    events: JSON.parse(payload.events),
    secret: payload.secret,
    active: payload.active,
    updated_at: timestamp
  });
});

api.delete("/webhooks/:webhookId", async (req, res) => {
  await run("DELETE FROM webhooks WHERE id = ?", [req.params.webhookId]);
  res.status(204).send();
});

app.use("/api/v1", api);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`CRM API listening on port ${port}`);
});
