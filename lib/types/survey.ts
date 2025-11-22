// 설문 응답 데이터 타입
export interface SurveyResponse {
  id: string;
  age: number;
  gender: '남성' | '여성';
  selectedFragranceId: number;
  fragranceName: string;
  season: string;
  musicGenre: string;
  fragranceRatio: '60/20/20' | '40/30/30';
  emphasizedFragrance?: 1 | 2 | 3;
  selectedFragrance1?: number;
  selectedFragrance2?: number;
  selectedFragrance3?: number;
  satisfaction?: 1 | 2 | 3 | 4 | 5;
  timestamp: number;
}

// 나이대별 그룹
export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대 이상';

export function getAgeGroup(age: number): AgeGroup {
  if (age < 20) return '10대';
  if (age < 30) return '20대';
  if (age < 40) return '30대';
  if (age < 50) return '40대';
  return '50대 이상';
}

// 통계 데이터 타입
export interface FragranceStats {
  fragranceId: number;
  fragranceName: string;
  count: number;
  percentage: number;
}

export interface MusicGenreStats {
  genre: string;
  count: number;
  percentage: number;
}

export interface AgeGroupStats {
  ageGroup: AgeGroup;
  fragrances: FragranceStats[];
  musicGenres: MusicGenreStats[];
  totalResponses: number;
}
