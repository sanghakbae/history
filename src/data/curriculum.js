const gradeColors = {
  m1: '#20c997',
  m2: '#4dabf7',
  m3: '#ffd43b',
  h1: '#ff922b',
  h2: '#845ef7',
  h3: '#f06595',
};

const r2PublicUrl = (import.meta.env?.VITE_CLOUDFLARE_R2_PUBLIC_URL || '').replace(/\/$/, '');

const assetCatalog = {
  seed: [{ file: 'comb-pattern-pottery.webp', label: '빗살무늬 토기와 신석기 생활' }],
  river: [{ file: 'river-civilizations-map.webp', label: '큰 강 유역 문명 지도' }],
  bronze: [{ file: 'dolmen-bronze-tools.webp', label: '고인돌과 청동기 유물' }],
  three: [{ file: 'three-kingdoms-map.webp', label: '삼국의 성장 지도' }],
  gaya: [{ file: 'gaya-iron-route.webp', label: '가야 철 생산과 교역' }],
  unified: [{ file: 'silla-balhae-map.webp', label: '남북국 시대 지도' }],
  culture: [{ file: 'seokguram-bulguksa.webp', label: '석굴암과 불국사' }],
  empire: [{ file: 'ancient-empires-map.webp', label: '고대 세계 제국 지도' }],
  diplomacy: [{ file: 'goryeo-foreign-relations.webp', label: '고려의 대외 관계' }],
  celadon: [{ file: 'goryeo-celadon.webp', label: '고려청자' }],
  hangul: [{ file: 'hunminjeongeum.webp', label: '훈민정음' }],
  invasion: [{ file: 'joseon-invasions-map.webp', label: '왜란과 호란의 전개' }],
  openport: [{ file: 'ganghwa-treaty-map.webp', label: '개항과 강화도 조약' }],
  colonial: [{ file: 'japanese-rule-timeline.webp', label: '일제 통치 방식 변화' }],
  independence: [{ file: 'march-first-movement.webp', label: '3·1 운동과 임시정부' }],
  koreanwar: [{ file: 'korean-war-map.webp', label: '6·25 전쟁 전개' }],
  democracy: [{ file: 'democratization-timeline.webp', label: '민주화 운동 연표' }],
  ocean: [{ file: 'age-of-exploration-map.webp', label: '대항해 시대 교역망' }],
  revolution: [{ file: 'citizen-revolutions-timeline.webp', label: '시민 혁명 연표' }],
  industry: [{ file: 'industrial-revolution.webp', label: '산업 혁명과 도시화' }],
  worldwar: [{ file: 'world-war-map.webp', label: '세계 대전 전개 지도' }],
  coldwar: [{ file: 'cold-war-blocs-map.webp', label: '냉전 진영 지도' }],
  examancient: [{ file: 'exam-ancient-artifacts.webp', label: '선사~고대 빈출 유물' }],
  exammodern: [{ file: 'exam-modern-timeline.webp', label: '근대 개혁 연표' }],
  exammodernkorea: [{ file: 'exam-modern-korea-timeline.webp', label: '현대사 핵심 연표' }],
};

