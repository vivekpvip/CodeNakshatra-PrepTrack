'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getLevel } from '@/lib/utils';
import LevelUpModal from '@/components/ui/LevelUpModal';

/**
 * Watches the signed-in user's xp_points. When they cross a level threshold,
 * shows the celebratory level-up modal. Mount once inside the dashboard layout.
 */
export default function LevelUpListener() {
  const { profile } = useUser();
  const lastLevelRef = useRef(null);
  const [newLevel, setNewLevel] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const current = getLevel(profile.xp_points || 0);
    if (lastLevelRef.current === null) {
      // First read — establish baseline, don't celebrate.
      lastLevelRef.current = current.level;
      return;
    }
    if (current.level > lastLevelRef.current) {
      setNewLevel(current);
      setOpen(true);
    }
    lastLevelRef.current = current.level;
  }, [profile?.xp_points]);

  return <LevelUpModal open={open} onClose={() => setOpen(false)} level={newLevel} />;
}
