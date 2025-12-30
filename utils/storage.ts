
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, DreamMapArea, DailyCheckIn, EndOfDayAssessment, PersonalRule } from '@/types/life5s';

const STORAGE_KEY = '@life5s_user_data';

const defaultDreamMapAreas: DreamMapArea[] = [
  { id: '1', name: 'Tự do thời gian/tài chính', icon: 'attach-money', selected: false },
  { id: '2', name: 'Sức khỏe', icon: 'favorite', selected: false },
  { id: '3', name: 'Gia đình', icon: 'people', selected: false },
  { id: '4', name: 'Phát triển bản thân', icon: 'school', selected: false },
  { id: '5', name: 'Trải nghiệm', icon: 'explore', selected: false },
];

const defaultUserData: UserData = {
  hasCompletedOnboarding: false,
  dreamMap: defaultDreamMapAreas,
  dailyCheckIns: [],
  endOfDayAssessments: [],
  personalRules: [],
};

export const getUserData = async (): Promise<UserData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return defaultUserData;
  } catch (e) {
    console.error('Error reading user data:', e);
    return defaultUserData;
  }
};

export const saveUserData = async (data: UserData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('User data saved successfully');
  } catch (e) {
    console.error('Error saving user data:', e);
  }
};

export const updateDreamMap = async (dreamMap: DreamMapArea[]): Promise<void> => {
  try {
    const userData = await getUserData();
    userData.dreamMap = dreamMap;
    await saveUserData(userData);
  } catch (e) {
    console.error('Error updating dream map:', e);
  }
};

export const completeOnboarding = async (): Promise<void> => {
  try {
    const userData = await getUserData();
    userData.hasCompletedOnboarding = true;
    await saveUserData(userData);
  } catch (e) {
    console.error('Error completing onboarding:', e);
  }
};

export const saveDailyCheckIn = async (checkIn: DailyCheckIn): Promise<void> => {
  try {
    const userData = await getUserData();
    const existingIndex = userData.dailyCheckIns.findIndex(c => c.date === checkIn.date);
    
    if (existingIndex >= 0) {
      userData.dailyCheckIns[existingIndex] = checkIn;
    } else {
      userData.dailyCheckIns.push(checkIn);
    }
    
    await saveUserData(userData);
  } catch (e) {
    console.error('Error saving daily check-in:', e);
  }
};

export const saveEndOfDayAssessment = async (assessment: EndOfDayAssessment): Promise<void> => {
  try {
    const userData = await getUserData();
    const existingIndex = userData.endOfDayAssessments.findIndex(a => a.date === assessment.date);
    
    if (existingIndex >= 0) {
      userData.endOfDayAssessments[existingIndex] = assessment;
    } else {
      userData.endOfDayAssessments.push(assessment);
    }
    
    await saveUserData(userData);
  } catch (e) {
    console.error('Error saving end of day assessment:', e);
  }
};

export const addPersonalRule = async (rule: PersonalRule): Promise<void> => {
  try {
    const userData = await getUserData();
    userData.personalRules.push(rule);
    await saveUserData(userData);
  } catch (e) {
    console.error('Error adding personal rule:', e);
  }
};

export const deletePersonalRule = async (ruleId: string): Promise<void> => {
  try {
    const userData = await getUserData();
    userData.personalRules = userData.personalRules.filter(r => r.id !== ruleId);
    await saveUserData(userData);
  } catch (e) {
    console.error('Error deleting personal rule:', e);
  }
};

export const getTodayCheckIn = async (): Promise<DailyCheckIn | null> => {
  try {
    const userData = await getUserData();
    const today = new Date().toISOString().split('T')[0];
    return userData.dailyCheckIns.find(c => c.date === today) || null;
  } catch (e) {
    console.error('Error getting today check-in:', e);
    return null;
  }
};

export const getTodayAssessment = async (): Promise<EndOfDayAssessment | null> => {
  try {
    const userData = await getUserData();
    const today = new Date().toISOString().split('T')[0];
    return userData.endOfDayAssessments.find(a => a.date === today) || null;
  } catch (e) {
    console.error('Error getting today assessment:', e);
    return null;
  }
};
