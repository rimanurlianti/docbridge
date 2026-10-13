import { View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  DemoNote,
  ExternalButton,
  Heading,
  Screen,
  SectionTitle,
  StorageError,
  UrgentLink,
} from '@/components/CareUI';
import { getPractice, referralGuidance, resources } from '@/lib/hamburg';
import { useCare } from '@/lib/care-context';
export default function PracticeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const practice = getPractice(id);
  const { plan, pending, loading, updatePlan } = useCare();
  if (!practice)
    return (
      <Screen>
        <Heading>Practice not found</Heading>
        <Button onPress={() => router.replace('/find')}>
          <Button.Label>Find care</Button.Label>
        </Button>
      </Screen>
    );
  const saved = plan.some((p) => p.practiceId === id);
  const facts = [
    ['Specialty', `${practice.specialty} · ${practice.german}`],
    ['Neighbourhood', `${practice.district} · near ${practice.nearby}`],
    [
      'Insurance',
      practice.insurance === 'Unknown'
        ? 'Unknown — ask before booking'
        : `${practice.insurance} (sample)`,
    ],
    [
      'New patients',
      practice.newPatients === 'Unknown'
        ? 'Unknown — ask the practice'
        : practice.newPatients === 'Yes'
          ? 'Accepting (sample)'
          : 'Not accepting (sample)',
    ],
    ['English', practice.english ? 'Spoken (sample)' : 'Not verified'],
    ['Source & verification', 'Fictional demo dataset · not verified'],
  ];
  return (
    <Screen>
      <DemoNote />
      <Heading>{practice.name}</Heading>
      <View>
        {facts.map(([label, value]) => (
          <View key={label} className="border-border gap-1 border-b py-4">
            <Typography type="body-sm" color="muted">
              {label}
            </Typography>
            <Typography weight="medium">{value}</Typography>
          </View>
        ))}
      </View>
      <StorageError />
      <Button
        variant={saved ? 'secondary' : 'primary'}
        isDisabled={pending || loading}
        onPress={() => void updatePlan(id, saved ? null : 'Saved')}
      >
        <Button.Label>
          {pending ? 'Saving…' : saved ? 'Remove from my plan' : 'Save to my plan'}
        </Button.Label>
      </Button>
      <View className="gap-3">
        <SectionTitle>Before you book</SectionTitle>
        <Typography color="muted">{referralGuidance(practice.specialty)}</Typography>
        <Typography color="muted">
          Confirm insurance coverage, new-patient availability and language with the real practice.
          No appointment slots are shown here.
        </Typography>
        <Button onPress={() => router.push({ pathname: '/prepare', params: { id } })}>
          <Button.Label>Prepare my booking script</Button.Label>
        </Button>
      </View>
      <ExternalButton label="Find a real practice in Hamburg" url={resources.directory} />
      <UrgentLink />
    </Screen>
  );
}
