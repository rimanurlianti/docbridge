import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Input, Typography, useThemeColor } from 'heroui-native';
import { Search } from 'lucide-react-native';
import {
  Choices,
  DemoNote,
  ExternalButton,
  Heading,
  PracticeRow,
  UrgentLink,
} from '@/components/CareUI';
import { practices, resources, specialties, districts } from '@/lib/hamburg';
import { useCare } from '@/lib/care-context';
export default function Find() {
  const { preferences, setPreferences } = useCare();
  const params = useLocalSearchParams<{ specialty?: string; insurance?: string }>();
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState<string>(() =>
    params.specialty && specialties.some((s) => s === params.specialty)
      ? params.specialty
      : 'All care',
  );
  const [insurance, setInsurance] = useState<string>(() =>
    params.insurance === 'Statutory' || params.insurance === 'Private'
      ? params.insurance
      : 'Any insurance',
  );
  const [english, setEnglish] = useState(false);
  const [newPatients, setNewPatients] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const color = useThemeColor('muted');
  const [previousParams, setPreviousParams] = useState({
    specialty: params.specialty,
    insurance: params.insurance,
  });
  if (
    previousParams.specialty !== params.specialty ||
    previousParams.insurance !== params.insurance
  ) {
    setPreviousParams({ specialty: params.specialty, insurance: params.insurance });
    if (params.specialty && specialties.some((s) => s === params.specialty))
      setSpecialty(params.specialty);
    if (params.insurance === 'Statutory' || params.insurance === 'Private')
      setInsurance(params.insurance);
  }
  const list = practices.filter(
    (p) =>
      (specialty === 'All care' || p.specialty === specialty) &&
      (preferences.district === 'All Hamburg' || p.district === preferences.district) &&
      (insurance === 'Any insurance' || p.insurance === insurance) &&
      (!english || p.english === true) &&
      (!newPatients || p.newPatients === 'Yes') &&
      `${p.name} ${p.specialty} ${p.district}`.toLowerCase().includes(query.toLowerCase()),
  );
  function reset() {
    setQuery('');
    setSpecialty('All care');
    setInsurance('Any insurance');
    setEnglish(false);
    setNewPatients(false);
    setPreferences({ district: 'All Hamburg' });
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-background flex-1"
    >
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={list}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PracticeRow practice={item} />}
        contentContainerStyle={{
          padding: 22,
          paddingBottom: 35,
          maxWidth: 680,
          width: '100%',
          alignSelf: 'center',
        }}
        ListHeaderComponent={
          <View className="pt-safe-or-4 gap-5">
            <Heading>Find care in Hamburg</Heading>
            <Input
              accessibilityLabel="Search demo practices"
              value={query}
              onChangeText={setQuery}
              placeholder="Search specialty or neighbourhood"
            />
            <View className="flex-row items-center justify-between">
              <Typography weight="semibold">Filter practices</Typography>
              <Button size="sm" variant="tertiary" onPress={() => setFiltersOpen(!filtersOpen)}>
                <Button.Label>{filtersOpen ? 'Less' : 'More filters'}</Button.Label>
              </Button>
            </View>
            <Choices
              options={['All care', ...specialties]}
              value={specialty}
              onChange={setSpecialty}
            />
            {filtersOpen && (
              <View className="gap-4">
                <Typography weight="semibold">Neighbourhood</Typography>
                <Choices
                  options={districts}
                  value={preferences.district}
                  onChange={(district) => setPreferences({ district })}
                />
                <Typography weight="semibold">Insurance</Typography>
                <Choices
                  options={['Any insurance', 'Statutory', 'Private']}
                  value={insurance}
                  onChange={setInsurance}
                />
                <Choices
                  options={['Any language', 'English spoken']}
                  value={english ? 'English spoken' : 'Any language'}
                  onChange={(v) => setEnglish(v === 'English spoken')}
                />
                <Choices
                  options={['Any patient status', 'New patients']}
                  value={newPatients ? 'New patients' : 'Any patient status'}
                  onChange={(v) => setNewPatients(v === 'New patients')}
                />
              </View>
            )}
            <DemoNote />
            <Typography type="body-sm" color="muted">
              {list.length} demo {list.length === 1 ? 'practice' : 'practices'}
              {preferences.district !== 'All Hamburg' ? ` · ${preferences.district}` : ''}
            </Typography>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center gap-4 py-10">
            <Search size={32} color={color} />
            <Typography>No demo practices match these filters.</Typography>
            <Button variant="secondary" onPress={reset}>
              <Button.Label>Clear filters</Button.Label>
            </Button>
          </View>
        }
        ListFooterComponent={
          <View className="mt-6 gap-4">
            <ExternalButton label="Search real Hamburg practices" url={resources.directory} />
            <UrgentLink />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}
