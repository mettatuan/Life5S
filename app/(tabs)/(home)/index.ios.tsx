
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { getUserData, getTodayCheckIn, getTodayAssessment } from '@/utils/storage';
import { DailyCheckIn, EndOfDayAssessment } from '@/types/life5s';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [todayAssessment, setTodayAssessment] = useState<EndOfDayAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      setHasCompletedOnboarding(userData.hasCompletedOnboarding);
      
      const checkIn = await getTodayCheckIn();
      setTodayCheckIn(checkIn);
      
      const assessment = await getTodayAssessment();
      setTodayAssessment(assessment);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCheckInComplete = todayCheckIn && 
    todayCheckIn.s1 !== null && 
    todayCheckIn.s2 !== null && 
    todayCheckIn.s3 !== null && 
    todayCheckIn.s4 !== null && 
    todayCheckIn.s5 !== null;

  const isAssessmentComplete = todayAssessment && 
    todayAssessment.simpler !== null && 
    todayAssessment.happier !== null && 
    todayAssessment.confident !== null && 
    todayAssessment.lighter !== null;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={commonStyles.text}>Đang tải...</Text>
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeContainer}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto-awesome" 
              size={80} 
              color={colors.primary} 
            />
            <Text style={styles.welcomeTitle}>Chào mừng đến với LIFE5S</Text>
            <Text style={styles.welcomeSubtitle}>Hệ điều hành cuộc sống</Text>
            <Text style={styles.welcomeText}>
              Sống đúng - nhẹ - bền theo cuộc sống ước mơ của bạn
            </Text>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => router.push('/onboarding')}
            >
              <Text style={styles.startButtonText}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Xin chào! 👋</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[styles.card, isCheckInComplete && styles.cardComplete]}
            onPress={() => router.push('/daily-checkin')}
          >
            <View style={styles.cardHeader}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name={isCheckInComplete ? "check-circle" : "radio-button-unchecked"}
                size={40} 
                color={isCheckInComplete ? colors.success : colors.primary} 
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Check-in 5S hằng ngày</Text>
                <Text style={styles.cardSubtitle}>
                  {isCheckInComplete ? 'Đã hoàn thành ✓' : '30 giây mỗi ngày'}
                </Text>
              </View>
            </View>
            {!isCheckInComplete && (
              <View style={styles.cardAction}>
                <Text style={styles.cardActionText}>Bắt đầu →</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, isAssessmentComplete && styles.cardComplete]}
            onPress={() => router.push('/end-of-day')}
          >
            <View style={styles.cardHeader}>
              <IconSymbol 
                ios_icon_name="moon.stars.fill" 
                android_material_icon_name={isAssessmentComplete ? "check-circle" : "nightlight"}
                size={40} 
                color={isAssessmentComplete ? colors.success : colors.accent} 
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Đánh giá cuối ngày</Text>
                <Text style={styles.cardSubtitle}>
                  {isAssessmentComplete ? 'Đã hoàn thành ✓' : '4 câu hỏi đơn giản'}
                </Text>
              </View>
            </View>
            {!isAssessmentComplete && (
              <View style={styles.cardAction}>
                <Text style={styles.cardActionText}>Bắt đầu →</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/dashboard')}
          >
            <View style={styles.cardHeader}>
              <IconSymbol 
                ios_icon_name="chart.bar.fill" 
                android_material_icon_name="bar-chart"
                size={40} 
                color={colors.secondary} 
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Xu hướng & Thống kê</Text>
                <Text style={styles.cardSubtitle}>Xem tiến trình của bạn</Text>
              </View>
            </View>
            <View style={styles.cardAction}>
              <Text style={styles.cardActionText}>Xem →</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.philosophyContainer}>
          <Text style={styles.philosophyTitle}>Triết lý 5S</Text>
          <View style={styles.philosophyItem}>
            <Text style={styles.philosophyNumber}>S1</Text>
            <Text style={styles.philosophyText}>Sàng lọc: Giữ đúng - bỏ đúng</Text>
          </View>
          <View style={styles.philosophyItem}>
            <Text style={styles.philosophyNumber}>S2</Text>
            <Text style={styles.philosophyText}>Sắp xếp: Thứ tự ưu tiên</Text>
          </View>
          <View style={styles.philosophyItem}>
            <Text style={styles.philosophyNumber}>S3</Text>
            <Text style={styles.philosophyText}>Sạch sẽ: Không lệch chuẩn</Text>
          </View>
          <View style={styles.philosophyItem}>
            <Text style={styles.philosophyNumber}>S4</Text>
            <Text style={styles.philosophyText}>Tiêu chuẩn hóa: Không nghĩ lại</Text>
          </View>
          <View style={styles.philosophyItem}>
            <Text style={styles.philosophyNumber}>S5</Text>
            <Text style={styles.philosophyText}>Tâm thế: Chủ động - tự giác - trách nhiệm</Text>
          </View>
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
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginTop: 40,
    boxShadow: '0px 4px 12px rgba(100, 181, 246, 0.3)',
    elevation: 4,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  cardComplete: {
    backgroundColor: colors.highlight,
    borderWidth: 2,
    borderColor: colors.success,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardAction: {
    alignItems: 'flex-end',
  },
  cardActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  philosophyContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  philosophyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  philosophyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  philosophyNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    width: 40,
  },
  philosophyText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
});
