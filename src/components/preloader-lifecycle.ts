type LoadingLifecycleOptions = {
  onDismiss: () => void;
  reducedMotion: boolean;
  minDurationMs?: number;
  maxWaitMs?: number;
};

export function createLoadingLifecycle({
  onDismiss,
  reducedMotion,
  minDurationMs = 1200,
  maxWaitMs = 8000,
}: LoadingLifecycleOptions) {
  const startedAt = Date.now();
  let isReady = false;
  let dismissed = false;
  let disposed = false;
  let minimumTimer: ReturnType<typeof setTimeout> | undefined;
  let maximumTimer: ReturnType<typeof setTimeout> | undefined;

  function clearTimers() {
    clearTimeout(minimumTimer);
    clearTimeout(maximumTimer);
    minimumTimer = undefined;
    maximumTimer = undefined;
  }

  function dismiss() {
    if (disposed || dismissed) return;
    dismissed = true;
    clearTimers();
    onDismiss();
  }

  function dismissWhenReady() {
    if (!isReady || disposed || dismissed) return;
    const remaining = minDurationMs - (Date.now() - startedAt);
    if (reducedMotion || remaining <= 0) {
      dismiss();
    } else if (minimumTimer === undefined) {
      minimumTimer = setTimeout(dismiss, remaining);
    }
  }

  maximumTimer = setTimeout(dismiss, maxWaitMs);

  return {
    ready() {
      isReady = true;
      dismissWhenReady();
    },
    setReducedMotion(reduced: boolean) {
      reducedMotion = reduced;
      dismissWhenReady();
    },
    dispose() {
      disposed = true;
      clearTimers();
    },
  };
}
