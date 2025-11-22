'use client';

import { useState } from 'react';
import { fragrancesByExhibition, fragrances } from '@/lib/data/fragrances';
import { musicGenres } from '@/lib/data/fragrances';
import { useRouter } from 'next/navigation';

type Step = 'cover' | 'ex1-intro' | 'ex1-fragrance' | 'ex2-intro' | 'ex2-fragrance' | 'ex3-intro' | 'ex3-fragrance' | 'ratio-selection' | 'submitted';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('cover');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'남성' | '여성' | ''>('');
  const [musicGenre1, setMusicGenre1] = useState<string>('');
  const [musicGenre2, setMusicGenre2] = useState<string>('');
  const [musicGenre3, setMusicGenre3] = useState<string>('');
  const [selectedFragrance1, setSelectedFragrance1] = useState<number | null>(null);
  const [selectedFragrance2, setSelectedFragrance2] = useState<number | null>(null);
  const [selectedFragrance3, setSelectedFragrance3] = useState<number | null>(null);
  const [fragranceRatio, setFragranceRatio] = useState<'60/20/20' | '40/30/30'>('60/20/20');
  const [emphasizedFragrance, setEmphasizedFragrance] = useState<1 | 2 | 3>(1);
  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [hoverStar, setHoverStar] = useState<number>(0);

  const handleSubmit = () => {
    const responses = [];

    // Get the emphasized fragrance's season
    let emphasizedSeason = '';
    if (emphasizedFragrance === 1 && selectedFragrance1) {
      const frag = fragrances.find(f => f.id === selectedFragrance1);
      emphasizedSeason = frag?.seasonLabel || '';
    } else if (emphasizedFragrance === 2 && selectedFragrance2) {
      const frag = fragrances.find(f => f.id === selectedFragrance2);
      emphasizedSeason = frag?.seasonLabel || '';
    } else if (emphasizedFragrance === 3 && selectedFragrance3) {
      const frag = fragrances.find(f => f.id === selectedFragrance3);
      emphasizedSeason = frag?.seasonLabel || '';
    }

    if (selectedFragrance1) {
      const fragrance = fragrancesByExhibition[1].find(f => f.id === selectedFragrance1);
      responses.push({
        id: Date.now().toString() + '-1',
        age: parseInt(age),
        gender: gender as '남성' | '여성',
        selectedFragranceId: selectedFragrance1,
        fragranceName: fragrance?.name || '',
        season: emphasizedSeason,
        musicGenre: musicGenre1,
        fragranceRatio,
        emphasizedFragrance,
        selectedFragrance1,
        selectedFragrance2: selectedFragrance2 || undefined,
        selectedFragrance3: selectedFragrance3 || undefined,
        satisfaction: satisfaction > 0 ? (satisfaction as 1 | 2 | 3 | 4 | 5) : undefined,
        timestamp: Date.now(),
      });
    }

    if (selectedFragrance2) {
      const fragrance = fragrancesByExhibition[2].find(f => f.id === selectedFragrance2);
      responses.push({
        id: Date.now().toString() + '-2',
        age: parseInt(age),
        gender: gender as '남성' | '여성',
        selectedFragranceId: selectedFragrance2,
        fragranceName: fragrance?.name || '',
        season: emphasizedSeason,
        musicGenre: musicGenre2,
        fragranceRatio,
        emphasizedFragrance,
        selectedFragrance1: selectedFragrance1 || undefined,
        selectedFragrance2,
        selectedFragrance3: selectedFragrance3 || undefined,
        satisfaction: satisfaction > 0 ? (satisfaction as 1 | 2 | 3 | 4 | 5) : undefined,
        timestamp: Date.now(),
      });
    }

    if (selectedFragrance3) {
      const fragrance = fragrancesByExhibition[3].find(f => f.id === selectedFragrance3);
      responses.push({
        id: Date.now().toString() + '-3',
        age: parseInt(age),
        gender: gender as '남성' | '여성',
        selectedFragranceId: selectedFragrance3,
        fragranceName: fragrance?.name || '',
        season: emphasizedSeason,
        musicGenre: musicGenre3,
        fragranceRatio,
        emphasizedFragrance,
        selectedFragrance1: selectedFragrance1 || undefined,
        selectedFragrance2: selectedFragrance2 || undefined,
        selectedFragrance3,
        satisfaction: satisfaction > 0 ? (satisfaction as 1 | 2 | 3 | 4 | 5) : undefined,
        timestamp: Date.now(),
      });
    }

    // 로컬 스토리지에 저장
    const existingResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    localStorage.setItem('surveyResponses', JSON.stringify([...existingResponses, ...responses]));

    setStep('submitted');
  };

  // Cover Page
  if (step === 'cover') {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-light tracking-wider text-black">
                AC'SCENT
              </h1>
              <div className="h-px bg-black w-24 mx-auto"></div>
              <p className="text-sm tracking-[0.3em] text-black uppercase">
                Sinchon
              </p>
            </div>

            <div className="space-y-8 mt-16">
              <p className="text-lg text-black tracking-wider uppercase font-light max-w-2xl mx-auto leading-relaxed">
                Sound Visualization Media Art Perfumery Exhibition
              </p>
              <p className="text-xs text-gray-600 tracking-wide">
                사운드비주얼라이제이션 미디어아트 조향 전시관
              </p>

              <div className="space-y-4">
                <label className="block text-xs tracking-wider text-black uppercase">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="00"
                  min="1"
                  max="120"
                  className="w-32 mx-auto block text-center px-4 py-3 bg-transparent border-b border-black text-black focus:outline-none text-lg"
                  required
                />
              </div>

              <div className="space-y-4 mt-8">
                <label className="block text-xs tracking-wider text-black uppercase">
                  Gender
                </label>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setGender('남성')}
                    className={`px-8 py-3 border text-sm tracking-wider transition-colors uppercase ${
                      gender === '남성'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-400 text-black hover:border-black'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setGender('여성')}
                    className={`px-8 py-3 border text-sm tracking-wider transition-colors uppercase ${
                      gender === '여성'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-400 text-black hover:border-black'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!age) {
                    alert('나이를 입력해주세요');
                  } else if (!gender) {
                    alert('성별을 선택해주세요');
                  } else {
                    setStep('ex1-intro');
                  }
                }}
                className="mt-12 px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exhibition 1 Intro
  if (step === 'ex1-intro') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-16">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <p className="text-sm tracking-[0.3em] text-gray-400">EXHIBITION</p>
              <h2 className="text-7xl font-light text-black">01</h2>
              <div className="h-px bg-black w-16 mx-auto mt-4"></div>
              <p className="text-2xl font-light tracking-wider text-black mt-6">개화</p>
            </div>

            <p className="text-base text-black leading-relaxed max-w-lg mx-auto mt-8">
              첫 인상의 순간,<br/>
              당신을 정의하는 가장 강렬한 감각.<br/>
              꽃이 피어나는 그 찰나의 향기처럼<br/>
              <span className="text-sm text-gray-500 mt-2 block">TOP Note</span>
            </p>
          </div>

          <div className="space-y-6">
            <label className="block text-xs tracking-wider text-black uppercase text-center">
              Music Genre
            </label>
            <select
              value={musicGenre1}
              onChange={(e) => setMusicGenre1(e.target.value)}
              className="w-full max-w-xs mx-auto block px-6 py-4 bg-transparent border border-black text-black focus:outline-none text-sm"
              required
            >
              <option value="">Select</option>
              {musicGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (musicGenre1) setStep('ex1-fragrance');
                else alert('음악 장르를 선택해주세요');
              }}
              className="px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exhibition 1 Fragrance
  if (step === 'ex1-fragrance') {
    return (
      <div className="min-h-screen bg-[#F5F5F0] p-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-gray-400 mb-2">EXHIBITION 01</p>
            <h3 className="text-2xl font-light text-black tracking-wider">Select Your Scent</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {fragrancesByExhibition[1].map(fragrance => (
              <button
                key={fragrance.id}
                onClick={() => setSelectedFragrance1(fragrance.id)}
                className={`aspect-square border transition-all ${
                  selectedFragrance1 === fragrance.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full p-4">
                  {selectedFragrance1 === fragrance.id ? (
                    <div className="space-y-3 text-center">
                      <p className="text-xs tracking-wider">{fragrance.displayName}</p>
                      <div className="space-y-1">
                        {fragrance.notes.map((note, idx) => (
                          <p key={idx} className="text-[10px] text-gray-300 tracking-wide">{note}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs tracking-wider">{fragrance.displayName}</p>
                      <p className="text-[10px] text-gray-500">#{fragrance.id.toString().padStart(2, '0')}</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (selectedFragrance1) setStep('ex2-intro');
                else alert('향료를 선택해주세요');
              }}
              className="px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Next Exhibition
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exhibition 2 Intro
  if (step === 'ex2-intro') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-16">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <p className="text-sm tracking-[0.3em] text-gray-400">EXHIBITION</p>
              <h2 className="text-7xl font-light text-black">02</h2>
              <div className="h-px bg-black w-16 mx-auto mt-4"></div>
              <p className="text-2xl font-light tracking-wider text-black mt-6">기둥</p>
            </div>

            <p className="text-base text-black leading-relaxed max-w-lg mx-auto mt-8">
              시간이 쌓여 만든 당신의 본질.<br/>
              경험이 응축되어 형성된<br/>
              흔들리지 않는 중심의 향기<br/>
              <span className="text-sm text-gray-500 mt-2 block">MIDDLE Note</span>
            </p>
          </div>

          <div className="space-y-6">
            <label className="block text-xs tracking-wider text-black uppercase text-center">
              Music Genre
            </label>
            <select
              value={musicGenre2}
              onChange={(e) => setMusicGenre2(e.target.value)}
              className="w-full max-w-xs mx-auto block px-6 py-4 bg-transparent border border-black text-black focus:outline-none text-sm"
              required
            >
              <option value="">Select</option>
              {musicGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (musicGenre2) setStep('ex2-fragrance');
                else alert('음악 장르를 선택해주세요');
              }}
              className="px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exhibition 2 Fragrance
  if (step === 'ex2-fragrance') {
    return (
      <div className="min-h-screen bg-[#F5F5F0] p-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-gray-400 mb-2">EXHIBITION 02</p>
            <h3 className="text-2xl font-light text-black tracking-wider">Select Your Scent</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {fragrancesByExhibition[2].map(fragrance => (
              <button
                key={fragrance.id}
                onClick={() => setSelectedFragrance2(fragrance.id)}
                className={`aspect-square border transition-all ${
                  selectedFragrance2 === fragrance.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full p-4">
                  {selectedFragrance2 === fragrance.id ? (
                    <div className="space-y-3 text-center">
                      <p className="text-xs tracking-wider">{fragrance.displayName}</p>
                      <div className="space-y-1">
                        {fragrance.notes.map((note, idx) => (
                          <p key={idx} className="text-[10px] text-gray-300 tracking-wide">{note}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs tracking-wider">{fragrance.displayName}</p>
                      <p className="text-[10px] text-gray-500">#{fragrance.id.toString().padStart(2, '0')}</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (selectedFragrance2) setStep('ex3-intro');
                else alert('향료를 선택해주세요');
              }}
              className="px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Next Exhibition
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exhibition 3 Intro
  if (step === 'ex3-intro') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-16">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <p className="text-sm tracking-[0.3em] text-gray-400">EXHIBITION</p>
              <h2 className="text-7xl font-light text-black">03</h2>
              <div className="h-px bg-black w-16 mx-auto mt-4"></div>
              <p className="text-2xl font-light tracking-wider text-black mt-6">뿌리</p>
            </div>

            <p className="text-base text-black leading-relaxed max-w-lg mx-auto mt-8">
              가장 깊은 곳에 남는 여운.<br/>
              시간이 흘러도 지워지지 않을<br/>
              당신만의 흔적과 기억<br/>
              <span className="text-sm text-gray-500 mt-2 block">BASE Note</span>
            </p>
          </div>

          <div className="space-y-6">
            <label className="block text-xs tracking-wider text-black uppercase text-center">
              Music Genre
            </label>
            <select
              value={musicGenre3}
              onChange={(e) => setMusicGenre3(e.target.value)}
              className="w-full max-w-xs mx-auto block px-6 py-4 bg-transparent border border-black text-black focus:outline-none text-sm"
              required
            >
              <option value="">Select</option>
              {musicGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (musicGenre3) setStep('ex3-fragrance');
                else alert('음악 장르를 선택해주세요');
              }}
              className="px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exhibition 3 Fragrance
  if (step === 'ex3-fragrance') {
    return (
      <div className="min-h-screen bg-[#F5F5F0] p-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-gray-400 mb-2">EXHIBITION 03</p>
            <h3 className="text-2xl font-light text-black tracking-wider">Select Your Scent</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {fragrancesByExhibition[3].map(fragrance => (
              <button
                key={fragrance.id}
                onClick={() => setSelectedFragrance3(fragrance.id)}
                className={`aspect-square border transition-all ${
                  selectedFragrance3 === fragrance.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full p-4">
                  {selectedFragrance3 === fragrance.id ? (
                    <div className="space-y-3 text-center">
                      <p className="text-xs tracking-wider">{fragrance.displayName}</p>
                      <div className="space-y-1">
                        {fragrance.notes.map((note, idx) => (
                          <p key={idx} className="text-[10px] text-gray-300 tracking-wide">{note}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs tracking-wider">{fragrance.displayName}</p>
                      <p className="text-[10px] text-gray-500">#{fragrance.id.toString().padStart(2, '0')}</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (selectedFragrance3) setStep('ratio-selection');
                else alert('향료를 선택해주세요');
              }}
              className="px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ratio Selection
  if (step === 'ratio-selection') {
    const frag1 = fragrances.find(f => f.id === selectedFragrance1);
    const frag2 = fragrances.find(f => f.id === selectedFragrance2);
    const frag3 = fragrances.find(f => f.id === selectedFragrance3);

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-light text-black tracking-wider">Your Selection</h2>
              <div className="h-px bg-black w-24 mx-auto"></div>
            </div>

            {/* Emphasis Selection */}
            <div className="space-y-6 mt-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-light tracking-wider text-black">Emphasized Scent</h3>
                <p className="text-xs text-gray-500 tracking-wide">강조하고 싶은 향을 선택해주세요</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {frag1 && (
                  <button
                    onClick={() => setEmphasizedFragrance(1)}
                    className={`border p-8 transition-all ${
                      emphasizedFragrance === 1
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-black hover:border-black'
                    }`}
                  >
                    <p className={`text-xs tracking-wider mb-2 ${emphasizedFragrance === 1 ? 'text-gray-300' : 'text-gray-400'}`}>
                      EXHIBITION 01
                    </p>
                    <p className="text-lg font-light tracking-wide">{frag1.displayName}</p>
                    <div className={`h-px w-12 mx-auto my-4 ${emphasizedFragrance === 1 ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="space-y-1">
                      {frag1.notes.map((note, idx) => (
                        <p key={idx} className={`text-xs ${emphasizedFragrance === 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                          {note}
                        </p>
                      ))}
                    </div>
                    {emphasizedFragrance === 1 && (
                      <div className="mt-4">
                        <p className="text-[10px] tracking-wider">✓ EMPHASIZED</p>
                      </div>
                    )}
                  </button>
                )}
                {frag2 && (
                  <button
                    onClick={() => setEmphasizedFragrance(2)}
                    className={`border p-8 transition-all ${
                      emphasizedFragrance === 2
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-black hover:border-black'
                    }`}
                  >
                    <p className={`text-xs tracking-wider mb-2 ${emphasizedFragrance === 2 ? 'text-gray-300' : 'text-gray-400'}`}>
                      EXHIBITION 02
                    </p>
                    <p className="text-lg font-light tracking-wide">{frag2.displayName}</p>
                    <div className={`h-px w-12 mx-auto my-4 ${emphasizedFragrance === 2 ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="space-y-1">
                      {frag2.notes.map((note, idx) => (
                        <p key={idx} className={`text-xs ${emphasizedFragrance === 2 ? 'text-gray-300' : 'text-gray-600'}`}>
                          {note}
                        </p>
                      ))}
                    </div>
                    {emphasizedFragrance === 2 && (
                      <div className="mt-4">
                        <p className="text-[10px] tracking-wider">✓ EMPHASIZED</p>
                      </div>
                    )}
                  </button>
                )}
                {frag3 && (
                  <button
                    onClick={() => setEmphasizedFragrance(3)}
                    className={`border p-8 transition-all ${
                      emphasizedFragrance === 3
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-black hover:border-black'
                    }`}
                  >
                    <p className={`text-xs tracking-wider mb-2 ${emphasizedFragrance === 3 ? 'text-gray-300' : 'text-gray-400'}`}>
                      EXHIBITION 03
                    </p>
                    <p className="text-lg font-light tracking-wide">{frag3.displayName}</p>
                    <div className={`h-px w-12 mx-auto my-4 ${emphasizedFragrance === 3 ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="space-y-1">
                      {frag3.notes.map((note, idx) => (
                        <p key={idx} className={`text-xs ${emphasizedFragrance === 3 ? 'text-gray-300' : 'text-gray-600'}`}>
                          {note}
                        </p>
                      ))}
                    </div>
                    {emphasizedFragrance === 3 && (
                      <div className="mt-4">
                        <p className="text-[10px] tracking-wider">✓ EMPHASIZED</p>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ratio Selection */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-light tracking-wider text-black mb-2">Fragrance Ratio</h3>
              <p className="text-xs text-gray-500 tracking-wide">향료 배합 비율을 선택해주세요</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => setFragranceRatio('60/20/20')}
                className={`flex-1 md:flex-none px-12 py-6 border transition-all ${
                  fragranceRatio === '60/20/20'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-black hover:border-black'
                }`}
              >
                <div className="space-y-2">
                  <p className="text-2xl font-light tracking-wider">60 / 20 / 20</p>
                  <p className="text-[10px] tracking-wider opacity-70">6g, 2g, 2g</p>
                </div>
              </button>

              <button
                onClick={() => setFragranceRatio('40/30/30')}
                className={`flex-1 md:flex-none px-12 py-6 border transition-all ${
                  fragranceRatio === '40/30/30'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-black hover:border-black'
                }`}
              >
                <div className="space-y-2">
                  <p className="text-2xl font-light tracking-wider">40 / 30 / 30</p>
                  <p className="text-[10px] tracking-wider opacity-70">4g, 3g, 3g</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-12 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Submitted
  if (step === 'submitted') {
    const handleSatisfactionSubmit = (rating: number) => {
      // Update all responses with satisfaction
      const existingResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
      const updatedResponses = existingResponses.map((r: any) => {
        // Update only the responses from this session (last 3 responses)
        const isRecentResponse = existingResponses.indexOf(r) >= existingResponses.length - 3;
        if (isRecentResponse) {
          return { ...r, satisfaction: rating as 1 | 2 | 3 | 4 | 5 };
        }
        return r;
      });
      localStorage.setItem('surveyResponses', JSON.stringify(updatedResponses));
    };

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="space-y-6">
            <div className="h-px bg-black w-24 mx-auto"></div>
            <h2 className="text-5xl font-light text-black tracking-wider">Thank You</h2>
            <div className="h-px bg-black w-24 mx-auto"></div>
          </div>

          <p className="text-base text-black leading-relaxed">
            방문해 주셔서 감사합니다<br/><br/>
            오늘 만든 향을 맡으실 때마다<br/>
            이 순간이 기억되길 바랍니다
          </p>

          {/* Satisfaction Rating */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg font-light tracking-wider text-black">전시 만족도</p>
              <p className="text-xs text-gray-500 tracking-wide">How was your experience?</p>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setSatisfaction(star);
                    handleSatisfactionSubmit(star);
                  }}
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    fill={(hoverStar || satisfaction) >= star ? '#000000' : 'none'}
                    stroke="#000000"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>

            {satisfaction > 0 && (
              <p className="text-sm text-gray-600 tracking-wide">
                평가해 주셔서 감사합니다
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setStep('cover');
              setAge('');
              setGender('');
              setMusicGenre1('');
              setMusicGenre2('');
              setMusicGenre3('');
              setSelectedFragrance1(null);
              setSelectedFragrance2(null);
              setSelectedFragrance3(null);
              setFragranceRatio('60/20/20');
              setEmphasizedFragrance(1);
              setSatisfaction(0);
              setHoverStar(0);
            }}
            className="px-12 py-4 border border-black text-black text-sm tracking-wider hover:bg-black hover:text-white transition-colors uppercase"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return null;
}