const rawCurriculum = [
  {
    id: 'm1',
    label: '중1',
    course: '문명과 고대 세계',
    era: '역사의 의미, 선사, 고대 국가, 세계 문명',
    progress: 72,
    units: [
      ['자료와 역사 해석', '자료가 만들어진 시기와 관점을 따져 사실과 해석을 구분한다.', 'history'],
      ['선사 문화와 농경', '농경과 정착 생활이 사회 구조를 바꾸는 흐름을 이해한다.', 'seed'],
      ['문명의 발생', '큰 강 유역 문명의 공통 조건과 차이를 비교한다.', 'river'],
      ['고조선과 여러 나라', '청동기 문화와 초기 국가의 성립 과정을 파악한다.', 'bronze'],
      ['삼국의 성장', '고구려, 백제, 신라의 성장 기반과 경쟁 양상을 비교한다.', 'three'],
      ['가야와 삼국 경쟁', '가야의 철 생산과 삼국 사이 세력 균형을 함께 정리한다.', 'gaya'],
      ['통일 신라와 발해', '남북국의 정치와 문화적 특징을 함께 정리한다.', 'unified'],
      ['고대 문화 교류', '불교, 유학, 문자 문화가 동아시아에 확산된 양상을 읽는다.', 'culture'],
      ['고대 세계 제국', '페르시아, 진, 한, 로마 제국의 통치 방식을 비교한다.', 'empire'],
      ['동아시아 고대 교류', '한국 고대 국가와 중국, 일본 사이의 문화 교류를 파악한다.', 'ancientexchange'],
    ],
  },
  {
    id: 'm2',
    label: '중2',
    course: '중세와 지역 세계',
    era: '고려, 조선 전기, 동아시아와 유럽의 변화',
    progress: 58,
    units: [
      ['고려의 성립과 변화', '호족, 문벌, 무신 정권, 권문세족으로 이어지는 권력 변동을 설명한다.', 'goryeo'],
      ['고려 대외 관계', '거란, 여진, 몽골과의 관계 속에서 고려의 대응을 비교한다.', 'diplomacy'],
      ['고려 사회와 문화', '불교, 유교, 인쇄술, 공예를 사회 배경과 연결한다.', 'celadon'],
      ['몽골 간섭과 개혁', '원 간섭기 변화와 공민왕 개혁의 방향을 구분한다.', 'mongolreform'],
      ['조선의 건국과 통치', '성리학 국가의 통치 체제와 중앙·지방 제도를 파악한다.', 'joseon'],
      ['조선 전기 문화', '훈민정음, 과학 기술, 농업 정책의 의미를 읽는다.', 'hangul'],
      ['사림과 붕당 정치', '사림의 성장과 붕당 정치의 전개를 정치 운영 변화로 이해한다.', 'bungdang'],
      ['왜란과 호란', '임진왜란과 병자호란이 조선 사회와 동아시아 질서에 준 영향을 정리한다.', 'invasion'],
      ['동아시아 질서', '명·청 교체와 조선·일본·중국의 관계 변화를 정리한다.', 'eastasia'],
      ['이슬람과 서아시아', '교역망과 학문 교류를 중심으로 이슬람 세계를 이해한다.', 'islam'],
      ['유럽 중세와 르네상스', '봉건제, 도시 성장, 르네상스의 변화를 연결한다.', 'renaissance'],
    ],
  },
  {
    id: 'm3',
    label: '중3',
    course: '근대 국민 국가',
    era: '개항, 제국주의, 민족 운동, 현대 세계',
    progress: 44,
    units: [
      ['조선 후기 사회 변화', '상품 화폐 경제, 신분제 동요, 실학의 등장을 설명한다.', 'latejoseon'],
      ['세도 정치와 농민 봉기', '세도 정치의 폐단과 농민 봉기의 배경을 연결한다.', 'sedo'],
      ['흥선 대원군과 개항', '통상 수교 거부 정책과 개항 이후의 변화를 비교한다.', 'openport'],
      ['근대 개혁과 갈등', '갑신정변, 동학 농민 운동, 갑오개혁의 요구를 구분한다.', 'reform'],
      ['대한 제국과 국권 침탈', '광무개혁과 일제의 침탈 단계를 연표로 정리한다.', 'empirekorea'],
      ['일제 강점기 통치', '무단 통치, 문화 통치, 민족 말살 통치를 비교한다.', 'colonial'],
      ['독립운동과 임시정부', '3·1 운동, 대한민국 임시정부, 무장 투쟁의 흐름을 파악한다.', 'independence'],
      ['민족 문화 수호 운동', '일제 강점기 교육, 언론, 역사 연구, 한글 운동을 정리한다.', 'culturemovement'],
      ['광복과 정부 수립', '해방 정국, 분단, 대한민국 정부 수립 과정을 이해한다.', 'liberation'],
      ['6·25 전쟁과 분단', '전쟁의 전개와 전후 분단 체제의 고착 과정을 파악한다.', 'koreanwar'],
      ['세계 대전과 냉전', '전체주의, 세계 대전, 냉전 체제의 형성을 설명한다.', 'war'],
      ['민주주의와 산업화', '경제 성장과 민주화 운동의 관계를 시대별로 정리한다.', 'democracy'],
    ],
  },
  {
    id: 'h1',
    label: '고1',
    course: '한국사 통사',
    era: '전근대부터 현대까지 한국사 전체 흐름',
    progress: 63,
    units: [
      ['선사 문화와 고조선', '한반도 선사 문화와 고조선의 성립을 한국사 통사 흐름에서 정리한다.', 'hancient'],
      ['고대 국가 체제', '율령, 불교, 중앙 집권을 기준으로 고대 국가의 발전을 분석한다.', 'ancientstate'],
      ['남북국과 후삼국', '통일 신라 말 사회 동요와 후삼국 성립 원인을 설명한다.', 'laterthree'],
      ['고려 정치 운영', '귀족 정치, 무신 정권, 원 간섭기를 권력 구조로 정리한다.', 'goryeopolitics'],
      ['고려 사회와 사상', '불교, 유교, 신분 질서, 대외 교류를 고려 사회 변화와 연결한다.', 'goryeosociety'],
      ['조선 통치와 사림', '훈구와 사림, 붕당 정치의 전개를 제도 변화와 연결한다.', 'sarim'],
      ['조선 후기 변화', '상품 화폐 경제, 신분제 동요, 실학의 등장을 설명한다.', 'latejoseon'],
      ['근대 국가 수립 운동', '개항 이후 개화, 척사, 농민 운동의 목표를 비교한다.', 'modernstate'],
      ['일제 식민 통치와 저항', '일제의 통치 방식 변화와 민족 운동의 전개를 시기별로 구분한다.', 'resistance'],
      ['민족 운동의 전개', '국내외 독립운동 노선과 조직을 시기별로 구분한다.', 'movement'],
      ['대한민국의 수립과 전쟁', '광복 이후 정부 수립과 6·25 전쟁의 전개를 정리한다.', 'republicwar'],
      ['현대사의 전개', '정부 수립, 전쟁, 산업화, 민주화를 연속된 흐름으로 정리한다.', 'modernkorea'],
    ],
  },
  {
    id: 'h2',
    label: '고2',
    course: '세계사 심화',
    era: '문명권, 교류, 혁명, 제국주의, 현대 세계',
    progress: 39,
    units: [
      ['문명과 국가의 형성', '세계 여러 문명의 성립 조건과 초기 국가의 특징을 비교한다.', 'civilization'],
      ['동아시아 세계', '중국 왕조와 주변국의 책봉·조공 질서를 이해한다.', 'china'],
      ['서아시아와 인도', '종교와 교역망을 중심으로 서아시아·인도 세계를 비교한다.', 'india'],
      ['유럽 세계의 형성', '고대 지중해 세계와 중세 유럽의 제도를 연결한다.', 'europe'],
      ['대항해와 교역망', '신항로 개척 이후 세계 교역망의 재편을 분석한다.', 'ocean'],
      ['절대 왕정과 계몽사상', '절대 왕정의 성립과 계몽사상이 시민 혁명에 준 영향을 파악한다.', 'absolutism'],
      ['시민 혁명과 국민 국가', '영국, 미국, 프랑스 혁명의 공통점과 차이를 파악한다.', 'revolution'],
      ['산업화와 제국주의', '산업 혁명과 제국주의 팽창의 인과 관계를 설명한다.', 'industry'],
      ['아시아의 민족 운동', '제국주의 침략에 대한 아시아 각 지역의 대응과 민족 운동을 비교한다.', 'asianmovement'],
      ['세계 대전', '두 차례 세계 대전의 원인, 전개, 결과를 비교한다.', 'worldwar'],
      ['냉전과 탈냉전', '냉전 질서와 탈냉전 이후 세계 변화를 해석한다.', 'coldwar'],
      ['현대 세계의 과제', '탈냉전 이후 국제 질서와 인권, 분쟁, 세계화 문제를 이해한다.', 'globalissues'],
    ],
  },
  {
    id: 'h3',
    label: '고3',
    course: '수능 한국사 완성',
    era: '빈출 자료, 연표, 개념 압축, 실전 적용',
    progress: 81,
    units: [
      ['선사~고대 빈출', '유물, 제도, 문화재 단서로 시대를 빠르게 판별한다.', 'examancient'],
      ['삼국~남북국 비교', '삼국과 남북국의 제도, 문화, 대외 관계를 비교해 판별한다.', 'examsamguk'],
      ['고려 핵심 자료', '토지 제도, 정치 변동, 대외 관계 자료를 해석한다.', 'examgoryeo'],
      ['조선 전기 제도', '통치 기구, 교육 제도, 문화 정책의 출제 포인트를 정리한다.', 'examjoseon1'],
      ['조선 후기 변화', '경제·사회 변화와 실학 사상을 자료로 판별한다.', 'examjoseon2'],
      ['근대 개혁 연표', '개항부터 국권 피탈까지 사건 순서를 압축한다.', 'exammodern'],
      ['국권 피탈 과정', '을사늑약, 정미7조약, 경술국치로 이어지는 침탈 과정을 정리한다.', 'examloss'],
      ['일제 강점기 운동', '시기별 통치 방식과 민족 운동을 연결한다.', 'examcolonial'],
      ['독립운동 노선 비교', '실력 양성, 무장 투쟁, 의열 투쟁, 외교 활동의 특징을 비교한다.', 'examindependence'],
      ['현대사 연표', '정부별 사건과 헌법 개정, 민주화 운동을 구분한다.', 'exammodernkorea'],
      ['경제 성장과 민주화', '산업화 정책과 민주화 운동을 정부별 흐름으로 연결한다.', 'exameconomy'],
      ['실전 모의고사', '자료, 지도, 연표, 해석형 문항을 종합한다.', 'mock'],
    ],
  },
];

