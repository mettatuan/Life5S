
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { getUserData, saveUserData } from '@/utils/storage';
import { UserData } from '@/types/life5s';

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getUserData();
    setUserData(data);
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Đặt lại bản đồ ước mơ',
      'Bạn có chắc muốn đặt lại bản đồ ước mơ? Bạn sẽ cần hoàn thành lại quá trình onboarding.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt lại',
          style: 'destructive',
          onPress: async () => {
            if (userData) {
              const newData = { ...userData, hasCompletedOnboarding: false };
              await saveUserData(newData);
              router.replace('/(tabs)/(home)');
            }
          },
        },
      ]
    );
  };

  const totalCheckIns = userData?.dailyCheckIns.length || 0;
  const totalAssessments = userData?.endOfDayAssessments.length || 0;
  const selectedDreams = userData?.dreamMap.filter(d => d.selected).length || 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="person.circle.fill" 
            android_material_icon_name="account-circle"
            size={80} 
            color={colors.primary} 
          />
          <Text style={styles.title}>Hồ sơ của bạn</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="checkmark.seal.fill" 
              android_material_icon_name="verified"
              size={40} 
              color={colors.success} 
            />
            <Text style={styles.statValue}>{totalCheckIns}</Text>
            <Text style={styles.statLabel}>Check-in</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="moon.stars.fill" 
              android_material_icon_name="nightlight"
              size={40} 
              color={colors.accent} 
            />
            <Text style={styles.statValue}>{totalAssessments}</Text>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="map.fill" 
              android_material_icon_name="map"
              size={40} 
              color={colors.secondary} 
            />
            <Text style={styles.statValue}>{selectedDreams}</Text>
            <Text style={styles.statLabel}>Ước mơ</Text>
          </View>
        </View>

        {userData && userData.dreamMap.filter(d => d.selected).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bản đồ ước mơ</Text>
            <View style={styles.dreamMapContainer}>
              {userData.dreamMap.filter(d => d.selected).map((area, index) => (
                <React.Fragment key={index}>
                  <View style={styles.dreamMapItem}>
                    <IconSymbol 
                      ios_icon_name={area.icon} 
                      android_material_icon_name={area.icon as any}
                      size={32} 
                      color={colors.primary} 
                    />
                    <Text style={styles.dreamMapText}>{area.name}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleResetOnboarding}
            >
              <Text style={styles.editButtonText}>Chỉnh sửa bản đồ ước mơ</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Về LIFE5S</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              LIFE5S là hệ điều hành cuộc sống giúp bạn sống đúng - nhẹ - bền theo cuộc sống ước mơ.
            </Text>
            <Text style={styles.infoText}>
              Dựa trên triết lý 5S: Sàng lọc, Sắp xếp, Sạch sẽ, Tiêu chuẩn hóa, và Tâm thế.
            </Text>
          </View>
        </View>

        <View style={styles.philosophyBox}>
          <IconSymbol 
            ios_icon_name="quote.bubble.fill" 
            android_material_icon_name="format-quote"
            size={32} 
            color={colors.primary} 
          />
          <Text style={styles.philosophyText}>
            "Không phải app task. Là Life OS giúp sống đúng-nhẹ-bền mỗi ngày."
          </Text>
        </View>
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
    paddingTop: 20,
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
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  dreamMapContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    marginBottom: 12,
  },
  dreamMapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dreamMapText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    flex: 1,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  philosophyBox: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  philosophyText: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
    marginLeft: 16,
    flex: 1,
    lineHeight: 24,
  },
});
