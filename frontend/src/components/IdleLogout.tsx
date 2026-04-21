'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

function resolveIdleMs(): number {
  const raw = (process.env.NEXT_PUBLIC_IDLE_LOGOUT_MINUTES || '').toString().trim();
  const mins = raw ? Number(raw) : 30;
  if (!Number.isFinite(mins) || mins <= 0) return 30 * 60_000;
  return mins * 60_000;
}

export default function IdleLogout() {
  const { isAuthenticated, logout } = useAuthStore();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const router = useRouter();

  const idleMs = useMemo(() => resolveIdleMs(), []);
  const timerRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isAuthenticated) return;

    const clearTimer = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const schedule = () => {
      clearTimer();
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const remain = Math.max(0, idleMs - elapsed);
      timerRef.current = window.setTimeout(() => {
        logout();
        toast.error(locale === 'vi' ? 'Phiên đăng nhập đã hết hạn do không hoạt động.' : 'You have been logged out due to inactivity.');
        router.push(`/${locale}/login`);
      }, remain);
    };

    const onActivity = () => {
      lastActivityRef.current = Date.now();
      schedule();
    };

    schedule();

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'pointerdown',
    ];

    for (const e of events) window.addEventListener(e, onActivity, { passive: true });
    window.addEventListener('visibilitychange', onActivity);

    return () => {
      clearTimer();
      for (const e of events) window.removeEventListener(e, onActivity as any);
      window.removeEventListener('visibilitychange', onActivity as any);
    };
  }, [idleMs, isAuthenticated, locale, logout, router]);

  return null;
}

