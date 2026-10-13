import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Insurance, Specialty } from './hamburg';
export type PlanStatus = 'Saved' | 'Script ready' | 'Awaiting reply';
export type PlanItem = { practiceId: string; status: PlanStatus };
type Preferences = {
  insurance: Insurance;
  district: string;
  specialty: Specialty;
  referral: 'No' | 'Yes' | 'With code';
  reason: string;
};
type CareContextType = {
  preferences: Preferences;
  setPreferences: (patch: Partial<Preferences>) => void;
  plan: PlanItem[];
  loading: boolean;
  pending: boolean;
  error: string;
  retry: () => void;
  updatePlan: (id: string, status: PlanStatus | null) => Promise<boolean>;
};
const CareContext = createContext<CareContextType | null>(null);
const storageKey = 'hafen-care-plan-v1';
function isPlanItem(value: unknown): value is PlanItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'practiceId' in value &&
    typeof value.practiceId === 'string' &&
    'status' in value &&
    (value.status === 'Saved' ||
      value.status === 'Script ready' ||
      value.status === 'Awaiting reply')
  );
}
export function CareProvider({ children }: { children: ReactNode }) {
  const [preferences, setPrefs] = useState<Preferences>({
    insurance: 'Statutory',
    district: 'All Hamburg',
    specialty: 'GP',
    referral: 'No',
    reason: '',
  });
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const latestAttempt = useRef(0);
  useEffect(() => {
    let active = true;
    const isCurrent = () => active && attempt === latestAttempt.current;
    AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (isCurrent()) {
          const storedPlan: unknown = value ? JSON.parse(value) : [];
          if (!Array.isArray(storedPlan) || !storedPlan.every(isPlanItem)) {
            throw new Error('Invalid stored care plan');
          }
          setPlan(storedPlan);
          setError('');
        }
      })
      .catch(() => {
        if (isCurrent()) {
          setError('Your plan could not be opened. Please try again.');
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      })
      .finally(() => {
        if (isCurrent()) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  const retry = useCallback(() => {
    setLoading(true);
    latestAttempt.current += 1;
    setAttempt(latestAttempt.current);
  }, []);
  const setPreferences = useCallback((patch: Partial<Preferences>) => {
    setPrefs((prev) => ({ ...prev, ...patch }));
  }, []);
  const updatePlan = useCallback(
    async (id: string, status: PlanStatus | null) => {
      if (pending || loading) return false;
      setPending(true);
      const next = plan.filter((item) => item.practiceId !== id);
      if (status) next.push({ practiceId: id, status });
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(next));
        setPlan(next);
        setError('');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      } catch {
        setError('Your change could not be saved. Please try again.');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return false;
      } finally {
        setPending(false);
      }
    },
    [pending, loading, plan],
  );
  const value = useMemo(
    () => ({ preferences, setPreferences, plan, loading, pending, error, retry, updatePlan }),
    [preferences, setPreferences, plan, loading, pending, error, retry, updatePlan],
  );
  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}
export function useCare() {
  const context = useContext(CareContext);
  if (!context) throw new Error('CareProvider is required');
  return context;
}
