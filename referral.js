/**
 * referral.js — Bắt tín hiệu link giới thiệu (affiliate) trên mọi trang.
 * Đọc ?ref=CODE trên URL → lưu local (last-touch) + ghi log click lên Supabase (nếu có).
 * Dùng chung bởi index.html, portal.html, kegel-khoi-dau.html, khoa-hoc.html, my-courses.html...
 */

import { supabase, isSupabaseEnabled } from './supabase.js';

const LS_REF = 'mm21_ref_code';

async function capture() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (!ref) return;

  const clean = ref.trim().toLowerCase().slice(0, 32);
  localStorage.setItem(LS_REF, clean);

  if (isSupabaseEnabled) {
    try { await supabase.from('referral_clicks').insert({ ref_code: clean }); } catch (_) {}
  }
}

capture();

export function getReferralCode() {
  return localStorage.getItem(LS_REF) || '';
}