const questionBlueprints = [
  {
    stem: (title) => `${title} 단원의 핵심 내용을 바르게 설명한 것은?`,
    answer: (_grade, _title, concept) => concept,
    distractors: [
      '단원 이름만 외우면 시대 배경은 확인하지 않아도 된다.',
      '인물 이름이 나오면 곧바로 정답으로 판단한다.',
      '비슷한 용어는 모두 같은 시대의 내용으로 본다.',
    ],
  },
  {
    stem: (title) => `${title}와 관련된 자료를 읽을 때 가장 먼저 확인할 기준은?`,
    answer: () => '자료가 만들어진 시기, 만든 사람, 관점을 함께 확인한다.',
    distractors: [
      '자료의 제목만 보고 시대와 관점을 모두 판단한다.',
      '사진이나 지도는 역사 문제에서 단서가 되지 않는다.',
      '자료를 만든 사람보다 보기의 긴 문장을 먼저 고른다.',
    ],
  },
  {
    stem: (title) => `${title}을(를) 같은 시대 흐름 속에서 이해한 설명으로 옳은 것은?`,
    answer: (grade) => `${grade.era} 흐름 안에서 관련 사건과 제도를 연결해 판단한다.`,
    distractors: [
      '한국사와 세계사 흐름은 서로 관련 없이 따로 외운다.',
      '같은 단어가 나오면 모든 시대에서 같은 의미로 해석한다.',
      '제도와 사건의 앞뒤 관계는 정답 판단에 필요하지 않다.',
    ],
  },
  {
    stem: (title) => `${title} 단원에서 원인과 결과를 바르게 연결한 것은?`,
    answer: () => '사건의 배경, 전개, 결과를 차례로 확인해 선택지를 비교한다.',
    distractors: [
      '결과를 먼저 정답으로 고르고 원인은 나중에 맞춘다.',
      '전개 과정이 달라도 핵심 단어가 같으면 정답이다.',
      '원인과 결과가 바뀐 선택지도 같은 의미로 본다.',
    ],
  },
  {
    stem: (title) => `${title}와(과) 다른 시대의 내용을 구분한 설명으로 옳은 것은?`,
    answer: (_grade, title) => `${title}의 특징과 맞지 않는 시대착오 표현을 먼저 지운다.`,
    distractors: [
      '선택지에 익숙한 단어가 있으면 시대가 달라도 정답이다.',
      '정치 제도, 문화재, 전쟁은 시대 구분 없이 섞어 판단한다.',
      '낯선 표현은 무조건 오답이므로 읽지 않는다.',
    ],
  },
  {
    stem: (title) => `${title} 학습에서 헷갈리기 쉬운 선택지를 고르는 기준으로 옳은 것은?`,
    answer: () => '보기의 시대, 지역, 제도명이 모두 맞는지 함께 확인한다.',
    distractors: [
      '시대가 맞으면 지역과 제도명은 틀려도 정답이다.',
      '보기 중 가장 긴 문장이 항상 교과서 설명이다.',
      '처음 보는 용어가 있으면 나머지 내용은 읽지 않는다.',
    ],
  },
  {
    stem: (title) => `${title} 단원의 학습 기록을 정리하는 방법으로 적절한 것은?`,
    answer: () => '핵심 사건을 원인, 전개, 결과 순서로 한 줄씩 정리한다.',
    distractors: [
      '사건 이름만 가나다순으로 적으면 충분하다.',
      '정답 보기만 외우고 오답 보기는 다시 보지 않는다.',
      '지도와 연표는 시험 문제에 나오지 않으므로 제외한다.',
    ],
  },
  {
    stem: (title) => `${title} 문제를 풀 때 자료와 선택지를 연결한 방식으로 옳은 것은?`,
    answer: () => '자료의 단서가 선택지의 사건, 제도, 시대와 맞는지 대조한다.',
    distractors: [
      '자료와 선택지를 따로 읽고 느낌이 비슷한 보기를 고른다.',
      '자료에 없는 내용이라도 익숙하면 정답으로 고른다.',
      '시대 단서보다 보기 번호가 앞선 선택지를 우선한다.',
    ],
  },
];

