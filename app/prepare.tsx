import { useState } from 'react';
import { Share, View } from 'react-native';
import { Button, Input, Label, TextField, Typography, useThemeColor } from 'heroui-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Choices,
  DemoNote,
  ExternalButton,
  Heading,
  Screen,
  SectionTitle,
  StorageError,
  UrgentLink,
} from '@/components/CareUI';
import { useCare } from '@/lib/care-context';
import { getPractice, resources } from '@/lib/hamburg';
export default function Prepare() {
  const danger = useThemeColor('danger');
  const { id } = useLocalSearchParams<{ id?: string }>();
  const practice = getPractice(id);
  const { preferences, setPreferences, pending, loading, updatePlan } = useCare();
  const [name, setName] = useState('');
  const [showGerman, setShowGerman] = useState(true);
  const [sharedError, setSharedError] = useState('');
  const [sharing, setSharing] = useState(false);
  const insurance =
    preferences.insurance === 'Statutory'
      ? ['Ich bin gesetzlich versichert.', 'I have statutory health insurance.']
      : preferences.insurance === 'Private'
        ? ['Ich bin privat versichert.', 'I have private health insurance.']
        : [
            'Ich möchte vorab klären, ob meine Versicherung die Behandlung übernimmt.',
            'I would like to check whether my insurance covers this visit.',
          ];
  const phrases = [
    [
      `Guten Tag, mein Name ist ${name.trim() || '[Ihr Name]'}. Ich möchte einen Termin vereinbaren.`,
      `Hello, my name is ${name.trim() || '[your name]'}. I would like to make an appointment.`,
    ],
    insurance,
    ['Nehmen Sie neue Patientinnen und Patienten auf?', 'Are you accepting new patients?'],
    ['Ist ein Termin auf Englisch möglich?', 'Is an appointment in English possible?'],
    [
      'Benötige ich für diesen Termin eine Überweisung?',
      'Do I need a referral for this appointment?',
    ],
    ['Wann ist der nächste freie Termin?', 'When is the next available appointment?'],
    [
      'Könnten Sie bitte langsamer sprechen und Datum und Uhrzeit wiederholen?',
      'Could you speak more slowly and repeat the date and time?',
    ],
    [
      'Könnten Sie mir den Termin schriftlich bestätigen?',
      'Could you confirm the appointment in writing?',
    ],
  ];
  async function shareScript() {
    setSharing(true);
    setSharedError('');
    try {
      await Share.share({
        message:
          phrases.map((p) => `${p[0]}\n${p[1]}`).join('\n\n') +
          (preferences.reason.trim()
            ? `\n\nReason for visit (English): ${preferences.reason.trim()}`
            : ''),
      });
    } catch {
      setSharedError('The script could not be shared. Please try again.');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSharing(false);
    }
  }
  return (
    <Screen>
      <Heading>Know what to say.</Heading>
      {practice && (
        <>
          <DemoNote />
          <Typography weight="medium">Preparing for {practice.name}</Typography>
        </>
      )}
      <View className="gap-4">
        <TextField>
          <Label>Your name (optional)</Label>
          <Input value={name} onChangeText={setName} placeholder="Your name" autoComplete="name" />
        </TextField>
        <TextField>
          <Label>Reason for visit (optional)</Label>
          <Input
            value={preferences.reason}
            onChangeText={(reason) => setPreferences({ reason })}
            placeholder="Briefly, in your own words"
            multiline
            style={{ minHeight: 85, textAlignVertical: 'top' }}
          />
        </TextField>
        <Typography type="body-sm" color="muted">
          Name and visit reason stay in this session. Your reason is not automatically translated;
          share it in English with the practice.
        </Typography>
        <Choices
          options={['Statutory', 'Private', 'Unknown'] as const}
          value={preferences.insurance}
          onChange={(selectedInsurance) => setPreferences({ insurance: selectedInsurance })}
        />
      </View>
      <View className="gap-3">
        <SectionTitle>Your call script</SectionTitle>
        <Choices
          options={['German first', 'English first']}
          value={showGerman ? 'German first' : 'English first'}
          onChange={(v) => setShowGerman(v === 'German first')}
        />
        <View className="bg-surface rounded-2xl px-5">
          {phrases.map(([de, en]) => (
            <View key={en} className="border-border gap-2 border-b py-4">
              <Typography style={{ lineHeight: 24 }} weight="medium" selectable>
                {showGerman ? de : en}
              </Typography>
              <Typography type="body-sm" color="muted" selectable>
                {showGerman ? en : de}
              </Typography>
            </View>
          ))}
        </View>
      </View>
      <View className="gap-3">
        <SectionTitle>If they ask…</SectionTitle>
        <Typography weight="semibold">“Wie sind Sie versichert?”</Typography>
        <Typography color="muted">
          They are asking about your insurance. Have your insurer’s name and health insurance card
          ready.
        </Typography>
        <Typography weight="semibold">“Haben Sie eine Überweisung?”</Typography>
        <Typography color="muted">
          They are asking whether you have a referral. For 116117 specialist booking, also check
          your appointment code.
        </Typography>
      </View>
      {sharedError.length > 0 && <Typography style={{ color: danger }}>{sharedError}</Typography>}
      <Button variant="secondary" isDisabled={sharing} onPress={() => void shareScript()}>
        <Button.Label>{sharing ? 'Sharing…' : 'Share bilingual script'}</Button.Label>
      </Button>
      <StorageError />
      {practice && (
        <Button
          isDisabled={pending || loading}
          onPress={async () => {
            if (await updatePlan(practice.id, 'Script ready')) router.push('/plan');
          }}
        >
          <Button.Label>{pending ? 'Saving…' : 'Add script to my plan'}</Button.Label>
        </Button>
      )}
      <ExternalButton label="Find real practice contact details" url={resources.directory} />
      <UrgentLink />
    </Screen>
  );
}
