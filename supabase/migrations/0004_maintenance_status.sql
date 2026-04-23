-- =============================================================
-- Migration 0004 — add status column to maintenance_items
-- =============================================================

alter table maintenance_items
  add column if not exists status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'skipped'));

-- Back-fill: rows with a completed_date are completed
update maintenance_items
  set status = 'completed'
  where completed_date is not null and status = 'scheduled';
