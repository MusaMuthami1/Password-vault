import zxcvbn from 'zxcvbn';

export function passwordStrength(password) {
  const result = zxcvbn(password);
  return {
    score: result.score,
    feedback: result.feedback,
    crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second
  };
}
