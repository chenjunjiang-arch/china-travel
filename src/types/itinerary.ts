import { WuXingElement } from './bazi';

export interface Meal {
  type: '早餐' | '午餐' | '晚餐' | '夜宵';
  restaurant: string;
  address: string;
  dishes: string[];
  pricePerPerson: string;
  description: string;
}

export interface Attraction {
  name: string;
  description: string;
  duration: string;
  tips?: string;
}

export interface DayPlan {
  day: number;
  date?: string;
  city: string;
  theme: string;
  meals: Meal[];
  attractions: Attraction[];
  transportation?: string;
}

export interface Itinerary {
  province: string;
  totalDays: number;
  summary: string;
  wuXingFoodTherapy?: {
    element: WuXingElement;
    advice: string;
  };
  days: DayPlan[];
  tips: string[];
}
