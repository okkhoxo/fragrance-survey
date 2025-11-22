import { SurveyResponse } from '../types/survey';
import { fragrances, musicGenres, fragrancesByExhibition } from '../data/fragrances';

// 시드 기반 랜덤 생성기 (고정된 데이터 생성)
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

let rng = new SeededRandom(12345); // 고정 시드

// 날짜 범위 내 타임스탬프 생성 (시드 기반)
function getRandomTimestamp(startDate: Date, endDate: Date): number {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return start + rng.next() * (end - start);
}

// 월별 가중치 계산 (계절, 특별 기간 고려)
function getMonthWeight(year: number, month: number): number {
  // 기본 계절 가중치
  let seasonWeight = 1.0;

  // 여름 (6-8월): 높음
  if (month >= 6 && month <= 8) {
    seasonWeight = 2.5;
  }
  // 겨울 (12-2월): 높음
  else if (month === 12 || month === 1 || month === 2) {
    seasonWeight = 2.5;
  }
  // 봄가을 (3-5, 9-11월): 보통
  else {
    seasonWeight = 1.0;
  }

  // 연도별 성장 가중치
  let growthWeight = 1.0;
  if (year === 2023) {
    growthWeight = 0.3; // 오픈 초반
  } else if (year === 2024) {
    growthWeight = 1.5; // 성장기
  } else if (year === 2025) {
    growthWeight = 2.5; // 전성기
  }

  // 크리스마스/연말 보너스 (12월)
  let eventBonus = 1.0;
  if (month === 12) {
    eventBonus = 1.8; // 크리스마스 + 연말
  }

  return seasonWeight * growthWeight * eventBonus;
}

// 만족도 생성 (평균 4.8 이상)
function generateSatisfaction(): 1 | 2 | 3 | 4 | 5 {
  const rand = rng.next();
  // 5점: 85%, 4점: 13%, 3점: 2% (평균 4.83점)
  if (rand < 0.85) return 5;
  if (rand < 0.98) return 4;
  return 3;
}

// 나이 생성 (평균 28세)
function generateAge(): number {
  const rand = rng.next();
  // 18-19세: 2%, 20-27세: 50%, 28-30세: 25%, 31-35세: 15%, 36세 이상: 8%
  if (rand < 0.02) {
    // 18-19세
    return 18 + Math.floor(rng.next() * 2);
  } else if (rand < 0.52) {
    // 20-27세
    return 20 + Math.floor(rng.next() * 8);
  } else if (rand < 0.77) {
    // 28-30세
    return 28 + Math.floor(rng.next() * 3);
  } else if (rand < 0.92) {
    // 31-35세
    return 31 + Math.floor(rng.next() * 5);
  } else {
    // 36-55세
    return 36 + Math.floor(rng.next() * 20);
  }
}

// 성별 생성 (남성 38%, 여성 62%)
function generateGender(): '남성' | '여성' {
  return rng.next() < 0.38 ? '남성' : '여성';
}

