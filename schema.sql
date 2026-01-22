-- MariaDB schema for a Pipedrive-inspired CRM system
-- Character set and collation defaults
CREATE DATABASE IF NOT EXISTS crm_pipedrive
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE crm_pipedrive;

CREATE TABLE organizations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  address_line1 VARCHAR(255) DEFAULT NULL,
  address_line2 VARCHAR(255) DEFAULT NULL,
  city VARCHAR(120) DEFAULT NULL,
  region VARCHAR(120) DEFAULT NULL,
  postal_code VARCHAR(30) DEFAULT NULL,
  country_code CHAR(2) DEFAULT NULL,
  website VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_organizations_owner (owner_user_id),
  KEY idx_organizations_name (name)
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','rep') NOT NULL DEFAULT 'rep',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_org_email (organization_id, email),
  KEY idx_users_org (organization_id),
  CONSTRAINT fk_users_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pipelines (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pipelines_org (organization_id),
  CONSTRAINT fk_pipelines_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE stages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  pipeline_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  probability TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_won_stage TINYINT(1) NOT NULL DEFAULT 0,
  is_lost_stage TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stages_pipeline (pipeline_id),
  CONSTRAINT fk_stages_pipeline
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE contacts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  first_name VARCHAR(120) DEFAULT NULL,
  last_name VARCHAR(120) DEFAULT NULL,
  job_title VARCHAR(120) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  mobile VARCHAR(50) DEFAULT NULL,
  company_name VARCHAR(255) DEFAULT NULL,
  address_line1 VARCHAR(255) DEFAULT NULL,
  address_line2 VARCHAR(255) DEFAULT NULL,
  city VARCHAR(120) DEFAULT NULL,
  region VARCHAR(120) DEFAULT NULL,
  postal_code VARCHAR(30) DEFAULT NULL,
  country_code CHAR(2) DEFAULT NULL,
  source VARCHAR(120) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contacts_org (organization_id),
  KEY idx_contacts_owner (owner_user_id),
  KEY idx_contacts_email (email),
  CONSTRAINT fk_contacts_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_contacts_owner
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE organizations_contacts (
  organization_id BIGINT UNSIGNED NOT NULL,
  contact_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (organization_id, contact_id),
  KEY idx_org_contacts_contact (contact_id),
  CONSTRAINT fk_org_contacts_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_org_contacts_contact
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  contact_id BIGINT UNSIGNED DEFAULT NULL,
  source VARCHAR(120) DEFAULT NULL,
  status ENUM('new','qualified','disqualified','converted') NOT NULL DEFAULT 'new',
  expected_value DECIMAL(12,2) DEFAULT NULL,
  currency CHAR(3) DEFAULT 'EUR',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_leads_org (organization_id),
  KEY idx_leads_owner (owner_user_id),
  KEY idx_leads_contact (contact_id),
  CONSTRAINT fk_leads_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_leads_owner
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_leads_contact
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE deals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  pipeline_id BIGINT UNSIGNED NOT NULL,
  stage_id BIGINT UNSIGNED NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  contact_id BIGINT UNSIGNED DEFAULT NULL,
  organization_contact_id BIGINT UNSIGNED DEFAULT NULL,
  value_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  expected_close_date DATE DEFAULT NULL,
  status ENUM('open','won','lost') NOT NULL DEFAULT 'open',
  probability TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  closed_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_deals_org (organization_id),
  KEY idx_deals_pipeline (pipeline_id),
  KEY idx_deals_stage (stage_id),
  KEY idx_deals_owner (owner_user_id),
  KEY idx_deals_contact (contact_id),
  CONSTRAINT fk_deals_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_deals_pipeline
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_deals_stage
    FOREIGN KEY (stage_id) REFERENCES stages(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_deals_owner
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_deals_contact
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_deals_org_contact
    FOREIGN KEY (organization_contact_id) REFERENCES organizations(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE activities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  deal_id BIGINT UNSIGNED DEFAULT NULL,
  lead_id BIGINT UNSIGNED DEFAULT NULL,
  contact_id BIGINT UNSIGNED DEFAULT NULL,
  subject VARCHAR(255) NOT NULL,
  activity_type ENUM('call','email','meeting','task','note') NOT NULL,
  due_at DATETIME DEFAULT NULL,
  duration_minutes INT UNSIGNED DEFAULT NULL,
  status ENUM('planned','done','canceled') NOT NULL DEFAULT 'planned',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activities_org (organization_id),
  KEY idx_activities_owner (owner_user_id),
  KEY idx_activities_deal (deal_id),
  KEY idx_activities_lead (lead_id),
  KEY idx_activities_contact (contact_id),
  CONSTRAINT fk_activities_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_activities_owner
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_activities_deal
    FOREIGN KEY (deal_id) REFERENCES deals(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_activities_lead
    FOREIGN KEY (lead_id) REFERENCES leads(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_activities_contact
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  deal_id BIGINT UNSIGNED DEFAULT NULL,
  lead_id BIGINT UNSIGNED DEFAULT NULL,
  contact_id BIGINT UNSIGNED DEFAULT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notes_org (organization_id),
  KEY idx_notes_owner (owner_user_id),
  KEY idx_notes_deal (deal_id),
  KEY idx_notes_lead (lead_id),
  KEY idx_notes_contact (contact_id),
  CONSTRAINT fk_notes_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_notes_owner
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_notes_deal
    FOREIGN KEY (deal_id) REFERENCES deals(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_notes_lead
    FOREIGN KEY (lead_id) REFERENCES leads(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_notes_contact
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE custom_fields (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  entity_type ENUM('contact','deal','lead','organization') NOT NULL,
  name VARCHAR(255) NOT NULL,
  field_type ENUM('text','number','date','dropdown','multiselect','boolean') NOT NULL,
  is_required TINYINT(1) NOT NULL DEFAULT 0,
  options_json JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_custom_fields_org (organization_id),
  CONSTRAINT fk_custom_fields_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE custom_field_values (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  custom_field_id BIGINT UNSIGNED NOT NULL,
  entity_id BIGINT UNSIGNED NOT NULL,
  value_text TEXT DEFAULT NULL,
  value_number DECIMAL(14,4) DEFAULT NULL,
  value_date DATE DEFAULT NULL,
  value_boolean TINYINT(1) DEFAULT NULL,
  value_json JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_custom_field_entity (custom_field_id, entity_id),
  KEY idx_custom_field_values_field (custom_field_id),
  CONSTRAINT fk_custom_field_values_field
    FOREIGN KEY (custom_field_id) REFERENCES custom_fields(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE files (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  deal_id BIGINT UNSIGNED DEFAULT NULL,
  lead_id BIGINT UNSIGNED DEFAULT NULL,
  contact_id BIGINT UNSIGNED DEFAULT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  file_size_bytes BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_files_org (organization_id),
  KEY idx_files_owner (owner_user_id),
  KEY idx_files_deal (deal_id),
  KEY idx_files_lead (lead_id),
  KEY idx_files_contact (contact_id),
  CONSTRAINT fk_files_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_files_owner
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_files_deal
    FOREIGN KEY (deal_id) REFERENCES deals(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_files_lead
    FOREIGN KEY (lead_id) REFERENCES leads(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_files_contact
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE tag_definitions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  color VARCHAR(20) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tags_org_name (organization_id, name),
  KEY idx_tags_org (organization_id),
  CONSTRAINT fk_tags_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE entity_tags (
  tag_id BIGINT UNSIGNED NOT NULL,
  entity_type ENUM('contact','deal','lead','organization') NOT NULL,
  entity_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tag_id, entity_type, entity_id),
  KEY idx_entity_tags_entity (entity_type, entity_id),
  CONSTRAINT fk_entity_tags_tag
    FOREIGN KEY (tag_id) REFERENCES tag_definitions(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE currencies (
  code CHAR(3) NOT NULL,
  name VARCHAR(120) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  PRIMARY KEY (code)
) ENGINE=InnoDB;

ALTER TABLE deals
  ADD CONSTRAINT fk_deals_currency
  FOREIGN KEY (currency) REFERENCES currencies(code)
  ON DELETE RESTRICT;

ALTER TABLE leads
  ADD CONSTRAINT fk_leads_currency
  FOREIGN KEY (currency) REFERENCES currencies(code)
  ON DELETE RESTRICT;

CREATE TABLE stage_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  deal_id BIGINT UNSIGNED NOT NULL,
  from_stage_id BIGINT UNSIGNED DEFAULT NULL,
  to_stage_id BIGINT UNSIGNED NOT NULL,
  moved_by_user_id BIGINT UNSIGNED NOT NULL,
  moved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stage_history_deal (deal_id),
  KEY idx_stage_history_to_stage (to_stage_id),
  CONSTRAINT fk_stage_history_deal
    FOREIGN KEY (deal_id) REFERENCES deals(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_stage_history_from_stage
    FOREIGN KEY (from_stage_id) REFERENCES stages(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_stage_history_to_stage
    FOREIGN KEY (to_stage_id) REFERENCES stages(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_stage_history_user
    FOREIGN KEY (moved_by_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE permissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permissions_name (name)
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  role ENUM('admin','manager','rep') NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (role, permission_id),
  KEY idx_role_permissions_permission (permission_id),
  CONSTRAINT fk_role_permissions_permission
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