export const grades = rawCurriculum.map((grade) => ({
  ...grade,
  color: gradeColors[grade.id],
  units: grade.units.map(([title, concept, slug], index) => ({
    id: `${grade.id}-${slug}`,
    title,
    concept,
    symbol: getSymbol(index),
    difficulty: index < 2 ? 2 : index < 5 ? 3 : 4,
    progress: Math.max(12, grade.progress - index * 5),
    questions: buildQuestionSet(grade, title, concept, slug, index),
  })),
}));

export const totalQuestionCount = grades.reduce(
  (total, grade) => total + grade.units.reduce((sum, unit) => sum + unit.questions.length, 0),
  0,
);

function getSymbol(index) {
  return ['✓', '1', '2', '3', '4', '5', '6', '7'][index] ?? String(index + 1);
}

function buildQuestionSet(grade, title, concept, slug, index) {
  const count = getQuestionCount(grade.id, index);
  return Array.from({ length: count }, (_, questionIndex) =>
    buildQuestion(grade, title, concept, slug, index, questionIndex),
  );
}

function getQuestionCount(gradeId, unitIndex) {
  const baseByGrade = {
    m1: [8, 10, 10, 10, 12, 9, 10, 8, 10, 8],
    m2: [10, 10, 8, 9, 10, 8, 9, 10, 9, 8, 8],
    m3: [9, 8, 10, 10, 10, 12, 12, 8, 9, 9, 9, 10],
    h1: [10, 10, 9, 11, 10, 10, 12, 11, 12, 12, 10, 10],
    h2: [9, 10, 10, 9, 10, 9, 11, 11, 10, 10, 10, 9],
    h3: [12, 12, 12, 11, 11, 14, 12, 14, 12, 12, 12, 14],
  };
  return baseByGrade[gradeId][unitIndex] ?? 20;
}

