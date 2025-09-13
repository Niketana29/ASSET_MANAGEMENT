import React from 'react';
import { getPasswordStrength } from '../utils/constants';

const PasswordStrengthBar = ({ password, showDetails = false }) => {
  const strength = getPasswordStrength(password || '');

  const getStrengthColor = (score) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score) => {
    if (score < 2) return { text: 'Weak', color: 'text-red-600' };
    if (score < 4) return { text: 'Medium', color: 'text-yellow-600' };
    return { text: 'Strong', color: 'text-green-600' };
  };

  if (!password) return null;

  const strengthInfo = getStrengthText(strength.score);

  return (
    <div className="mt-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full ${level <= strength.score
                ? getStrengthColor(strength.score)
                : 'bg-gray-200'
              } transition-colors duration-200`}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className={`text-sm font-medium ${strengthInfo.color}`}>
          Password strength: {strengthInfo.text}
        </span>
        <span className="text-xs text-gray-500">
          {strength.score}/5
        </span>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-gray-600 font-medium">Requirements:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
            <div className={`flex items-center space-x-2 ${strength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{strength.checks.length ? '✓' : '○'}</span>
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center space-x-2 ${strength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{strength.checks.lowercase ? '✓' : '○'}</span>
              <span>Lowercase letter</span>
            </div>
            <div className={`flex items-center space-x-2 ${strength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{strength.checks.uppercase ? '✓' : '○'}</span>
              <span>Uppercase letter</span>
            </div>
            <div className={`flex items-center space-x-2 ${strength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{strength.checks.number ? '✓' : '○'}</span>
              <span>Number</span>
            </div>
            <div className={`flex items-center space-x-2 ${strength.checks.special ? 'text-green-600' : 'text-gray-400'} sm:col-span-2`}>
              <span>{strength.checks.special ? '✓' : '○'}</span>
              <span>Special character (@$!%*?&)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthBar;