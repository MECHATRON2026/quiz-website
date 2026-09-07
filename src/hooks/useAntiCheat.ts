import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAntiCheat = (teamId: string | null) => {
  useEffect(() => {
    if (!teamId) return;

    const logViolation = async (type: string, metadata: object = {}) => {
      try {
        await supabase.from('violations').insert({
          team_id: teamId,
          type,
          metadata,
        });
      } catch (err) {
        console.error('Failed to log violation:', err);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logViolation('TAB_SWITCH');
      }
    };

    const onBlur = () => {
      logViolation('WINDOW_BLUR');
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const isBlockedCombo =
        (e.ctrlKey && ['c', 'v', 'u', 's'].includes(e.key.toLowerCase())) ||
        e.key === 'F12';

      if (isBlockedCombo) {
        e.preventDefault();
        const type =
          e.ctrlKey && e.key.toLowerCase() === 'c'
            ? 'COPY_ATTEMPT'
            : e.ctrlKey && e.key.toLowerCase() === 'v'
            ? 'PASTE_ATTEMPT'
            : 'WINDOW_BLUR';
        logViolation(type, { key: e.key });
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [teamId]);
};