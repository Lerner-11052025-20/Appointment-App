import { getPasswordStrength } from '../../utils/validators';
import { PASSWORD_RULES } from '../../utils/constants';

export default function PasswordStrengthMeter({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="space-y-2 mt-1.5">
      {}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="strength-bar h-full"
              style={{
                width: i <= score ? '100%' : '0%',
                background: color,
              }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ color }}>{label}</p>

      {}
      <div className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <div key={rule.label} className="flex items-center gap-2">
              <span className={`text-xs ${passed ? 'text-emerald-500' : 'text-slate-300'}`}>
                {passed ? '✓' : '○'}
              </span>
              <span className={`text-xs ${passed ? 'text-slate-600' : 'text-slate-400'}`}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}