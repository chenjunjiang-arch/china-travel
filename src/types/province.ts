export interface Dish {
  name: string;
  description: string;
  spicyLevel?: number;  // 0-5
}

export interface City {
  name: string;
  description: string;
  attractions: string[];
  dishes: Dish[];
}

export interface Province {
  name: string;
  shortName: string;
  capital: string;
  description: string;
  cuisineStyle: string;
  cities: City[];
  bestSeasons: string[];
}
