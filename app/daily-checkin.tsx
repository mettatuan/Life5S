
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { saveDailyCheckIn, getTodayCheckIn } from '@/utils/storage';
import { DailyCheckIn } from '@/types/life5s';

interface Question {
  id: keyof Omit<DailyCheckIn, 'date'>;
  title: string;
  question: string;
  icon: string;
}

const questions: Question[] = [
  {
    id: 's1',
    title: 'S1 - Sàng lọc',
    question: 'Hôm nay bạn có để thứ không cần quay lại không?',
    icon: 'filter-list',
  },
  {
    id: 's2',
    title: 'S2 - Sắp xếp',
    question: 'Ngày của bạn có trôi chảy không? Có tìm việc/thứ nhiều không?',
    icon: 'sort',
  },
  {
    id: 's3',
    title: 'S3 - Sạch sẽ',
    question: 'Bạn có phá chuẩn không? Có việc gì cần dừng ngay trong đầu?',
    icon: 'cleaning-services',
  },
  {
    id: 's4',
    title: 'S4 - Tiêu chuẩn hóa',
    question: 'Bạn có nghĩ lại việc nào nhiều không?',
    icon: 'rule',
  },
  {
    id: 's5',
    title: 'S5 - Tâm thế',
    question: 'Bạn có than vãn/viện cớ/đổ lỗi không? Nhớ "do mình chọn"?',
    icon: 'psychology',
  },
];

export default function DailyCheckInScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<DailyCheckIn>({
    date: new Date().toISOString().split('T')[0],
    s1: null,
    s2: null,
    s3: null,
    s4: null,
    s5: null,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadTodayCheckIn();
  }, []);

  const loadTodayCheckIn = async () => {
    const checkIn = await getTodayCheckIn();
    if (checkIn) {
      setAnswers(checkIn);
      const firstUnanswered = questions.findIndex(q => checkIn[q.id] === null);
      if (firstUnanswered >= 0) {
        setCurrentQuestionIndex(firstUnanswered);
      } else {
        setCurrentQuestionIndex(questions.length - 1);
      }
    }
  };

  const handleAnswer = async (answer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    await saveDailyCheckIn(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setTimeout(() => {
        router.back();
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = questions.every(q => answers[q.id] !== null);

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
        <Text style={styles.headerTitle}>Check-in 5S hằng ngày</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionContainer}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name={currentQuestion.icon} 
              android_material_icon_name={currentQuestion.icon as any}
              size={60} 
              color={colors.primary} 
            />
          </View>
          
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.answersContainer}>
            <TouchableOpacity 
              style={[
                styles.answerButton,
                styles.yesButton,
                answers[currentQuestion.id] === true && styles.answerButtonSelected
              ]}
              onPress={() => handleAnswer(true)}
            >
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check-circle"
                size={32} 
                color={answers[currentQuestion.id] === true ? '#ffffff' : colors.success} 
              />
              <Text style={[
                styles.answerButtonText,
                answers[currentQuestion.id] === true && styles.answerButtonTextSelected
              ]}>
                Có
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.answerButton,
                styles.noButton,
                answers[currentQuestion.id] === false && styles.answerButtonSelected
              ]}
              onPress={() => handleAnswer(false)}
            >
              <IconSymbol 
                ios_icon_name="xmark.circle.fill" 
                android_material_icon_name="cancel"
                size={32} 
                color={answers[currentQuestion.id] === false ? '#ffffff' : colors.error} 
              />
              <Text style={[
                styles.answerButtonText,
                answers[currentQuestion.id] === false && styles.answerButtonTextSelected
              ]}>
                Không
              </Text>
            </TouchableOpacity>
          </View>

          {currentQuestionIndex > 0 && (
            <TouchableOpacity 
              style={styles.previousButton}
              onPress={handlePrevious}
            >
              <Text style={styles.previousButtonText}>← Câu trước</Text>
            </TouchableOpacity>
          )}
        </View>

        {allAnswered && (
          <View style={styles.completionMessage}>
            <IconSymbol 
              ios_icon_name="checkmark.seal.fill" 
              android_material_icon_name="verified"
              size={40} 
              color={colors.success} 
            />
            <Text style={styles.completionText}>
              Hoàn thành! Bạn đã check-in hôm nay.
            </Text>
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
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  questionContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  answersContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 24,
  },
  answerButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  yesButton: {
    borderColor: colors.success,
  },
  noButton: {
    borderColor: colors.error,
  },
  answerButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  answerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  answerButtonTextSelected: {
    color: '#ffffff',
  },
  previousButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  previousButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  completionMessage: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 2,
    borderColor: colors.success,
  },
  completionText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});
