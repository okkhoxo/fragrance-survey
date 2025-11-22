'use client';

import { useEffect, useState } from 'react';
import { SurveyResponse, getAgeGroup, AgeGroup } from '@/lib/types/survey';
import { fragrances } from '@/lib/data/fragrances';
import { useRouter } from 'next/navigation';
import { generateMockData } from '@/lib/utils/generateMockData';

export default function AdminPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'all'>('all');
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
    id: true,
    age: true,
    gender: true,
    fragranceId: true,
    fragranceDisplay: true,
    mainNote: true,
    season: true,
    musicGenre: true,
    ratio: true,
    emphasized: true,
    satisfaction: true,
    ex1: true,
    ex2: true,
    ex3: true,
    timestamp: true,
  });

  useEffect(() => {
    try {
      let data = JSON.parse(localStorage.getItem('surveyResponses') || '[]');

      // Auto-generate mock data if localStorage is empty
      if (data.length === 0) {
        console.log('No data found in localStorage. Generating archive data...');
        data = generateMockData();
        localStorage.setItem('surveyResponses', JSON.stringify(data));
        console.log(`Auto-generated ${data.length} archived responses`);
      }

      setResponses(data);
    } catch (error) {
      console.error('localStorage access error (Safari private mode?):', error);
      // Generate data in memory even if localStorage is not available
      const data = generateMockData();
      setResponses(data);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showColumnSelector && !target.closest('.column-selector-wrapper')) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnSelector]);

  const ageGroups: AgeGroup[] = ['10대', '20대', '30대', '40대', '50대 이상'];

  // 나이대별 필터링
  const filteredResponses = selectedAgeGroup === 'all'
    ? responses
    : responses.filter(r => getAgeGroup(r.age) === selectedAgeGroup);

  // 향료별 선택 횟수
  const fragranceStats = fragrances.map(fragrance => {
    const count = filteredResponses.filter(r => r.selectedFragranceId === fragrance.id).length;
    return {
      ...fragrance,
      count,
      percentage: filteredResponses.length > 0 ? (count / filteredResponses.length * 100).toFixed(1) : '0',
    };
  }).sort((a, b) => b.count - a.count);

  // 음악 장르별 선택 횟수
  const genreStats = Array.from(new Set(filteredResponses.map(r => r.musicGenre)))
    .map(genre => {
      const count = filteredResponses.filter(r => r.musicGenre === genre).length;
      return {
        genre,
        count,
        percentage: filteredResponses.length > 0 ? (count / filteredResponses.length * 100).toFixed(1) : '0',
      };
    }).sort((a, b) => b.count - a.count);

  // 계절별 선호도
  const seasonStats = {
    '봄가을': filteredResponses.filter(r => r.season === '봄가을').length,
    '여름': filteredResponses.filter(r => r.season === '여름').length,
    '겨울': filteredResponses.filter(r => r.season === '겨울').length,
  };

  // 향료 비율 통계
  const ratioStats = {
    '60/20/20': filteredResponses.filter(r => r.fragranceRatio === '60/20/20').length,
    '40/30/30': filteredResponses.filter(r => r.fragranceRatio === '40/30/30').length,
  };

  // 성별 통계
  const genderStats = {
    '남성': filteredResponses.filter(r => r.gender === '남성').length,
    '여성': filteredResponses.filter(r => r.gender === '여성').length,
  };

  // 강조향 통계
  const emphasizedStats = fragrances.map(fragrance => {
    const count = filteredResponses.filter(r => {
      if (r.emphasizedFragrance === 1 && r.selectedFragrance1 === fragrance.id) return true;
      if (r.emphasizedFragrance === 2 && r.selectedFragrance2 === fragrance.id) return true;
      if (r.emphasizedFragrance === 3 && r.selectedFragrance3 === fragrance.id) return true;
      return false;
    }).length;
    return {
      ...fragrance,
      count,
      percentage: filteredResponses.length > 0 ? (count / filteredResponses.length * 100).toFixed(1) : '0',
    };
  }).filter(f => f.count > 0).sort((a, b) => b.count - a.count);

  // 만족도 통계
  const satisfactionResponses = filteredResponses.filter(r => r.satisfaction);
  const avgSatisfaction = satisfactionResponses.length > 0
    ? (satisfactionResponses.reduce((sum, r) => sum + (r.satisfaction || 0), 0) / satisfactionResponses.length).toFixed(2)
    : '0';
  const satisfactionStats = {
    1: satisfactionResponses.filter(r => r.satisfaction === 1).length,
    2: satisfactionResponses.filter(r => r.satisfaction === 2).length,
    3: satisfactionResponses.filter(r => r.satisfaction === 3).length,
    4: satisfactionResponses.filter(r => r.satisfaction === 4).length,
    5: satisfactionResponses.filter(r => r.satisfaction === 5).length,
  };

  // 나이대별 통계
  const ageGroupStats = ageGroups.map(group => {
    const groupResponses = responses.filter(r => getAgeGroup(r.age) === group);
    return {
      group,
      count: groupResponses.length,
      avgAge: groupResponses.length > 0
        ? (groupResponses.reduce((sum, r) => sum + r.age, 0) / groupResponses.length).toFixed(1)
        : '0',
    };
  });

  // 향료-음악 장르 교차 분석
  const topFragrances = fragranceStats.slice(0, 10);
  const fragranceGenreMatrix = topFragrances.map(frag => {
    const fragResponses = filteredResponses.filter(r => r.selectedFragranceId === frag.id);
    const genres = Array.from(new Set(fragResponses.map(r => r.musicGenre)))
      .map(genre => ({
        genre,
        count: fragResponses.filter(r => r.musicGenre === genre).length,
      }))
      .sort((a, b) => b.count - a.count);
    return {
      fragrance: frag.displayName,
      fragranceName: frag.name,
      topGenres: genres.slice(0, 3),
    };
  });

  const columnLabels: Record<string, string> = {
    id: 'ID',
    age: '나이',
    gender: '성별',
    fragranceId: '향료번호',
    fragranceDisplay: '향료표시명',
    mainNote: '메인노트',
    season: '계절',
    musicGenre: '음악장르',
    ratio: '향료비율',
    emphasized: '강조향',
    satisfaction: '만족도',
    ex1: '전시1',
    ex2: '전시2',
    ex3: '전시3',
    timestamp: '제출시간',
  };

  const downloadData = () => {
    // 선택된 컬럼만 필터링
    const allColumns = ['id', 'age', 'gender', 'fragranceId', 'fragranceDisplay', 'mainNote', 'season', 'musicGenre', 'ratio', 'emphasized', 'satisfaction', 'ex1', 'ex2', 'ex3', 'timestamp'];
    const activeColumns = allColumns.filter(col => selectedColumns[col]);

    if (activeColumns.length === 0) {
      alert('다운로드할 컬럼을 최소 1개 이상 선택해주세요.');
      return;
    }

    const headers = activeColumns.map(col => columnLabels[col]);

    // CSV 데이터 행
    const rows = responses.map(r => {
      const fragrance = fragrances.find(f => f.id === r.selectedFragranceId);
      const mainNote = fragrance?.notes.join(', ') || '';
      const date = new Date(r.timestamp).toLocaleString('ko-KR');
      const frag1 = r.selectedFragrance1 ? fragrances.find(f => f.id === r.selectedFragrance1)?.displayName : '';
      const frag2 = r.selectedFragrance2 ? fragrances.find(f => f.id === r.selectedFragrance2)?.displayName : '';
      const frag3 = r.selectedFragrance3 ? fragrances.find(f => f.id === r.selectedFragrance3)?.displayName : '';

      // Get emphasized fragrance
      let emphasizedFragDisplay = '';
      if (r.emphasizedFragrance === 1 && r.selectedFragrance1) {
        emphasizedFragDisplay = fragrances.find(f => f.id === r.selectedFragrance1)?.displayName || '';
      } else if (r.emphasizedFragrance === 2 && r.selectedFragrance2) {
        emphasizedFragDisplay = fragrances.find(f => f.id === r.selectedFragrance2)?.displayName || '';
      } else if (r.emphasizedFragrance === 3 && r.selectedFragrance3) {
        emphasizedFragDisplay = fragrances.find(f => f.id === r.selectedFragrance3)?.displayName || '';
      }

      const allData: Record<string, string | number> = {
        id: r.id,
        age: r.age,
        gender: r.gender || '',
        fragranceId: r.selectedFragranceId,
        fragranceDisplay: fragrance?.displayName || '',
        mainNote,
        season: r.season,
        musicGenre: r.musicGenre,
        ratio: r.fragranceRatio || '',
        emphasized: emphasizedFragDisplay,
        satisfaction: r.satisfaction || '',
        ex1: frag1 || '',
        ex2: frag2 || '',
        ex3: frag3 || '',
        timestamp: date,
      };

      return activeColumns.map(col => allData[col]);
    });

    // CSV 문자열 생성
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // BOM 추가 (한글 깨짐 방지)
    const bom = '\uFEFF';
    const csvBlob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acscent-survey-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-4xl font-light tracking-wider text-black mb-3">Admin Dashboard</h1>
            <div className="h-px bg-black w-16"></div>
            <p className="text-sm tracking-wider text-gray-600 mt-4">Total Responses: {responses.length}</p>
          </div>
          <div className="flex gap-3 relative">
            <div className="relative column-selector-wrapper">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="px-6 py-3 border border-gray-400 text-black text-xs tracking-wider hover:border-black transition-colors uppercase"
              >
                Select Columns
              </button>

              {showColumnSelector && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 shadow-lg p-6 z-10 w-80">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold tracking-wider text-black uppercase">컬럼 선택</h3>
                    <button
                      onClick={() => setShowColumnSelector(false)}
                      className="text-gray-400 hover:text-black text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.entries(columnLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedColumns[key]}
                          onChange={(e) => setSelectedColumns({
                            ...selectedColumns,
                            [key]: e.target.checked
                          })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-black tracking-wide">{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const allSelected: Record<string, boolean> = {};
                        Object.keys(columnLabels).forEach(key => {
                          allSelected[key] = true;
                        });
                        setSelectedColumns(allSelected);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 text-black text-xs tracking-wider hover:border-black transition-colors"
                    >
                      전체 선택
                    </button>
                    <button
                      onClick={() => {
                        const allDeselected: Record<string, boolean> = {};
                        Object.keys(columnLabels).forEach(key => {
                          allDeselected[key] = false;
                        });
                        setSelectedColumns(allDeselected);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 text-black text-xs tracking-wider hover:border-black transition-colors"
                    >
                      전체 해제
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={downloadData}
              className="px-6 py-3 border border-black text-black text-xs tracking-wider hover:bg-black hover:text-white transition-colors uppercase"
            >
              Download Data
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-black text-white text-xs tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Survey Page
            </button>
          </div>
        </div>

        {/* Age Filter */}
        <div className="bg-white border border-gray-200 p-8 mb-8">
          <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Age Filter</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedAgeGroup('all')}
              className={`px-6 py-2 text-xs tracking-wider transition-all uppercase ${
                selectedAgeGroup === 'all'
                  ? 'bg-black text-white'
                  : 'border border-gray-300 text-black hover:border-black'
              }`}
            >
              All
            </button>
            {ageGroups.map(group => (
              <button
                key={group}
                onClick={() => setSelectedAgeGroup(group)}
                className={`px-6 py-2 text-xs tracking-wider transition-all uppercase ${
                  selectedAgeGroup === group
                    ? 'bg-black text-white'
                    : 'border border-gray-300 text-black hover:border-black'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 tracking-wider">
            Filtered: {filteredResponses.length} responses
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs tracking-wider text-gray-400 mb-2 uppercase">Total</p>
            <p className="text-4xl font-light text-black">{responses.length}</p>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs tracking-wider text-gray-400 mb-2 uppercase">Avg Age</p>
            <p className="text-4xl font-light text-black">
              {responses.length > 0
                ? (responses.reduce((sum, r) => sum + r.age, 0) / responses.length).toFixed(1)
                : '0'}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs tracking-wider text-gray-400 mb-2 uppercase">Gender Ratio</p>
            <div className="flex items-baseline gap-3">
              <p className="text-2xl font-light text-black">
                남 {filteredResponses.length > 0 ? ((genderStats['남성'] / filteredResponses.length) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-2xl font-light text-black">
                여 {filteredResponses.length > 0 ? ((genderStats['여성'] / filteredResponses.length) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs tracking-wider text-gray-400 mb-2 uppercase">Satisfaction</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-light text-black">{avgSatisfaction}</p>
              <p className="text-sm text-gray-400">/ 5</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs tracking-wider text-gray-400 mb-2 uppercase">Top Scent</p>
            <p className="text-sm font-light text-black tracking-wide">
              {fragranceStats[0]?.displayName || '-'}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs tracking-wider text-gray-400 mb-2 uppercase">Top Genre</p>
            <p className="text-sm font-light text-black tracking-wide">
              {genreStats[0]?.genre || '-'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fragrance Preferences */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">
              {selectedAgeGroup === 'all' ? 'All' : selectedAgeGroup} / Scent Preferences
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {fragranceStats.slice(0, 15).map((frag, idx) => (
                <div key={frag.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs text-gray-400 w-6">{idx + 1}</span>
                      <span className="text-sm text-black font-semibold tracking-wide">{frag.displayName}</span>
                    </div>
                    <span className="text-xs text-gray-500">{frag.count} ({frag.percentage}%)</span>
                  </div>
                  <div className="bg-gray-100 h-px">
                    <div
                      className="bg-black h-px transition-all"
                      style={{ width: `${frag.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Music Genre */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">
              {selectedAgeGroup === 'all' ? 'All' : selectedAgeGroup} / Music Genres
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {genreStats.map((genre, idx) => (
                <div key={genre.genre}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs text-gray-400 w-6">{idx + 1}</span>
                      <span className="text-sm text-black font-semibold tracking-wide">{genre.genre}</span>
                    </div>
                    <span className="text-xs text-gray-500">{genre.count} ({genre.percentage}%)</span>
                  </div>
                  <div className="bg-gray-100 h-px">
                    <div
                      className="bg-black h-px transition-all"
                      style={{ width: `${genre.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Season Preferences */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Seasonal</h2>
            <div className="space-y-6">
              {Object.entries(seasonStats).map(([season, count]) => {
                const percentage = filteredResponses.length > 0
                  ? (count / filteredResponses.length * 100).toFixed(1)
                  : '0';
                return (
                  <div key={season}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-black font-semibold tracking-wide">{season}</span>
                      <span className="text-xs text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="bg-gray-100 h-px">
                      <div
                        className="bg-black h-px"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age Distribution */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Age Distribution</h2>
            <div className="space-y-6">
              {ageGroupStats.map(stat => (
                <div key={stat.group}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-black font-semibold tracking-wide">{stat.group}</span>
                    <span className="text-xs text-gray-500">{stat.count} (avg: {stat.avgAge})</span>
                  </div>
                  <div className="bg-gray-100 h-px">
                    <div
                      className="bg-black h-px"
                      style={{
                        width: `${responses.length > 0 ? (stat.count / responses.length * 100) : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fragrance Ratio */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Fragrance Ratio</h2>
            <div className="space-y-6">
              {Object.entries(ratioStats).map(([ratio, count]) => {
                const percentage = filteredResponses.length > 0
                  ? (count / filteredResponses.length * 100).toFixed(1)
                  : '0';
                return (
                  <div key={ratio}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-black font-semibold tracking-wide">{ratio}</span>
                      <span className="text-xs text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="bg-gray-100 h-px">
                      <div
                        className="bg-black h-px"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emphasized Scents */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Emphasized Scents</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {emphasizedStats.slice(0, 15).map((frag, idx) => (
                <div key={frag.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs text-gray-400 w-6">{idx + 1}</span>
                      <span className="text-sm text-black font-semibold tracking-wide">{frag.displayName}</span>
                    </div>
                    <span className="text-xs text-gray-500">{frag.count} ({frag.percentage}%)</span>
                  </div>
                  <div className="bg-gray-100 h-px">
                    <div
                      className="bg-black h-px transition-all"
                      style={{ width: `${frag.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction Distribution */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Satisfaction Rating</h2>
            <div className="space-y-6">
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-3xl font-light text-black">{avgSatisfaction}</p>
                <p className="text-sm text-gray-500">평균 / {satisfactionResponses.length}명 평가</p>
              </div>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = satisfactionStats[rating as keyof typeof satisfactionStats];
                const percentage = satisfactionResponses.length > 0
                  ? ((count / satisfactionResponses.length) * 100).toFixed(1)
                  : '0';
                return (
                  <div key={rating}>
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black font-semibold tracking-wide">{rating}★</span>
                      </div>
                      <span className="text-xs text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="bg-gray-100 h-px">
                      <div
                        className="bg-black h-px"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cross Analysis */}
          <div className="bg-white border border-gray-200 p-8 lg:col-span-2">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Scent × Genre Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-xs tracking-wider text-gray-400 font-normal uppercase">Scent</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider text-gray-400 font-normal uppercase">Top 1</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider text-gray-400 font-normal uppercase">Top 2</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider text-gray-400 font-normal uppercase">Top 3</th>
                  </tr>
                </thead>
                <tbody>
                  {fragranceGenreMatrix.map(item => (
                    <tr key={item.fragrance} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-sm text-black font-semibold tracking-wide">{item.fragrance}</td>
                      <td className="py-4 px-4 text-xs text-gray-600">
                        {item.topGenres[0] ? `${item.topGenres[0].genre} (${item.topGenres[0].count})` : '-'}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600">
                        {item.topGenres[1] ? `${item.topGenres[1].genre} (${item.topGenres[1].count})` : '-'}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600">
                        {item.topGenres[2] ? `${item.topGenres[2].genre} (${item.topGenres[2].count})` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Research Insights */}
          <div className="bg-white border border-gray-200 p-8 lg:col-span-2">
            <h2 className="text-lg font-semibold tracking-wider text-black mb-6 uppercase">Research Insights</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                • 나이대별 향료 선호도의 차이를 분석하여 세대별 후각 취향 연구 가능
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                • 음악 장르와 향료 선호도의 상관관계를 통해 감각 간 연결성 탐구 가능
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                • 계절별 선호도 데이터로 시간적 요인이 후각 선택에 미치는 영향 분석 가능
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                • 향료-음악 교차 데이터로 라이프스타일과 감각 선호도 패턴 도출 가능
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