function buildQuestion(grade, title, concept, slug, index, questionIndex) {
  const blueprint = questionBlueprints[questionIndex % questionBlueprints.length];
  const number = questionIndex + 1;
  const answer = blueprint.answer(grade, title, concept);
  const distractors = blueprint.distractors;
  const answerIndex = (questionIndex + index) % 4;
  const choices = [...distractors];
  choices.splice(answerIndex, 0, answer);

  return {
    id: `q-${grade.id}-${slug}-${String(number).padStart(2, '0')}`,
    title: `${title} ${number}`,
    type: ['자료 해석', '개념 적용', '연표 판단', '비교 분석', '실전 적용'][questionIndex % 5],
    difficulty: Math.min(5, 2 + Math.floor((index + questionIndex) / 3)),
    xp: 40 + index * 5 + questionIndex * 3,
    stem: blueprint.stem(title),
    source: concept,
    assets: buildAssets(grade.id, slug, questionIndex),
    choices,
    answerIndex,
    explanation: `${grade.label} ${grade.course} 교과서 흐름에서 '${title}'은(는) ${concept} 이 점을 자료 단서, 배경, 결과 순서로 정리해야 한다.`,
    concepts: [
      `${title}: ${concept}`,
      `범위: ${grade.era}`,
      '역사 자료는 만들어진 시기, 만든 사람, 핵심 용어를 함께 읽는다.',
    ],
    lesson: buildLesson(grade, title, concept, index),
    steps: [
      '자료에서 시대 단서와 핵심 용어를 표시한다.',
      '단서가 가리키는 제도, 사건, 사회 변화를 연결한다.',
      '선택지 중 시대·배경·결과가 모두 맞는 문장을 고른다.',
      '비슷한 시대의 다른 사건과 헷갈리지 않는지 검산한다.',
    ],
    mistakes: [
      '단어 하나만 보고 시대 전체를 단정함',
      '원인과 결과를 거꾸로 연결함',
      '한국사와 세계사 맥락을 분리해서 읽음',
    ],
  };
}

function buildAssets(gradeId, slug, questionIndex) {
  if (questionIndex % 3 === 2) return [];
  return (assetCatalog[slug] || []).map((asset) => ({
    type: 'image',
    label: asset.label,
    url: buildAssetUrl(gradeId, slug, asset),
  }));
}

