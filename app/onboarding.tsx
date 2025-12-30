
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { updateDreamMap, completeOnboarding, getUserData } from '@/utils/storage';
import { DreamMapArea } from '@/types/life5s';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [dreamAreas, setDreamAreas] = useState<DreamMapArea[]>([
    { id: '1', name: 'Tự do thời gian/tài chính', icon: 'attach-money', selected: false },
    { id: '2', name: 'Sức khỏe', icon: 'favorite', selected: false },
    { id: '3', name: 'Gia đình', icon: 'people', selected: false },
    { id: '4', name: 'Phát triển bản thân', icon: 'school', selected: false },
    { id: '5', name: 'Trải nghiệm', icon: 'explore', selected: false },
  ]);

  const toggleArea = (id: string) => {
    setDreamAreas(prev => 
      prev.map(area => 
        area.id === id ? { ...area, selected: !area.selected } : area
      )
    );
  };

  const handleComplete = async () => {
    try {
      await updateDreamMap(dreamAreas);
      await completeOnboarding();
      router.replace('/(tabs)/(home)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const selectedCount = dreamAreas.filter(a => a.selected).length;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="map.fill" 
            android_material_icon_name="map" 
            size={60} 
            color={colors.primary} 
          />
          <Text style={styles.title}>Bản đồ ước mơ</Text>
          <Text style={styles.subtitle}>
            Bạn muốn sống thế nào? Điều gì quan trọng với bạn trong dài hạn?
          </Text>
          <Text style={styles.instruction}>
            Chọn những lĩnh vực quan trọng nhất với bạn (có thể chọn nhiều)
          </Text>
        </View>

        <View style={styles.areasContainer}>
          {dreamAreas.map((area, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.areaCard,
                  area.selected && styles.areaCardSelected
                ]}
                onPress={() => toggleArea(area.id)}
              >
                <View style={styles.areaContent}>
                  <IconSymbol 
                    ios_icon_name={area.icon} 
                    android_material_icon_name={area.icon as any}
                    size={40} 
                    color={area.selected ? '#ffffff' : colors.primary} 
                  />
                  <Text style={[
                    styles.areaText,
                    area.selected && styles.areaTextSelected
                  ]}>
                    {area.name}
                  </Text>
                </View>
                {area.selected && (
                  <View style={styles.checkmark}>
                    <IconSymbol 
                      ios_icon_name="checkmark.circle.fill" 
                      android_material_icon_name="check-circle"
                      size={24} 
                      color="#ffffff" 
                    />
                  </View>
                )}
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="lightbulb.fill" 
            android_material_icon_name="lightbulb"
            size={24} 
            color={colors.accent} 
          />
          <Text style={styles.infoText}>
            Bản đồ này sẽ là la bàn cho mọi quyết định của bạn. Mọi gợi ý từ app sẽ đối chiếu với những gì bạn chọn ở đây.
          </Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.completeButton,
            selectedCount === 0 && styles.completeButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={selectedCount === 0}
        >
          <Text style={styles.completeButtonText}>
            {selectedCount === 0 ? 'Chọn ít nhất 1 lĩnh vực' : `Hoàn thành (${selectedCount} đã chọn)`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  instruction: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  areasContainer: {
    gap: 12,
    marginBottom: 24,
  },
  areaCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  areaCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  areaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 16,
    flex: 1,
  },
  areaTextSelected: {
    color: '#ffffff',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  infoBox: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(100, 181, 246, 0.3)',
    elevation: 4,
  },
  completeButtonDisabled: {
    backgroundColor: colors.border,
    boxShadow: 'none',
    elevation: 0,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
