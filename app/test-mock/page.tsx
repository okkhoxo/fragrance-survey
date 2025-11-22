'use client';

import { generateMockData } from '@/lib/utils/generateMockData';
import { useRouter } from 'next/navigation';

export default function TestMockPage() {
  const router = useRouter();

  const handleClearAndRegenerate = () => {
    try {
      console.log('Clearing old data...');
      try {
        localStorage.clear();
      } catch (e) {
        console.warn('localStorage not available:', e);
      }

      console.log('Starting archive data generation...');
      const data = generateMockData();
      console.log('Generated data:', data);
      console.log('Total count:', data.length);

      // Save to localStorage
      console.log('Saving to localStorage...');
      try {
        localStorage.setItem('surveyResponses', JSON.stringify(data));
      } catch (e) {
        console.warn('localStorage not available:', e);
        alert('localStorage를 사용할 수 없습니다 (사파리 프라이빗 모드?). 데이터가 메모리에만 저장됩니다.');
      }

      // Calculate statistics
      const jsonString = JSON.stringify(data);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

      const avgAge = data.reduce((sum, item) => sum + item.age, 0) / data.length;
      const satisfactionData = data.filter(item => item.satisfaction);
      const avgSatisfaction = satisfactionData.reduce((sum, item) => sum + (item.satisfaction || 0), 0) / satisfactionData.length;

      // Gender statistics
      const maleCount = data.filter(item => item.gender === '남성').length;
      const femaleCount = data.filter(item => item.gender === '여성').length;
      const malePercent = ((maleCount / data.length) * 100).toFixed(1);
      const femalePercent = ((femaleCount / data.length) * 100).toFixed(1);

      console.log('Estimated size:', sizeInKB, 'KB', '(' + sizeInMB, 'MB)');
      console.log('Average age:', avgAge.toFixed(2));
      console.log('Average satisfaction:', avgSatisfaction.toFixed(2));
      console.log('Gender ratio - Male:', malePercent + '%, Female:', femalePercent + '%');
      console.log('First item:', data[0]);
      console.log('Last item:', data[data.length - 1]);

      alert(`데이터 생성 완료!\n\n총 ${data.length}개 생성\n크기: ${sizeInKB} KB (${sizeInMB} MB)\n평균 나이: ${avgAge.toFixed(1)}세\n평균 만족도: ${avgSatisfaction.toFixed(2)}점\n성별 비율: 남 ${malePercent}% / 여 ${femalePercent}%\n\n어드민 페이지로 이동합니다.`);

      // Navigate to admin page
      router.push('/admin');
    } catch (error) {
      console.error('Error generating archive data:', error);
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">데이터 초기화 및 재생성</h1>
        <p className="text-sm text-gray-600">
          기존 데이터를 모두 삭제하고 새로운 데이터를 생성합니다.
        </p>
        <button
          onClick={handleClearAndRegenerate}
          className="px-8 py-4 bg-black text-white text-lg hover:bg-gray-800 transition-colors"
        >
          Clear & Regenerate Data
        </button>
        <p className="text-xs text-gray-500">
          약 12,925개의 데이터가 생성되며, 성별 비율은 남 38% / 여 62%로 설정됩니다.
        </p>
      </div>
    </div>
  );
}
