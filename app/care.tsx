import { useState } from 'react';
import { View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { router } from 'expo-router';
import {
  Choices,
  ExternalButton,
  Heading,
  Screen,
  SectionTitle,
  UrgentLink,
} from '@/components/CareUI';
import { useCare } from '@/lib/care-context';
import { districts, referralGuidance, resources, specialties } from '@/lib/hamburg';
export default function Care() {
  const { preferences, setPreferences } = useCare();
  const [intent, setIntent] = useState('Not sure where to start');
  const [showRoute, setShowRoute] = useState(false);
  const specialty = intent === 'Not sure where to start' ? 'GP' : preferences.specialty;
  return (
    <Screen>
      <Heading>Let’s find your route.</Heading>
      <Typography color="muted">
        Navigation, not a diagnosis. A clinician decides what care you need.
      </Typography>
      <UrgentLink />
      <View className="gap-3">
        <SectionTitle>Where in Hamburg?</SectionTitle>
        <Choices
          options={districts}
          value={preferences.district}
          onChange={(district) => {
            setPreferences({ district });
            setShowRoute(false);
          }}
        />
      </View>
      <View className="gap-3">
        <SectionTitle>Your insurance</SectionTitle>
        <Choices
          options={['Statutory', 'Private', 'Unknown'] as const}
          value={preferences.insurance}
          onChange={(insurance) => {
            setPreferences({ insurance });
            setShowRoute(false);
          }}
        />
      </View>
      <View className="gap-3">
        <SectionTitle>What do you need?</SectionTitle>
        <Choices
          options={['Not sure where to start', 'I know my specialty']}
          value={intent}
          onChange={(v) => {
            setIntent(v);
            setShowRoute(false);
          }}
        />
        {intent === 'I know my specialty' && (
          <Choices
            options={specialties}
            value={preferences.specialty}
            onChange={(selectedSpecialty) => {
              setPreferences({ specialty: selectedSpecialty });
              setShowRoute(false);
            }}
          />
        )}
      </View>
      <View className="gap-3">
        <SectionTitle>Do you have a referral?</SectionTitle>
        <Choices
          options={['No', 'Yes', 'With code'] as const}
          value={preferences.referral}
          onChange={(referral) => {
            setPreferences({ referral });
            setShowRoute(false);
          }}
        />
      </View>
      <Button
        onPress={() => {
          setPreferences({ specialty });
          setShowRoute(true);
        }}
      >
        <Button.Label>Show my next step</Button.Label>
      </Button>
      {showRoute && (
        <View className="bg-surface gap-4 rounded-2xl p-5">
          <SectionTitle>
            {specialty === 'GP'
              ? 'Start with a general practitioner'
              : `Contact a ${specialty === 'ENT' ? 'HNO / ENT' : specialty.toLowerCase()} practice`}
          </SectionTitle>
          {specialty === 'GP' && (
            <Typography>
              A Hausarzt can assess your concern and refer you to a specialist if needed.
            </Typography>
          )}
          <Typography color="muted">{referralGuidance(specialty)}</Typography>
          {preferences.referral === 'Yes' && (
            <Typography>
              A referral is not the same as an appointment code. Check whether it includes a
              Vermittlungscode.
            </Typography>
          )}
          {preferences.insurance !== 'Statutory' && (
            <Typography>
              116117 appointment booking is for statutory insurance. If private or unsure, ask the
              practice or insurer about coverage before booking.
            </Typography>
          )}
          <Button
            onPress={() =>
              router.push({
                pathname: '/find',
                params: { specialty, insurance: preferences.insurance },
              })
            }
          >
            <Button.Label>Explore demo practices</Button.Label>
          </Button>
          <ExternalButton label="Check Hamburg referral rules" url={resources.referral} />
          {preferences.insurance === 'Statutory' && (
            <ExternalButton label="Open 116117 appointment service" url={resources.appointments} />
          )}
        </View>
      )}
    </Screen>
  );
}
