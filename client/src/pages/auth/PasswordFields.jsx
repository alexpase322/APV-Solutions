import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Field, inputClass } from '../../components/nfc/ui';

export const PasswordInput = ({ id, value, onChange, autoComplete = 'current-password', ...rest }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`${inputClass} pr-12`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-[#263646]"
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
};

/** New password + confirmation fields (validate with passwordError from lib/nfc). */
export const NewPasswordFields = ({ password, confirm, setPassword, setConfirm }) => (
  <>
    <Field id="new-password" label="New password" hint="At least 8 characters.">
      <PasswordInput
        id="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        required
      />
    </Field>
    <Field id="confirm-password" label="Confirm password">
      <PasswordInput
        id="confirm-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        required
      />
    </Field>
  </>
);
