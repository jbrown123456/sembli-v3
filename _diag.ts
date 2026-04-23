import type { Database, Waitlist } from "@/lib/supabase/types";

type GenericRelationship = { foreignKeyName: string; columns: string[]; referencedRelation: string; referencedColumns: string[] }
type GenericTable = { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: GenericRelationship[] }

type WaitlistTable = Database['public']['Tables']['waitlist']

type A = WaitlistTable['Row']    extends Record<string, unknown>  ? 'row_ok'  : 'row_FAILS'
type B = WaitlistTable['Insert'] extends Record<string, unknown>  ? 'ins_ok'  : 'ins_FAILS'
type C = WaitlistTable['Update'] extends Record<string, unknown>  ? 'upd_ok'  : 'upd_FAILS'
type D = WaitlistTable['Relationships'] extends GenericRelationship[] ? 'rel_ok' : 'rel_FAILS'

// direct interface check
type E = Waitlist extends Record<string, unknown> ? 'iface_ok' : 'iface_FAILS'

declare const a: A; const _a: 'x' = a
declare const b: B; const _b: 'x' = b
declare const c: C; const _c: 'x' = c
declare const d: D; const _d: 'x' = d
declare const e: E; const _e: 'x' = e
