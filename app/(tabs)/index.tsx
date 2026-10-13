import { View } from 'react-native';
import { Button, PressableFeedback, Typography, useThemeColor } from 'heroui-native';
import { router } from 'expo-router';
import { ArrowRight, Anchor, MapPin, MessageSquare, ChevronRight } from 'lucide-react-native';
import { Screen, SectionTitle, UrgentLink, ExternalButton } from '@/components/CareUI';
import { resources } from '@/lib/hamburg';
import { careColors } from '@/lib/theme';
import { useCare } from '@/lib/care-context';
export default function Home() {
  const [foreground, muted, accent] = useThemeColor(['foreground', 'muted', 'accent']);
  const { plan } = useCare();
  return (
    <Screen>
      <View className="pt-safe-or-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Anchor size={24} strokeWidth={1.8} color={accent} />
          <Typography style={{ fontFamily: 'Inter_700Bold', fontSize: 23 }}>hafen</Typography>
        </View>
        <View className="flex-row items-center gap-1">
          <MapPin size={14} color={muted} />
          <Typography type="body-sm" color="muted">
            Hamburg · EN / DE
          </Typography>
        </View>
      </View>
      <View className="bg-harbor gap-5 rounded-[28px] p-6">
        <Typography.Heading
          type="h1"
          className="text-harbor-foreground"
          style={{
            color: careColors.harborForeground,
            fontFamily: 'Inter_700Bold',
            fontSize: 37,
            lineHeight: 43,
          }}
        >
          Your next stop:{'\n'}the right care.
        </Typography.Heading>
        <Typography style={{ color: careColors.harborMuted, lineHeight: 24 }}>
          Find your way to a doctor in Hamburg, even if German isn’t your language.
        </Typography>
        <View className="flex-row items-center py-3">
          <View className="bg-signal h-3 w-3 rounded-full" />
          <View className="bg-signal h-0.5 flex-1" />
          <View className="border-signal bg-harbor h-3 w-3 rounded-full border-2" />
          <View className="bg-signal h-0.5 flex-1" />
          <View className="border-signal bg-harbor h-3 w-3 rounded-full border-2" />
        </View>
        <View className="-mt-5 flex-row justify-between gap-2">
          {['Your route', 'Your doctor', 'Your script'].map((label) => (
            <Typography
              key={label}
              type="body-sm"
              style={{ color: careColors.harborMuted, fontSize: 12 }}
              numberOfLines={1}
            >
              {label}
            </Typography>
          ))}
        </View>
        <Button style={{ backgroundColor: careColors.signal }} onPress={() => router.push('/care')}>
          <Button.Label style={{ color: careColors.signalForeground }}>
            Find my care route
          </Button.Label>
          <ArrowRight size={19} color={foreground} />
        </Button>
      </View>
      <View className="gap-3">
        <SectionTitle>A little help goes a long way</SectionTitle>
        <PressableFeedback
          onPress={() => router.push('/prepare')}
          className="bg-surface flex-row items-center gap-4 rounded-2xl p-5"
        >
          <MessageSquare color={accent} size={25} strokeWidth={1.8} />
          <View className="flex-1 gap-1">
            <Typography weight="semibold">Know what to say</Typography>
            <Typography type="body-sm" color="muted">
              Your English–German booking script
            </Typography>
          </View>
          <ChevronRight size={20} color={muted} />
        </PressableFeedback>
      </View>
      {plan.length > 0 && (
        <Button variant="secondary" onPress={() => router.push('/plan')}>
          <Button.Label>
            Continue my plan · {plan.length} {plan.length === 1 ? 'practice' : 'practices'}
          </Button.Label>
        </Button>
      )}
      <View className="gap-3">
        <SectionTitle>Real care, official sources</SectionTitle>
        <ExternalButton label="Hamburg doctor directory" url={resources.directory} />
        <Typography type="body-sm" color="muted">
          Explore the demo here. Contact real practices through the official directory.
        </Typography>
      </View>
      <UrgentLink />
    </Screen>
  );
}