function buildAssetUrl(gradeId, slug, asset) {
  if (r2PublicUrl) return `${r2PublicUrl}/history/${gradeId}/${slug}/${asset.file}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <rect width="960" height="540" fill="#152033"/>
    <rect x="42" y="42" width="876" height="456" rx="24" fill="#20304a" stroke="#6ee7b7" stroke-width="4"/>
    <text x="80" y="140" fill="#6ee7b7" font-family="sans-serif" font-size="34" font-weight="700">역사 자료 이미지</text>
    <text x="80" y="230" fill="#f8fafc" font-family="sans-serif" font-size="52" font-weight="800">${escapeSvg(asset.label)}</text>
    <text x="80" y="320" fill="#cbd5e1" font-family="sans-serif" font-size="28">R2 공개 URL 설정 시 실제 자료 이미지로 교체됩니다.</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildLesson(grade, title, concept, index) {
  return {
    summary: `${title} 단원은 한국 ${grade.label} 역사 교과서의 ${grade.course} 흐름에서 반드시 잡아야 하는 핵심 축입니다. 단순히 이름을 외우는 단원이 아니라, '${concept}'라는 흐름을 자료 단서와 시대 배경으로 설명할 수 있어야 합니다.`,
    terms: [
      {
        name: title,
        body: `${grade.label} ${grade.course}에서 다루는 핵심 단원입니다. '${concept}'라는 설명을 기준으로 관련 사건, 제도, 인물, 문화 변화를 함께 묶어 이해해야 합니다.`,
      },
      {
        name: '핵심 개념',
        body: concept,
      },
      {
        name: '시대 범위',
        body: `${grade.era} 안에서 이 단원이 어디에 놓이는지 확인하는 기준입니다. 시대 범위가 맞아야 선택지의 제도와 사건도 올바르게 판단할 수 있습니다.`,
      },
      {
        name: '자료 단서',
        body: '문제에 제시된 문서, 기록, 사진, 지도, 유물, 유적 안에서 시대와 사건을 알려 주는 표현입니다. 낯선 자료라도 단서 단어를 찾으면 정답 범위를 좁힐 수 있습니다.',
      },
      {
        name: '인과 관계',
        body: '어떤 사건이 왜 일어났고 그 결과 무엇이 달라졌는지를 뜻합니다. 역사 문제는 이름 암기보다 원인, 전개, 결과를 연결하는 힘을 자주 확인합니다.',
      },
    ],
    context: [
      `${grade.era} 범위에서는 사건을 따로 외우기보다 같은 시대에 함께 나타난 제도, 인물, 문화 변화를 묶어야 합니다.`,
      `${title} 문제는 보통 핵심 용어 하나를 던진 뒤, 그것이 어떤 시대 변화와 연결되는지 묻습니다.`,
      index >= 4
        ? '후반 단원일수록 앞 단원의 흐름과 비교하는 문항이 많으므로, 이전 시대와 달라진 점을 먼저 표시하세요.'
        : '초반 단원은 기본 개념을 정확히 잡는 것이 중요하므로, 용어의 뜻과 대표 사례를 먼저 정리하세요.',
    ],
    reading: [
      '자료에서 시대를 알려 주는 단어를 먼저 찾습니다.',
      '그 단어가 가리키는 제도, 사건, 인물, 문화재를 옆에 적습니다.',
      '자료의 주장이나 목적을 확인해 단순 사실인지, 특정 관점이 담긴 설명인지 구분합니다.',
      '선택지는 맞는 말처럼 보여도 시대가 다르면 오답이므로, 시대 일치 여부를 먼저 확인합니다.',
    ],
    example: {
      prompt: `${title}와 관련된 자료에서 '${concept}'라는 설명이 보인다면 무엇을 먼저 판단해야 할까?`,
      answer: `먼저 이 설명이 어느 시대 변화와 연결되는지 확인합니다. 그다음 원인, 전개, 결과 중 무엇을 묻는지 나누고, 선택지에서 ${title}의 특징과 맞지 않는 시대착오 표현을 지웁니다.`,
    },
    memory: [
      `${title} = ${concept}`,
      '용어만 외우지 말고 시대, 배경, 결과를 한 줄로 묶기',
      '자료 문제는 핵심 단어 표시 → 시대 판별 → 선택지 소거 순서로 풀기',
    ],
  };
}
