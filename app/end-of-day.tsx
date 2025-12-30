
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { saveEndOfDayAssessment, getTodayAssessment } from '@/utils/storage';
import { EndOfDayAssessment } from '@/types/life5s';

interface Question {
  id: keyof Omit<EndOfDayAssessment, 'date'>;
  question: string;
  icon: string;
}

const questions: Question[] = [
  {
    id: 'simpler',
    question: 'Hôm nay có đơn giản hơn không?',
    icon: 'spa',
  },
  {
    id: 'happier',
    question: 'Hôm nay có vui hơn không?',
    icon: 'sentiment-satisfied',
  },
  {
    id: 'confident',
    question: 'Hôm nay có tin tưởng hơn không?',
    icon: 'thumb-up',
  },
  {
    id: 'lighter',
    question: 'Hôm nay có nhẹ hơn không?',
    icon: 'air',
  },
];

export default function EndOfDayScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<EndOfDayAssessment>({
    date: new Date().toISOString().split('T')[0],
    simpler: null,
    happier: null,
    confident: null,
    lighter: null,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadTodayAssessment();
  }, []);

  const loadTodayAssessment = async () => {
    const assessment = await getTodayAssessment();
    if (assessment) {
      setAnswers(assessment);
      const firstUnanswered = questions.findIndex(q => assessment[q.id] === null);
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

    await saveEndOfDayAssessment(newAnswers);

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
        <Text style={styles.headerTitle}>Đánh giá cuối ngày</Text>
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
              size={80} 
              color={colors.accent} 
            />
          </View>
          
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
                size={40} 
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
                size={40} 
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
              ios_icon_name="moon.stars.fill" 
              android_material_icon_name="nightlight"
              size={40} 
              color={colors.accent} 
            />
            <Text style={styles.completionText}>
              Hoàn thành! Chúc bạn ngủ ngon và một ngày mai tốt đẹp.
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
    marginBottom: 32,
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
    backgroundColor: colors.accent,
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
    marginBottom: 32,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 48,
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
    borderRadius: 20,
    padding: 32,
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
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  answerButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
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
    borderColor: colors.accent,
  },
  completionText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
});