// 음악 장르 선택 (가중치 있는 랜덤)
function selectMusicGenre(): string {
  const weights = {
    '인디': 0.20,
    'K-POP': 0.18,
    '팝': 0.15,
    '힙합/랩': 0.12,
    'R&B': 0.10,
    '록': 0.08,
    '발라드': 0.07,
    '재즈': 0.04,
    '클래식': 0.03,
    'EDM/일렉트로닉': 0.02,
    '기타': 0.01
  };

  const rand = rng.next();
  let cumulative = 0;
  for (const [genre, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (rand < cumulative) return genre;
  }
  return '기타';
}

// 향료 비율 선택
function selectRatio(): '60/20/20' | '40/30/30' {
  return rng.next() < 0.6 ? '60/20/20' : '40/30/30';
}

// 강조 향료 선택 (메인 향료 기반)
function selectEmphasizedFragrance(mainFragranceId: number): 1 | 2 | 3 {
  // 메인 향료가 속한 전시장 찾기
  const mainFragrance = fragrances.find(f => f.id === mainFragranceId);
  const mainExhibition = mainFragrance?.exhibition;

  const rand = rng.next();

  // 메인 향료의 전시장을 80% 확률로 강조
  if (rand < 0.80 && mainExhibition) {
    return mainExhibition;
  }

  // 나머지 20%는 다른 전시장 중 랜덤
  const otherExhibitions = [1, 2, 3].filter(ex => ex !== mainExhibition) as (1 | 2 | 3)[];
  return otherExhibitions[Math.floor(rng.next() * otherExhibitions.length)];
}

// 각 전시장에서 향료 1개씩 선택
function selectFragrancesFromAllExhibitions(): {
  fragrance1: number;
  fragrance2: number;
  fragrance3: number;
} {
  // 전시장 1에서 1개
  const ex1Fragrances = fragrancesByExhibition[1];
  const frag1 = ex1Fragrances[Math.floor(rng.next() * ex1Fragrances.length)];

  // 전시장 2에서 1개
  const ex2Fragrances = fragrancesByExhibition[2];
  const frag2 = ex2Fragrances[Math.floor(rng.next() * ex2Fragrances.length)];

  // 전시장 3에서 1개
  const ex3Fragrances = fragrancesByExhibition[3];
  const frag3 = ex3Fragrances[Math.floor(rng.next() * ex3Fragrances.length)];

  return {
    fragrance1: frag1.id,
    fragrance2: frag2.id,
    fragrance3: frag3.id,
  };
}

// 주 향료 선택 (날짜 기반 계절 고려 + 특정 향료 가중치)
function selectMainFragrance(month: number, selectedFrags: { fragrance1: number; fragrance2: number; fragrance3: number }): { id: number; name: string; season: string } {
  const rand = rng.next();

  // 특정 향료 가중치: 19번 11%, 2번 7%, 24번 6%
  if (rand < 0.11) {
    // 11% 확률로 19번
    const frag = fragrances.find(f => f.id === 19)!;
    return { id: frag.id, name: frag.name, season: frag.seasonLabel };
  } else if (rand < 0.18) {
    // 7% 확률로 2번 (0.11 + 0.07 = 0.18)
    const frag = fragrances.find(f => f.id === 2)!;
    return { id: frag.id, name: frag.name, season: frag.seasonLabel };
  } else if (rand < 0.24) {
    // 6% 확률로 24번 (0.18 + 0.06 = 0.24)
    const frag = fragrances.find(f => f.id === 24)!;
    return { id: frag.id, name: frag.name, season: frag.seasonLabel };
  }

  // 나머지 76%는 날짜의 계절에 따라 전시장별 향료 우선 선택
  // 5~8월(여름): 2번 전시장 (exhibition 2)
  // 11월~2월(겨울): 3번 전시장 (exhibition 3)
  // 3,4월(봄), 9,10월(가을): 1번 전시장 (exhibition 1)

  let preferredExhibition: 1 | 2 | 3;
  let seasonLabel: string;

  if (month >= 5 && month <= 8) {
    // 여름 (5~8월): 2번 전시장
    preferredExhibition = 2;
    seasonLabel = '여름';
  } else if (month === 11 || month === 12 || month === 1 || month === 2) {
    // 겨울 (11월~2월): 3번 전시장
    preferredExhibition = 3;
    seasonLabel = '겨울';
  } else {
    // 봄가을 (3,4,9,10월): 1번 전시장
    preferredExhibition = 1;
    seasonLabel = '봄가을';
  }

  // 선택된 3개 향료 중에서 선호 전시장의 향료 찾기
  const allSelected = [
    { id: selectedFrags.fragrance1, exhibition: 1 },
    { id: selectedFrags.fragrance2, exhibition: 2 },
    { id: selectedFrags.fragrance3, exhibition: 3 }
  ];

  // 80% 확률로 선호 전시장의 향료 선택, 20% 확률로 다른 향료 선택
  const seasonRand = rng.next();
  let selectedFragId: number;

  if (seasonRand < 0.80) {
    // 선호 전시장의 향료 선택
    const preferredFrag = allSelected.find(f => f.exhibition === preferredExhibition);
    selectedFragId = preferredFrag!.id;
  } else {
    // 20% 확률로 다른 향료 중 랜덤 선택
    const otherFrags = allSelected.filter(f => f.exhibition !== preferredExhibition);
    selectedFragId = otherFrags[Math.floor(rng.next() * otherFrags.length)].id;
  }

  const selected = fragrances.find(f => f.id === selectedFragId)!;

  return {
    id: selected.id,
    name: selected.name,
    season: seasonLabel
  };
}

export function generateMockData(): SurveyResponse[] {
  // 시드 리셋 (항상 동일한 데이터 생성)
  rng = new SeededRandom(12345);

  const responses: SurveyResponse[] = [];

  // 운영 기간: 2023-09-01 ~ 2025-08-30
  const startDate = new Date(2023, 8, 1); // 9월 = 8 (0-indexed)
  const endDate = new Date(2025, 7, 30); // 8월 = 7

  // 날짜별로 순회하면서 데이터 생성
  let currentDate = new Date(startDate.getTime());

  while (currentDate.getTime() <= endDate.getTime()) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    // 해당 월의 가중치 계산
    const monthWeight = getMonthWeight(year, month);

    // 하루 방문자 수 결정 (기본 5-10명, 가중치 적용)
    const baseVisitors = 5 + Math.floor(rng.next() * 5);
    const dailyVisitors = Math.floor(baseVisitors * monthWeight);

    // 크리스마스 기간 (12/20-12/26) 추가 보너스
    if (month === 12 && day >= 20 && day <= 26) {
      const bonusVisitors = Math.floor(dailyVisitors * 0.5);
      for (let i = 0; i < bonusVisitors; i++) {
        responses.push(generateSingleResponse(new Date(currentDate.getTime()), month));
      }
    }

    // 연말 기간 (12/27-12/31) 추가 보너스
    if (month === 12 && day >= 27) {
      const bonusVisitors = Math.floor(dailyVisitors * 0.3);
      for (let i = 0; i < bonusVisitors; i++) {
        responses.push(generateSingleResponse(new Date(currentDate.getTime()), month));
      }
    }

    // 일반 방문자
    for (let i = 0; i < dailyVisitors; i++) {
      responses.push(generateSingleResponse(new Date(currentDate.getTime()), month));
    }

    // 다음 날로 (새로운 Date 객체 생성)
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  console.log(`Loaded ${responses.length} archived responses`);
  return responses;
}

function generateSingleResponse(date: Date, month: number): SurveyResponse {
  // 해당 날짜의 랜덤 시간 (10:00 - 20:00)
  const dayStart = new Date(date);
  dayStart.setHours(10, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(20, 0, 0, 0);

  const timestamp = getRandomTimestamp(dayStart, dayEnd);

  // 각 전시장에서 향료 1개씩 선택
  const selectedFrags = selectFragrancesFromAllExhibitions();

  // 주 향료 선택 (강조할 향료, 계절 고려)
  const mainFragrance = selectMainFragrance(month, selectedFrags);

  // 메인 향료가 선택된 3개 향료 중 하나가 되도록 업데이트
  const mainFrag = fragrances.find(f => f.id === mainFragrance.id)!;
  if (mainFrag.exhibition === 1) {
    selectedFrags.fragrance1 = mainFragrance.id;
  } else if (mainFrag.exhibition === 2) {
    selectedFrags.fragrance2 = mainFragrance.id;
  } else if (mainFrag.exhibition === 3) {
    selectedFrags.fragrance3 = mainFragrance.id;
  }

  // 강조 향료 결정 (메인 향료의 전시장과 80% 일치)
  const emphasizedFragrance = selectEmphasizedFragrance(mainFragrance.id);

  return {
    id: `mock-${timestamp}-${rng.next().toString().substr(2, 9)}`,
    age: generateAge(),
    gender: generateGender(),
    selectedFragranceId: mainFragrance.id,
    fragranceName: mainFragrance.name,
    season: mainFragrance.season,
    musicGenre: selectMusicGenre(),
    fragranceRatio: selectRatio(),
    emphasizedFragrance,
    selectedFragrance1: selectedFrags.fragrance1,
    selectedFragrance2: selectedFrags.fragrance2,
    selectedFragrance3: selectedFrags.fragrance3,
    satisfaction: generateSatisfaction(),
    timestamp
  };
}
