import { useCallback, useMemo, useState } from 'react';

export function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (typeof rule === 'function') {
      const message = rule(value, values);
      setErrors((prev) => ({ ...prev, [name]: message || undefined }));
      return message;
    }
    return undefined;
  }, [validationRules, values]);

  const handleChange = useCallback((event) => {
    const target = event?.target;
    if (!target) return;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;

    setValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const validateAll = useCallback(() => {
    const currentErrors = {};
    Object.keys(validationRules).forEach((name) => {
      const message = validationRules[name]?.(values[name], values);
      if (message) currentErrors[name] = message;
    });
    setErrors(currentErrors);
    return currentErrors;
  }, [validationRules, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = useCallback((onSubmit) => async (event) => {
    event?.preventDefault?.();
    const currentErrors = validateAll();
    const hasErrors = Object.values(currentErrors).some(Boolean);
    if (hasErrors) return;
    return onSubmit?.(values);
  }, [validateAll, values]);

  return useMemo(() => ({
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    setValues,
    setErrors,
  }), [values, errors, handleChange, handleSubmit, setFieldValue, resetForm]);
}


