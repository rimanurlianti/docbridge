import { View } from 'react-native';
import { Button, Skeleton, Typography, useThemeColor } from 'heroui-native';
import { Bookmark, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { DemoNote, ExternalButton, Heading, Screen, StorageError } from '@/components/CareUI';
import { getPractice, resources } from '@/lib/hamburg';
import { useCare } from '@/lib/care-context';
export default function Plan() {
  const { plan, pending, loading, updatePlan } = useCare();
  const color = useThemeColor('muted');
  return (
    <Screen>
      <View className="pt-safe-or-4">
        <Heading>My care plan</Heading>
      </View>
      <DemoNote />
      <StorageError />
      {loading ? (
        <View className="gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </View>
      ) : plan.length === 0 ? (
        <View className="items-center gap-5 py-12">
          <Bookmark size={40} strokeWidth={1.5} color={color} />
          <Typography align="center">
            Saved practices and booking steps will appear here.
          </Typography>
          <Button onPress={() => router.push('/find')}>
            <Button.Label>Find your first practice</Button.Label>
          </Button>
        </View>
      ) : (
        plan.map((item) => {
          const practice = getPractice(item.practiceId);
          if (!practice) return null;
          return (
            <Animated.View
              key={item.practiceId}
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(120)}
              className="bg-surface gap-4 rounded-2xl p-5"
            >
              <View className="flex-row items-center gap-2">
                <Check size={16} color={color} />
                <Typography type="body-sm" color="muted">
                  {item.status} · Demo
                </Typography>
              </View>
              <Typography type="h4" style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20 }}>
                {practice.name}
              </Typography>
              <Typography type="body-sm" color="muted">
                {practice.specialty} · {practice.district}
              </Typography>
              <Button
                variant="secondary"
                onPress={() => router.push({ pathname: '/prepare', params: { id: practice.id } })}
              >
                <Button.Label>Open booking script</Button.Label>
              </Button>
              {item.status !== 'Awaiting reply' && (
                <Button
                  variant="secondary"
                  isDisabled={pending}
                  onPress={() => void updatePlan(practice.id, 'Awaiting reply')}
                >
                  <Button.Label>
                    {pending ? 'Saving…' : 'Simulate appointment request'}
                  </Button.Label>
                </Button>
              )}
              {item.status === 'Awaiting reply' && (
                <Typography type="body-sm" color="muted">
                  Demo request only. No practice has been contacted and no appointment is confirmed.
                </Typography>
              )}
              <Button
                size="sm"
                variant="tertiary"
                isDisabled={pending}
                onPress={() => void updatePlan(practice.id, null)}
              >
                <Button.Label>Remove</Button.Label>
              </Button>
            </Animated.View>
          );
        })
      )}
      <Typography type="body-sm" color="muted">
        Your plan stays on this device. Only the practice can confirm an appointment.
      </Typography>
      <ExternalButton
        label="Book through the official 116117 service"
        url={resources.appointments}
      />
    </Screen>
  );
}
