
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { getUserData } from '@/utils/storage';
import { UserData } from '@/types/life5s';

const { width } = Dimensions.get('window');

type TimeRange = 7 | 14 | 30;

export default function DashboardScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(7);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getUserData();
    setUserData(data);
  };

  const getRecentData = (days: number) => {
    if (!userData) return { checkIns: [], assessments: [] };

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = cutoffDate.toISOString().split('T')[0];

    const checkIns = userData.dailyCheckIns.filter(c => c.date >= cutoffString);
    const assessments = userData.endOfDayAssessments.filter(a => a.date >= cutoffString);

    return { checkIns, assessments };
  };

  const calculateStats = () => {
    const { checkIns, assessments } = getRecentData(timeRange);

    const checkInStats = {
      total: checkIns.length,
      s1Yes: checkIns.filter(c => c.s1 === false).length,
      s2Yes: checkIns.filter(c => c.s2 === true).length,
      s3Yes: checkIns.filter(c => c.s3 === false).length,
      s4Yes: checkIns.filter(c => c.s4 === false).length,
      s5Yes: checkIns.filter(c => c.s5 === false).length,
    };

    const assessmentStats = {
      total: assessments.length,
      simpler: assessments.filter(a => a.simpler === true).length,
      happier: assessments.filter(a => a.happier === true).length,
      confident: assessments.filter(a => a.confident === true).length,
      lighter: assessments.filter(a => a.lighter === true).length,
    };

    return { checkInStats, assessmentStats };
  };

  const { checkInStats, assessmentStats } = calculateStats();

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back"
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xu hướng & Thống kê</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.timeRangeContainer}>
        {[7, 14, 30].map((days, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === days && styles.timeRangeButtonActive
              ]}
              onPress={() => setTimeRange(days as TimeRange)}
            >
              <Text style={[
                styles.timeRangeText,
                timeRange === days && styles.timeRangeTextActive
              ]}>
                {days} ngày
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá cuối ngày</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol 
                ios_icon_name="spa" 
                android_material_icon_name="spa"
                size={32} 
                color={colors.primary} 
              />
              <Text style={styles.statValue}>
                {getPercentage(assessmentStats.simpler, assessmentStats.total)}%
              </Text>
              <Text style={styles.statLabel}>Đơn giản hơn</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol 
                ios_icon_name="sentiment-satisfied" 
                android_material_icon_name="sentiment-satisfied"
                size={32} 
                color={colors.secondary} 
              />
              <Text style={styles.statValue}>
                {getPercentage(assessmentStats.happier, assessmentStats.total)}%
              </Text>
              <Text style={styles.statLabel}>Vui hơn</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol 
                ios_icon_name="thumb-up" 
                android_material_icon_name="thumb-up"
                size={32} 
                color={colors.accent} 
              />
              <Text style={styles.statValue}>
                {getPercentage(assessmentStats.confident, assessmentStats.total)}%
              </Text>
              <Text style={styles.statLabel}>Tin tưởng hơn</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol 
                ios_icon_name="air" 
                android_material_icon_name="air"
                size={32} 
                color={colors.primary} 
              />
              <Text style={styles.statValue}>
                {getPercentage(assessmentStats.lighter, assessmentStats.total)}%
              </Text>
              <Text style={styles.statLabel}>Nhẹ hơn</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in 5S</Text>
          <View style={styles.checkInList}>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>S1 - Không để thứ không cần</Text>
              <Text style={styles.checkInValue}>
                {getPercentage(checkInStats.s1Yes, checkInStats.total)}%
              </Text>
            </View>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>S2 - Ngày trôi chảy</Text>
              <Text style={styles.checkInValue}>
                {getPercentage(checkInStats.s2Yes, checkInStats.total)}%
              </Text>
            </View>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>S3 - Không phá chuẩn</Text>
              <Text style={styles.checkInValue}>
                {getPercentage(checkInStats.s3Yes, checkInStats.total)}%
              </Text>
            </View>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>S4 - Không nghĩ lại nhiều</Text>
              <Text style={styles.checkInValue}>
                {getPercentage(checkInStats.s4Yes, checkInStats.total)}%
              </Text>
            </View>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>S5 - Không than vãn/viện cớ</Text>
              <Text style={styles.checkInValue}>
                {getPercentage(checkInStats.s5Yes, checkInStats.total)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.insightBox}>
          <IconSymbol 
            ios_icon_name="lightbulb.fill" 
            android_material_icon_name="lightbulb"
            size={32} 
            color={colors.accent} 
          />
          <Text style={styles.insightText}>
            {assessmentStats.total === 0 
              ? 'Bắt đầu check-in hằng ngày để xem xu hướng của bạn!'
              : `Bạn đã hoàn thành ${assessmentStats.total} đánh giá trong ${timeRange} ngày qua. Tiếp tục duy trì!`
            }
          </Text>
        </View>

        {userData && userData.dreamMap.filter(d => d.selected).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bản đồ ước mơ của bạn</Text>
            <View style={styles.dreamMapList}>
              {userData.dreamMap.filter(d => d.selected).map((area, index) => (
                <React.Fragment key={index}>
                  <View style={styles.dreamMapItem}>
                    <IconSymbol 
                      ios_icon_name={area.icon} 
                      android_material_icon_name={area.icon as any}
                      size={24} 
                      color={colors.primary} 
                    />
                    <Text style={styles.dreamMapText}>{area.name}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timeRangeTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  checkInList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  checkInItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkInLabel: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  checkInValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  insightBox: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  insightText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 16,
    flex: 1,
    lineHeight: 22,
  },
  dreamMapList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  dreamMapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dreamMapText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
});
