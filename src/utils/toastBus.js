let notifier = null;

export const setToastNotifier = (fn) => {
  notifier = fn;
};

export const toastNotify = (type = 'info', message = '', duration = 3000) => {
  if (typeof notifier === 'function') {
    notifier({ type, message, duration });
  }
};

export default {
  setToastNotifier,
  toastNotify,
};
