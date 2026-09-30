import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'src/components/snackbar';

import { lmsFlashClear } from './modules/lms';
import { authFlashClear } from './modules/auth';
import { selectLmsFlash } from './selectors/lms.selectors';
import { selectAuthFlash } from './selectors/auth.selectors';

/**
 * Shows Sonner toasts from Redux `flash` state and clears after display.
 */
export function ReduxFlashBridge() {
  const dispatch = useDispatch();
  const lmsFlash = useSelector(selectLmsFlash);
  const authFlash = useSelector(selectAuthFlash);

  useEffect(() => {
    if (!lmsFlash?.message) {
      return;
    }
    if (lmsFlash.severity === 'success') {
      toast.success(lmsFlash.message);
    } else {
      toast.error(lmsFlash.message);
    }
    dispatch(lmsFlashClear());
  }, [lmsFlash, dispatch]);

  useEffect(() => {
    if (!authFlash?.message) {
      return;
    }
    if (authFlash.severity === 'success') {
      toast.success(authFlash.message);
    } else {
      toast.error(authFlash.message);
    }
    dispatch(authFlashClear());
  }, [authFlash, dispatch]);

  return null;
}
