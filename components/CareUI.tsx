import type { ReactNode } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, View } from 'react-native';
import { Button, PressableFeedback, Typography, useThemeColor } from 'heroui-native';
import { ArrowUpRight, ChevronRight, LifeBuoy, MapPin } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import { goBackOrReplace } from '@/lib/navigation';
import * as Haptics from 'expo-haptics';
import type { Practice } from '@/lib/hamburg';
import { useCare } from '@/lib/care-context';
export function Screen({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const directOpen = !['/', '/find', '/plan'].includes(pathname) && !router.canGoBack();
  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 22,
          paddingBottom: 40,
          gap: 24,
          width: '100%',
          maxWidth: 680,
          alignSelf: 'center',
        }}
      >
        {directOpen && (
          <Button variant="tertiary" onPress={() => goBackOrReplace('/')}>
            <Button.Label>Return to navigator</Button.Label>
          </Button>
        )}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Heading({ children }: { children: ReactNode }) {
  return (
    <Typography.Heading
      type="h2"
      style={{ fontFamily: 'Inter_700Bold', fontSize: 30, lineHeight: 36 }}
    >
      {children}
    </Typography.Heading>
  );
}
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography.Heading type="h4" style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20 }}>
      {children}
    </Typography.Heading>
  );
}
export function Choices<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={value === option ? 'primary' : 'secondary'}
          onPress={() => {
            if (option !== value) {
              void Haptics.selectionAsync();
              onChange(option);
            }
          }}
          accessibilityState={{ selected: option === value }}
        >
          <Button.Label numberOfLines={1}>{option}</Button.Label>
        </Button>
      ))}
    </View>
  );
}
export function DemoNote() {
  return (
    <View className="bg-default rounded-xl border-l-0 px-4 py-3">
      <Typography type="body-sm" color="muted">
        Demo practices · Fictional details, no live availability or bookings.
      </Typography>
    </View>
  );
}
export function UrgentLink() {
  const color = useThemeColor('muted');
  return (
    <PressableFeedback
      onPress={() => router.push('/help')}
      className="flex-row items-center justify-between gap-3 py-2"
      accessibilityRole="button"
    >
      <View className="flex-row items-center gap-2">
        <LifeBuoy size={18} color={color} />
        <Typography type="body-sm" color="muted">
          Need urgent medical help?
        </Typography>
      </View>
      <ChevronRight color={color} size={18} />
    </PressableFeedback>
  );
}
export async function openResource(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert(
      'Could not open this link',
      'Please try again, or open the official service in your browser.',
    );
  }
}
export function ExternalButton({ label, url }: { label: string; url: string }) {
  const color = useThemeColor('foreground');
  return (
    <Button variant="secondary" onPress={() => void openResource(url)}>
      <Button.Label className="flex-shrink">{label}</Button.Label>
      <ArrowUpRight size={18} color={color} />
    </Button>
  );
}
export function PracticeRow({ practice }: { practice: Practice }) {
  const [color, accent] = useThemeColor(['muted', 'accent']);
  return (
    <PressableFeedback
      onPress={() => router.push({ pathname: '/practice/[id]', params: { id: practice.id } })}
      className="border-border border-b py-5"
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-2">
          <Typography type="body-sm" style={{ color: accent }} weight="semibold">
            {practice.specialty === 'GP' ? 'General practitioner' : practice.specialty}
          </Typography>
          <Typography
            type="h4"
            style={{ fontFamily: 'Inter_600SemiBold', fontSize: 19, lineHeight: 25 }}
          >
            {practice.name}
          </Typography>
          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color={color} />
            <Typography type="body-sm" color="muted">
              {practice.district} · {practice.nearby}
            </Typography>
          </View>
        </View>
        <ChevronRight size={20} color={accent} />
      </View>
      <View className="mt-3 flex-row flex-wrap gap-x-3 gap-y-1">
        <Typography type="body-sm">
          {practice.insurance === 'Unknown'
            ? 'Insurance unverified'
            : `${practice.insurance} insurance`}
        </Typography>
        <Typography type="body-sm" color="muted">
          {practice.english ? 'English spoken' : 'English unverified'}
        </Typography>
      </View>
      <Typography type="body-sm" color="muted" className="mt-1">
        {practice.newPatients === 'Yes'
          ? 'Accepting new patients'
          : practice.newPatients === 'No'
            ? 'Not accepting new patients'
            : 'New patients: ask practice'}
      </Typography>
    </PressableFeedback>
  );
}
export function StorageError() {
  const { error, retry } = useCare();
  if (!error) return null;
  return (
    <View className="bg-default gap-3 rounded-xl p-4">
      <Typography>{error}</Typography>
      <Button size="sm" variant="secondary" onPress={retry}>
        <Button.Label>Try again</Button.Label>
      </Button>
    </View>
  );
}
