// 향료 데이터 타입 정의
export interface Fragrance {
  id: number;
  name: string;
  displayName: string; // AC'SCENT 01 형식
  notes: string[]; // 메인 향 노트
  exhibition: 1 | 2 | 3;
  season: 'spring-fall' | 'summer' | 'winter';
  seasonLabel: string;
}

// 향료 데이터 (이미지 기반)
export const fragrances: Fragrance[] = [
  // 전시장 1 (1-10번)
  { id: 1, name: '블랙베리앤베이', displayName: "AC'SCENT 01", notes: ['블랙베리'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 2, name: '밤샘', displayName: "AC'SCENT 02", notes: ['만다린 오렌지'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 3, name: '몽파리', displayName: "AC'SCENT 03", notes: ['스트로베리'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 4, name: '네롤리 포르토피노', displayName: "AC'SCENT 04", notes: ['베르가못'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 5, name: '오데쌩', displayName: "AC'SCENT 05", notes: ['비터 오렌지'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 6, name: '운젠르두쉬르니', displayName: "AC'SCENT 06", notes: ['캐럿'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 7, name: '오로즈', displayName: "AC'SCENT 07", notes: ['라즈베리'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 8, name: '카날플라워', displayName: "AC'SCENT 08", notes: ['레몬'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 9, name: '코코 마드모아젤', displayName: "AC'SCENT 09", notes: ['오렌지'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },
  { id: 10, name: '라튤립', displayName: "AC'SCENT 10", notes: ['스위트 레몬'], exhibition: 1, season: 'spring-fall', seasonLabel: '봄가을' },

  // 전시장 2 (11-20번)
  { id: 11, name: '라임바질앤만다린', displayName: "AC'SCENT 11", notes: ['핑크 페퍼'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 12, name: '인플로센스', displayName: "AC'SCENT 12", notes: ['라임'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 13, name: '태식', displayName: "AC'SCENT 13", notes: ['클레멘타인'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 14, name: '화이트 자스민 앤 민트', displayName: "AC'SCENT 14", notes: ['네롤리'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 15, name: '베르가못 22', displayName: "AC'SCENT 15", notes: ['오렌지 플라워'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 16, name: '상탈 33', displayName: "AC'SCENT 16", notes: ['포멜로'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 17, name: '집시워터', displayName: "AC'SCENT 17", notes: ['리치'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 18, name: '블루드 샤넬', displayName: "AC'SCENT 18", notes: ['튜베로즈'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 19, name: '우드세이지앤씨솔트', displayName: "AC'SCENT 19", notes: ['블랙 베티버'], exhibition: 2, season: 'summer', seasonLabel: '여름' },
  { id: 20, name: '휙', displayName: "AC'SCENT 20", notes: ['스파이시 우드'], exhibition: 2, season: 'summer', seasonLabel: '여름' },

  // 전시장 3 (21-30번)
  { id: 21, name: '도손', displayName: "AC'SCENT 21", notes: ['샌달우드'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 22, name: '블랑쉬', displayName: "AC'SCENT 22", notes: ['머스크'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 23, name: '화이트 스웨이드', displayName: "AC'SCENT 23", notes: ['그린티'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 24, name: '플레르드 뽀', displayName: "AC'SCENT 24", notes: ['패출리'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 25, name: '뮤스크라반줄', displayName: "AC'SCENT 25", notes: ['앰버'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 26, name: '탐다오', displayName: "AC'SCENT 26", notes: ['이탈리안 사이프러스'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 27, name: '오드우드', displayName: "AC'SCENT 27", notes: ['스모키 블렌드 우드'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 28, name: '패배릭스', displayName: "AC'SCENT 28", notes: ['레더'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 29, name: '모하비 고스트', displayName: "AC'SCENT 29", notes: ['바이올렛'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
  { id: 30, name: '뗀누아 29', displayName: "AC'SCENT 30", notes: ['베르가못'], exhibition: 3, season: 'winter', seasonLabel: '겨울' },
];

// 전시장별로 향료 그룹화
export const fragrancesByExhibition = {
  1: fragrances.filter(f => f.exhibition === 1),
  2: fragrances.filter(f => f.exhibition === 2),
  3: fragrances.filter(f => f.exhibition === 3),
};

// 계절별로 향료 그룹화 (하위 호환성)
export const fragrancesBySeason = {
  'spring-fall': fragrances.filter(f => f.season === 'spring-fall'),
  'summer': fragrances.filter(f => f.season === 'summer'),
  'winter': fragrances.filter(f => f.season === 'winter'),
};

// 음악 장르 옵션
export const musicGenres = [
  '인디',
  'K-POP',
  '팝',
  '힙합/랩',
  'R&B',
  '록',
  '발라드',
  '재즈',
  '클래식',
  'EDM/일렉트로닉',
  '기타'
];
