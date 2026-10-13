import { View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { ExternalButton, Heading, openResource, Screen, SectionTitle } from '@/components/CareUI';
import { resources } from '@/lib/hamburg';
export default function Help() {
  return (
    <Screen>
      <Heading>Urgent medical help</Heading>
      <View className="bg-surface gap-4 rounded-2xl p-5">
        <SectionTitle>Life-threatening emergency</SectionTitle>
        <Typography>
          If someone’s life is at risk or there is a risk of permanent injury, call 112. Do not wait
          for an appointment.
        </Typography>
        <Button variant="danger" onPress={() => void openResource('tel:112')}>
          <Button.Label>Call 112</Button.Label>
        </Button>
      </View>
      <View className="gap-4">
        <SectionTitle>Cannot wait until practices reopen?</SectionTitle>
        <Typography>
          If you need medical help today, practices are closed and it is not life-threatening,
          contact the medical on-call service on 116117.
        </Typography>
        <Typography color="muted">
          The telephone service is in German. A German-speaking person may help with the call.
        </Typography>
        <Button onPress={() => void openResource('tel:116117')}>
          <Button.Label>Call 116117</Button.Label>
        </Button>
        <ExternalButton label="Find an on-call practice" url={resources.onCall} />
      </View>
      <View className="gap-4">
        <SectionTitle>Need a regular appointment?</SectionTitle>
        <Typography>
          During opening hours, contact a practice. Statutory-insured patients can also use the
          116117 appointment service; some specialist bookings require a referral code.
        </Typography>
        <ExternalButton label="116117 appointment service" url={resources.appointments} />
      </View>
      <Typography type="body-sm" color="muted">
        Sources: 116117 English patient guidance and KV Hamburg appointment-service rules.
      </Typography>
      <ExternalButton label="Read official guidance in English" url={resources.english} />
      <ExternalButton label="Read Hamburg booking rules" url={resources.referral} />
    </Screen>
  );
}
