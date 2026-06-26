const gradeColors = {
  m1: '#20c997',
  m2: '#4dabf7',
  m3: '#ffd43b',
  h1: '#ff922b',
  h2: '#845ef7',
  h3: '#f06595',
};

const runtimeEnv = import.meta.env || (typeof process !== 'undefined' ? process.env : {});
const r2PublicUrl = (runtimeEnv.VITE_CLOUDFLARE_R2_PUBLIC_URL || '').replace(/\/$/, '');

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
  historicalthinking: [{ file: 'history-record-source.webp', label: '조선왕조실록 기록 자료' }],
  oldmap: [{ file: 'ancient-map-reading.webp', label: '고대 국가 위치와 교류 지도' }],
  goryeosociety: [{ file: 'goryeo-society-culture.webp', label: '고려 사회와 문화 자료' }],
  joseonsystem: [{ file: 'joseon-government-system.webp', label: '조선 통치 체제 자료' }],
  latejoseon: [{ file: 'late-joseon-economy.webp', label: '조선 후기 사회 변화 자료' }],
  modernreform: [{ file: 'modern-reform-timeline.webp', label: '근대 개혁 연표 자료' }],
  colonialmovement: [{ file: 'colonial-movement-map.webp', label: '일제 강점기 민족 운동 자료' }],
  republic: [{ file: 'republic-korea-timeline.webp', label: '대한민국 정부 수립과 현대사 자료' }],
  eastasia: [{ file: 'east-asian-order-map.webp', label: '동아시아 국제 질서 지도' }],
  examdata: [{ file: 'exam-source-set.webp', label: '한국사 실전 자료 묶음' }],
};

const rawCurriculum = [
  {
    id: 'm1',
    label: '중1',
    course: '역사 기초와 고대 세계',
    era: '역사 학습 방법, 선사 문화, 고대 국가, 고대 세계',
    progress: 72,
    units: [
      ['자료와 역사 해석', '자료가 만들어진 시기와 관점을 확인하고 사실과 해석을 구분한다.', 'historicalthinking'],
      ['선사 문화와 농경', '구석기와 신석기의 생활 차이, 농경과 정착 생활의 변화를 이해한다.', 'seed'],
      ['청동기와 고조선', '청동기 문화의 특징과 고조선의 성립, 여러 나라의 풍속을 연결한다.', 'bronze'],
      ['삼국과 가야의 성장', '고구려·백제·신라·가야의 성장 기반과 대외 관계를 비교한다.', 'three'],
      ['통일 신라와 발해', '삼국 통일 이후 남북국의 정치와 문화, 대외 교류를 정리한다.', 'unified'],
      ['고대 문화와 교류', '불교·유학·문자·문화재를 통해 고대 동아시아 교류를 파악한다.', 'culture'],
      ['세계 고대 문명', '큰 강 유역 문명과 고대 제국의 통치 방식을 비교한다.', 'river'],
      ['고대 세계의 연결', '동서 교역로와 제국의 팽창이 문화 교류에 준 영향을 읽는다.', 'empire'],
    ],
  },
  {
    id: 'm2',
    label: '중2',
    course: '중세와 근세 세계',
    era: '고려, 조선 전기·후기, 동아시아 질서, 중세 세계',
    progress: 58,
    units: [
      ['고려의 성립과 변화', '호족, 문벌, 무신 정권, 권문세족으로 이어지는 권력 변동을 설명한다.', 'goryeo'],
      ['고려 대외 관계', '거란, 여진, 몽골과의 관계 속에서 고려의 대응을 비교한다.', 'diplomacy'],
      ['고려 사회와 문화', '신분 질서, 불교·유교, 인쇄술과 공예를 사회 배경과 연결한다.', 'goryeosociety'],
      ['조선 건국과 통치', '성리학 국가의 중앙·지방 통치 체제와 민본 정치를 파악한다.', 'joseonsystem'],
      ['조선 전기 문화', '훈민정음, 과학 기술, 농업 정책의 의미를 자료로 읽는다.', 'hangul'],
      ['사림과 정치 변화', '사림의 성장, 붕당 정치, 조선 후기 정치 운영 변화를 구분한다.', 'bungdang'],
      ['왜란과 호란', '임진왜란과 병자호란이 조선 사회와 동아시아 질서에 준 영향을 정리한다.', 'invasion'],
      ['조선 후기 사회 변화', '상품 화폐 경제, 신분제 동요, 실학과 서민 문화의 등장을 설명한다.', 'latejoseon'],
      ['동아시아와 중세 세계', '명·청 교체, 일본 막부, 이슬람·유럽 세계의 변화를 비교한다.', 'eastasia'],
    ],
  },
  {
    id: 'm3',
    label: '중3',
    course: '근현대 한국과 세계',
    era: '개항, 근대 개혁, 일제 강점기, 광복 이후, 현대 세계',
    progress: 44,
    units: [
      ['세도 정치와 농민 봉기', '세도 정치의 폐단과 농민 봉기의 배경을 연결한다.', 'sedo'],
      ['흥선 대원군과 개항', '통상 수교 거부 정책과 개항 이후의 변화를 비교한다.', 'openport'],
      ['근대 개혁과 갈등', '갑신정변, 동학 농민 운동, 갑오개혁의 요구를 구분한다.', 'modernreform'],
      ['대한 제국과 국권 침탈', '광무개혁과 일제의 침탈 단계를 연표로 정리한다.', 'empirekorea'],
      ['일제 통치와 민족 운동', '통치 방식 변화와 3·1 운동, 임시정부, 무장 투쟁을 연결한다.', 'colonialmovement'],
      ['민족 문화 수호', '교육, 언론, 역사 연구, 한글 운동을 민족 문화 수호 흐름으로 정리한다.', 'culturemovement'],
      ['광복과 대한민국 수립', '해방 정국, 분단, 대한민국 정부 수립 과정을 이해한다.', 'republic'],
      ['6·25 전쟁과 현대 사회', '전쟁의 전개, 분단 체제, 산업화와 민주화의 흐름을 파악한다.', 'koreanwar'],
      ['세계 대전과 냉전', '전체주의, 세계 대전, 냉전 체제의 형성을 설명한다.', 'war'],
    ],
  },
  {
    id: 'h1',
    label: '고1',
    course: '한국사 통사',
    era: '전근대부터 현대까지 한국사 전체 흐름',
    progress: 63,
    units: [
      ['전근대 국가의 형성', '선사 문화부터 고대 국가의 중앙 집권과 문화 발전을 통사로 정리한다.', 'hancient'],
      ['고려의 정치와 사회', '고려의 정치 운영, 대외 관계, 신분 질서와 문화 발전을 연결한다.', 'goryeopolitics'],
      ['조선의 통치와 변화', '조선 통치 체제, 사림과 붕당, 후기 사회 변동을 함께 파악한다.', 'joseonsystem'],
      ['개항과 근대 국가 운동', '개항 이후 개화·척사·농민 운동과 근대 개혁의 목표를 비교한다.', 'modernreform'],
      ['국권 침탈과 저항', '일제의 침탈 과정과 의병, 애국 계몽 운동, 국권 수호 운동을 구분한다.', 'examloss'],
      ['일제 강점기 민족 운동', '통치 방식 변화와 국내외 민족 운동 노선을 시기별로 연결한다.', 'colonialmovement'],
      ['광복과 정부 수립', '광복, 분단, 대한민국 정부 수립, 6·25 전쟁을 연표로 정리한다.', 'republic'],
      ['현대사의 전개', '정부 수립, 전쟁, 산업화, 민주화를 연속된 흐름으로 정리한다.', 'modernkorea'],
    ],
  },
  {
    id: 'h2',
    label: '고2',
    course: '세계사와 동아시아사',
    era: '세계 여러 지역의 문명, 교류, 혁명, 제국주의, 동아시아 질서',
    progress: 39,
    units: [
      ['문명과 국가의 형성', '세계 여러 문명의 성립 조건과 초기 국가의 특징을 비교한다.', 'civilization'],
      ['동아시아 질서와 교류', '중국 왕조와 주변국의 책봉·조공, 교역, 문화 교류를 이해한다.', 'eastasia'],
      ['서아시아와 인도 세계', '종교와 교역망을 중심으로 서아시아·인도 세계를 비교한다.', 'india'],
      ['유럽 세계의 형성', '고대 지중해 세계와 중세 유럽의 제도를 연결한다.', 'europe'],
      ['대항해와 교역망', '신항로 개척 이후 세계 교역망의 재편을 분석한다.', 'ocean'],
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
      ['선사~고대 자료 판별', '유물, 제도, 문화재 단서로 시대를 빠르게 판별한다.', 'examancient'],
      ['삼국~남북국 비교', '삼국과 남북국의 제도, 문화, 대외 관계를 비교해 판별한다.', 'three'],
      ['고려 핵심 자료', '토지 제도, 정치 변동, 대외 관계 자료를 해석한다.', 'goryeosociety'],
      ['조선 전기 제도', '통치 기구, 교육 제도, 문화 정책의 출제 포인트를 정리한다.', 'joseonsystem'],
      ['조선 후기 변화', '경제·사회 변화와 실학 사상을 자료로 판별한다.', 'latejoseon'],
      ['근대 개혁 연표', '개항부터 국권 피탈까지 사건 순서를 압축한다.', 'exammodern'],
      ['국권 피탈 과정', '을사늑약, 정미7조약, 경술국치로 이어지는 침탈 과정을 정리한다.', 'examloss'],
      ['일제 강점기 운동', '시기별 통치 방식과 민족 운동을 연결한다.', 'colonialmovement'],
      ['현대사 연표', '정부별 사건과 헌법 개정, 민주화 운동을 구분한다.', 'exammodernkorea'],
      ['실전 자료 종합', '자료, 지도, 연표, 해석형 문항을 종합한다.', 'examdata'],
    ],
  },
];

const questionBlueprints = [
  {
    stem: (title) => `${title} 단원의 핵심 흐름을 바르게 설명한 것은?`,
    answer: (_grade, title, concept) => `${withJosa(title, '은', '는')} ${concept}`,
    distractors: [
      '단원 이름만 외우면 시대 배경과 원인·결과는 확인하지 않아도 된다.',
      '인물 이름이 나오면 자료의 시기와 관점을 보지 않고 곧바로 정답으로 판단한다.',
      '비슷한 용어는 모두 같은 시대의 내용이므로 따로 구분하지 않는다.',
    ],
  },
  {
    stem: (title) => `${withJosa(title, '과', '와')} 관련된 자료를 읽을 때 가장 먼저 확인할 기준은?`,
    answer: (_grade, title) => `${title} 자료의 시기, 만든 주체, 관점을 먼저 확인한다.`,
    distractors: [
      '자료의 제목만 보고 시대와 관점을 모두 판단한다.',
      '사진이나 지도는 역사 문제에서 단서가 되지 않는다.',
      '자료를 만든 사람보다 보기의 긴 문장을 먼저 고른다.',
    ],
  },
  {
    stem: (title) => `${withJosa(title, '을', '를')} 같은 시대 흐름 속에서 이해한 설명으로 옳은 것은?`,
    answer: (grade, title) => `${withJosa(title, '은', '는')} ${grade.era} 흐름 안에서 앞뒤 사건과 함께 판단한다.`,
    distractors: [
      '한국사와 세계사 흐름은 서로 관련 없이 따로 외운다.',
      '같은 단어가 나오면 모든 시대에서 같은 의미로 해석한다.',
      '제도와 사건의 앞뒤 관계는 정답 판단에 필요하지 않다.',
    ],
  },
  {
    stem: (title) => `${title} 단원에서 원인과 결과를 바르게 연결한 것은?`,
    answer: (_grade, title, concept) => `${title}의 배경과 전개를 확인한 뒤 '${concept}'라는 결과와 연결한다.`,
    distractors: [
      '결과를 먼저 정답으로 고르고 원인은 나중에 맞춘다.',
      '전개 과정이 달라도 핵심 단어가 같으면 정답이다.',
      '원인과 결과가 바뀐 선택지도 같은 의미로 본다.',
    ],
  },
  {
    stem: (title) => `${withJosa(title, '과', '와')} 다른 시대의 내용을 구분한 설명으로 옳은 것은?`,
    answer: (_grade, title) => `${title}의 특징과 맞지 않는 시대착오 표현을 먼저 지운다.`,
    distractors: [
      '선택지에 익숙한 단어가 있으면 시대가 달라도 정답이다.',
      '정치 제도, 문화재, 전쟁은 시대 구분 없이 섞어 판단한다.',
      '낯선 표현은 무조건 오답이므로 읽지 않는다.',
    ],
  },
  {
    stem: (title) => `${title} 학습에서 헷갈리기 쉬운 선택지를 고르는 기준으로 옳은 것은?`,
    answer: (_grade, title) => `${title} 보기의 시대, 지역, 제도명이 모두 맞는지 함께 확인한다.`,
    distractors: [
      '시대가 맞으면 지역과 제도명은 틀려도 정답이다.',
      '보기 중 가장 긴 문장이 항상 교과서 설명이다.',
      '처음 보는 용어가 있으면 나머지 내용은 읽지 않는다.',
    ],
  },
  {
    stem: (title) => `${title} 단원의 학습 기록을 정리하는 방법으로 적절한 것은?`,
    answer: (_grade, title) => `${title}의 핵심 사건을 원인, 전개, 결과 순서로 한 줄씩 정리한다.`,
    distractors: [
      '사건 이름만 가나다순으로 적으면 충분하다.',
      '정답 보기만 외우고 오답 보기는 다시 보지 않는다.',
      '지도와 연표는 시험 문제에 나오지 않으므로 제외한다.',
    ],
  },
  {
    stem: (title) => `${title} 문제를 풀 때 자료와 선택지를 연결한 방식으로 옳은 것은?`,
    answer: (_grade, title) => `${title} 자료의 단서가 선택지의 사건, 제도, 시대와 맞는지 대조한다.`,
    distractors: [
      '자료와 선택지를 따로 읽고 느낌이 비슷한 보기를 고른다.',
      '자료에 없는 내용이라도 익숙하면 정답으로 고른다.',
      '시대 단서보다 보기 번호가 앞선 선택지를 우선한다.',
    ],
  },
  {
    stem: (title) => `${withJosa(title, '과', '와')} 관련된 지도·사진 자료를 볼 때 적절한 판단은?`,
    answer: (_grade, title) => `${title} 자료의 위치, 이동 방향, 유물 특징을 단원 개념과 연결한다.`,
    distractors: [
      '사진 자료는 설명문보다 중요하지 않으므로 건너뛴다.',
      '지도에 표시된 방향과 범례는 정답 판단에 쓰지 않는다.',
      '유물 이름만 알면 만들어진 시기와 쓰임은 확인하지 않아도 된다.',
    ],
  },
  {
    stem: (title) => `${title} 단원의 연표 문제를 푸는 방법으로 옳은 것은?`,
    answer: (_grade, title) => `${title}과(와) 관련된 사건을 먼저 기준점으로 잡고 앞뒤 순서를 좁힌다.`,
    distractors: [
      '연도 숫자가 보이면 가장 익숙한 사건을 먼저 끼워 넣는다.',
      '같은 세기에 일어난 사건은 순서를 구분하지 않아도 된다.',
      '앞뒤 사건을 비교하지 않고 보기 하나만 읽고 고른다.',
    ],
  },
  {
    stem: (title) => `${title}에서 시험에 자주 나오는 비교 기준은?`,
    answer: (_grade, title) => `${title}의 정치·사회·문화 변화가 이전 시기와 어떻게 달라졌는지 비교한다.`,
    distractors: [
      '교과서 굵은 글씨만 외우면 비교 문제는 따로 준비하지 않아도 된다.',
      '정치 변화와 사회 변화는 서로 관련이 없으므로 나누어 암기한다.',
      '문화재 문제는 시대 비교 없이 이름만 알면 된다.',
    ],
  },
  {
    stem: (title) => `${title} 문제에서 오답을 줄이는 가장 좋은 방법은?`,
    answer: (_grade, title) => `${title}의 시대와 맞지 않는 인물·제도·사건을 먼저 지운다.`,
    distractors: [
      '보기의 표현이 길면 교과서 문장처럼 보이므로 정답으로 둔다.',
      '낯선 단어가 들어간 보기는 모두 오답으로 처리한다.',
      '한 단어가 맞으면 나머지 내용이 틀려도 정답으로 둔다.',
    ],
  },
];

const xpByDifficulty = {
  1: 30,
  2: 40,
  3: 55,
  4: 70,
  5: 90,
};

const examMeta = {
  midterm: { label: '중간고사', symbol: '📝', baseDifficulty: 3 },
  final: { label: '기말고사', symbol: '🏆', baseDifficulty: 4 },
};

export const grades = rawCurriculum.map((grade, gradeIndex) => {
  const skillUnits = grade.units.map(([title, concept, slug], index) => ({
    id: `${grade.id}-${slug}`,
    title,
    concept,
    kind: 'skill',
    symbol: getSymbol(index),
    difficulty: index < 2 ? 2 : index < 5 ? 3 : 4,
    progress: Math.max(12, grade.progress - index * 5),
    questions: buildQuestionSet(grade, title, concept, slug, index),
  }));

  const covered = grade.units.map(([title, concept, slug]) => ({ title, concept, slug }));
  const half = Math.ceil(covered.length / 2);
  const firstHalf = covered.slice(0, half);

  const midterm = buildExamUnit(
    grade,
    gradeIndex,
    'midterm',
    firstHalf,
    firstHalf.map((unit) => `${grade.id}-${unit.slug}`),
  );
  const finalExam = buildExamUnit(
    grade,
    gradeIndex,
    'final',
    covered,
    covered.map((unit) => `${grade.id}-${unit.slug}`),
  );

  return {
    ...grade,
    color: gradeColors[grade.id],
    units: [...skillUnits.slice(0, half), midterm, ...skillUnits.slice(half), finalExam],
  };
});

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

function buildExamStem(template, range, title) {
  switch (template % 5) {
    case 0:
      return `${range} 범위에서 ${withJosa(title, '을', '를')} 바르게 설명한 것은?`;
    case 1:
      return `${title} 단원을 시대 흐름 속에 놓고 바르게 연결한 설명은?`;
    case 2:
      return `${range} 종합 자료에서 ${withJosa(title, '을', '를')} 해석한 기준으로 옳은 것은?`;
    case 3:
      return `${title}의 핵심 개념을 바르게 적용한 것은?`;
    default:
      return `${range} 중 ${withJosa(title, '을', '를')} 다른 단원과 구분한 설명으로 옳은 것은?`;
  }
}

function buildExamAnswer(template, title, concept) {
  switch (template % 5) {
    case 0:
      return `${withJosa(title, '은', '는')} ${concept}`;
    case 1:
      return `${title} 단원은 ${concept} 이 흐름을 앞뒤 사건과 함께 판단한다.`;
    case 2:
      return `자료에서 ${title}의 단서를 찾으면 ${concept}`;
    case 3:
      return `${title}의 핵심은 '${concept}'로 정리할 수 있다.`;
    default:
      return `${withJosa(title, '은', '는')} 다른 단원과 달리 ${concept}`;
  }
}

function buildExamUnit(grade, gradeIndex, examType, covered, requires) {
  const meta = examMeta[examType];
  const scopeLabel =
    covered.length > 1 ? `${covered[0].title} ~ ${covered[covered.length - 1].title}` : covered[0].title;
  const concept =
    examType === 'midterm'
      ? `${scopeLabel} 범위를 시대 흐름과 자료 단서로 종합 점검한다.`
      : `${grade.label} ${grade.course}의 전 범위를 시대 흐름과 자료 단서로 종합 점검한다.`;
  const count = examType === 'midterm' ? covered.length + 3 : covered.length + 4;

  return {
    id: `${grade.id}-${examType}`,
    title: meta.label,
    concept,
    kind: 'exam',
    examType,
    scopeLabel,
    requires,
    symbol: meta.symbol,
    difficulty: meta.baseDifficulty,
    progress: 0,
    questions: Array.from({ length: count }, (_, questionIndex) =>
      buildExamQuestion(grade, gradeIndex, examType, covered, scopeLabel, questionIndex),
    ),
  };
}

function buildExamQuestion(grade, gradeIndex, examType, covered, scopeLabel, questionIndex) {
  const meta = examMeta[examType];
  // (템플릿, 단원) 조합을 모두 다르게 만들어 stem·정답이 학년 시험 안에서 고유하도록 한다.
  const anchor = covered[questionIndex % covered.length];
  const other = covered[(questionIndex + 1) % covered.length];
  const template = Math.floor(questionIndex / covered.length) % 5;
  const number = questionIndex + 1;

  const stem = buildExamStem(template, scopeLabel, anchor.title);
  const answer = buildExamAnswer(template, anchor.title, anchor.concept);
  const distractors = [
    `${withJosa(anchor.title, '은', '는')} ${other.concept}`,
    '시험 범위가 넓으므로 단원 이름만 외우고 시대 배경은 확인하지 않는다.',
    '자료의 시기와 관점은 보지 않고 익숙해 보이는 보기를 정답으로 고른다.',
  ];
  const answerIndex = (questionIndex + gradeIndex) % 4;
  const choices = [...distractors];
  choices.splice(answerIndex, 0, answer);

  const difficulty = Math.min(5, meta.baseDifficulty + (questionIndex % 3 === 2 ? 1 : 0));
  // 시험은 여러 단원을 통합하는 텍스트 종합형 문항이라 단일 단원 이미지 자료를 붙이지 않는다.
  const assets = [];
  const source = `[${meta.label} 종합] ${scopeLabel} 범위의 자료를 통합해 시대와 개념을 판별한다. 한 단원의 개념을 다른 단원에 잘못 붙인 보기를 주의한다.\n핵심: ${anchor.title} = ${anchor.concept}\n범위: ${grade.era}`;

  return {
    id: `q-${grade.id}-${examType}-${String(number).padStart(2, '0')}`,
    title: `${meta.label} ${number}`,
    type: examType === 'midterm' ? '중간 종합' : '기말 종합',
    difficulty,
    xp: xpByDifficulty[difficulty],
    stem,
    source,
    assets,
    choices,
    answerIndex,
    explanation: `${meta.label} 범위(${scopeLabel})에서 ${withJosa(anchor.title, '은', '는')} ${anchor.concept} '${other.title}'의 내용과 시대를 섞은 보기는 시대착오이므로 먼저 제외해야 합니다.`,
    concepts: [
      `${anchor.title}: ${anchor.concept}`,
      `시험 범위: ${scopeLabel}`,
      '종합 시험은 단원 사이의 시대·개념 혼동을 가장 많이 노린다.',
    ],
    lesson: buildLesson(grade, anchor.title, anchor.concept, gradeIndex >= 4 ? 5 : questionIndex % 6),
    steps: buildSolvingSteps(anchor.title, anchor.concept, questionIndex),
    mistakes: buildMistakes(anchor.title, questionIndex),
    readingGuide: buildReadingGuide(grade, anchor.title, anchor.concept, source, questionIndex),
    timelineGuide: buildTimelineGuide(grade, anchor.title, anchor.concept, questionIndex),
    eliminateGuide: buildEliminateGuide(anchor.title, choices, answerIndex),
  };
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
  const assets = buildAssets(grade.id, slug, questionIndex);
  const asset = assets[0];
  const assetPhrase = asset ? formatAssetPhrase(asset.label) : null;
  const assetFocus = getAssetQuestionFocus(questionIndex);
  const answer = asset
    ? `${assetPhrase.subject}에서 ${assetFocus.answerPoint} 확인하면 ${title} 단원의 흐름인 '${concept}'와 연결해 해석할 수 있다.`
    : blueprint.answer(grade, title, concept);
  const distractors = blueprint.distractors;
  const answerIndex = (questionIndex + index) % 4;
  const choices = [...distractors];
  choices.splice(answerIndex, 0, answer);
  const difficulty = Math.min(5, 1 + Math.floor((index + questionIndex) / 4));
  const source = buildQuestionSource(grade, title, concept, questionIndex, asset, assetPhrase);

  return {
    id: `q-${grade.id}-${slug}-${String(number).padStart(2, '0')}`,
    title: `${title} ${number}`,
    type: asset ? '자료 해석' : ['자료 해석', '개념 적용', '연표 판단', '비교 분석', '실전 적용'][questionIndex % 5],
    difficulty,
    xp: xpByDifficulty[difficulty],
    stem: asset
      ? `아래 ${assetPhrase.object} 보고, ${assetFocus.prompt} 옳은 것은?`
      : blueprint.stem(title),
    source,
    assets,
    choices,
    answerIndex,
    explanation: asset
      ? `${assetPhrase.subject}는 ${grade.label} ${grade.course}의 '${title}' 단원과 연결됩니다. ${assetFocus.reviewPoint} ${concept} 이 점을 자료의 형태, 시대 단서, 배경 순서로 확인해야 합니다.`
      : `${grade.label} ${grade.course} 교과서 흐름에서 ${withJosa(title, '은', '는')} ${concept} 이 점을 자료 단서, 배경, 결과 순서로 정리해야 한다.`,
    concepts: [
      `${title}: ${concept}`,
      `범위: ${grade.era}`,
      '역사 자료는 만들어진 시기, 만든 사람, 핵심 용어를 함께 읽는다.',
    ],
    lesson: buildLesson(grade, title, concept, index),
    steps: buildSolvingSteps(title, concept, questionIndex),
    mistakes: buildMistakes(title, questionIndex),
    readingGuide: buildReadingGuide(grade, title, concept, source, questionIndex),
    timelineGuide: buildTimelineGuide(grade, title, concept, questionIndex),
    eliminateGuide: buildEliminateGuide(title, choices, answerIndex),
  };
}

function buildSolvingSteps(title, concept, questionIndex) {
  const focus = [
    '자료 첫 문장에서 시대를 알려 주는 표현을 표시한다.',
    '선택지의 사건·제도·인물이 같은 시대에 놓이는지 확인한다.',
    '원인과 결과가 뒤바뀐 문장을 먼저 지운다.',
    '지도·사진이 있으면 위치, 이동 방향, 유물의 쓰임을 보기와 대조한다.',
  ];
  return [
    `${title}의 핵심 개념을 한 문장으로 줄이면 '${concept}'입니다.`,
    focus[questionIndex % focus.length],
    '남은 보기 중 단원 설명과 시대 범위가 동시에 맞는 문장을 고른다.',
    '정답을 고른 뒤에도 시대착오 표현이 섞여 있지 않은지 한 번 더 확인한다.',
  ];
}

function buildMistakes(title, questionIndex) {
  const mistakeSets = [
    [`${title}의 이름만 보고 자료의 시기와 만든 주체를 확인하지 않음`, '원인과 결과를 거꾸로 연결함', '선택지의 지역이나 제도명이 시대와 맞지 않는데도 남김'],
    [`${title}와 비슷한 앞뒤 단원을 같은 내용으로 처리함`, '지도·사진의 범례나 위치 단서를 건너뜀', '정답처럼 긴 문장을 근거 없이 고름'],
    [`${title}의 핵심 단서 하나만 보고 전체 시대를 단정함`, '한국사와 세계사 맥락을 분리해서 읽음', '문제의 질문이 개념인지 연표인지 비교인지 확인하지 않음'],
  ];
  return mistakeSets[questionIndex % mistakeSets.length];
}

function getAssetQuestionFocus(questionIndex) {
  const focuses = [
    {
      prompt: '자료의 시기와 단원 흐름을 연결한 설명으로',
      answerPoint: '만들어진 시기와 시대 범위를 함께',
      reviewPoint: '먼저 자료가 어느 시기에 만들어졌는지 확인해야 합니다.',
    },
    {
      prompt: '자료에 보이는 대상의 쓰임을 단원 개념과 연결한 설명으로',
      answerPoint: '자료의 쓰임과 기능을',
      reviewPoint: '자료가 실제로 어떤 용도로 쓰였는지 살펴야 합니다.',
    },
    {
      prompt: '자료가 보여 주는 사회 변화나 배경을 바르게 읽은 설명으로',
      answerPoint: '사회 변화와 배경을',
      reviewPoint: '자료가 등장한 배경과 그 뒤의 변화를 함께 보아야 합니다.',
    },
    {
      prompt: '자료 속 위치·형태·표현을 근거로 판단한 설명으로',
      answerPoint: '위치·형태·표현 같은 눈에 보이는 단서를',
      reviewPoint: '사진이나 지도에 보이는 형태와 위치 단서가 판단의 근거입니다.',
    },
    {
      prompt: '자료를 만든 주체나 관점을 고려한 설명으로',
      answerPoint: '만든 주체와 관점을',
      reviewPoint: '누가 어떤 관점에서 남긴 자료인지 확인해야 합니다.',
    },
    {
      prompt: '자료와 선택지를 대조하는 방법으로',
      answerPoint: '자료 단서와 선택지의 시대·제도·사건을 대조해',
      reviewPoint: '자료의 단서와 선택지의 표현이 같은 시대에 놓이는지 대조해야 합니다.',
    },
    {
      prompt: '자료를 연표 흐름 속에 놓고 판단한 설명으로',
      answerPoint: '앞뒤 사건과의 순서를',
      reviewPoint: '자료가 어느 사건 앞뒤에 놓이는지 연표로 좁혀야 합니다.',
    },
    {
      prompt: '자료를 다른 시대의 내용과 구분한 설명으로',
      answerPoint: '다른 시대와 섞이지 않는 핵심 단서를',
      reviewPoint: '비슷해 보이는 다른 시대의 제도나 사건과 구분해야 합니다.',
    },
    {
      prompt: '자료가 시험 선택지에서 단서가 되는 이유로',
      answerPoint: '시험 선택지에서 단서가 되는 용어와 이미지를',
      reviewPoint: '자료에 직접 드러난 용어와 시각 단서를 정답 근거로 삼아야 합니다.',
    },
    {
      prompt: '자료를 보고 먼저 지워야 할 오답 기준으로',
      answerPoint: '자료와 맞지 않는 시대착오 표현을',
      reviewPoint: '자료와 시대가 맞지 않는 인물·제도·사건은 먼저 제외해야 합니다.',
    },
    {
      prompt: '자료가 단원 핵심 개념을 보여 주는 방식으로',
      answerPoint: '단원 핵심 개념을 보여 주는 부분을',
      reviewPoint: '자료가 단원 핵심 개념을 어떻게 보여 주는지 한 문장으로 정리해야 합니다.',
    },
    {
      prompt: '자료 해석 후 학습 노트에 정리할 내용으로',
      answerPoint: '시기, 핵심 단서, 단원 개념을 묶어',
      reviewPoint: '자료를 본 뒤에는 시기, 단서, 개념을 함께 정리해야 합니다.',
    },
  ];
  return focuses[questionIndex % focuses.length];
}

function buildReadingGuide(grade, title, concept, source, questionIndex) {
  return {
    headline: `${title} 자료를 읽을 때는 단어보다 맥락을 먼저 잡아야 합니다.`,
    sourceFocus: source,
    checkpoints: [
      `시대 범위: ${grade.era}`,
      `핵심 판단: ${concept}`,
      questionIndex % 2 === 0
        ? '자료 안의 제도·인물·문화재 이름이 어느 시기와 연결되는지 확인합니다.'
        : '자료가 설명하는 변화가 원인인지, 전개인지, 결과인지 표시합니다.',
      questionIndex % 3 === 0
        ? '지도·사진 자료가 있으면 위치와 이동 방향을 보기 문장과 바로 대조합니다.'
        : '문장 자료라면 만든 주체와 관점이 사실 서술인지 주장인지 구분합니다.',
    ],
    application: [
      `${title} 문제에서는 '${concept}'와 맞지 않는 보기를 먼저 제외합니다.`,
      '남은 보기는 시대, 지역, 제도명 순서로 다시 확인합니다.',
      '정답 후보가 두 개처럼 보이면 자료에 직접 드러난 단서가 있는 쪽을 남깁니다.',
    ],
  };
}

function buildTimelineGuide(grade, title, concept, questionIndex) {
  const anchors = [
    '먼저 이 단원이 전근대인지 근현대인지 나눕니다.',
    '정치 사건이면 통치 체제 변화 전후를 기준점으로 둡니다.',
    '사회·문화 사건이면 생활 방식이나 사상 변화가 나타난 시기를 기준점으로 둡니다.',
    '세계사 사건이면 교역망 확대, 혁명, 제국주의, 전쟁 중 어느 흐름인지 먼저 나눕니다.',
  ];
  return {
    anchor: anchors[questionIndex % anchors.length],
    before: `${title} 이전에는 이 변화가 생기게 된 배경을 찾습니다.`,
    current: `현재 단서: ${concept}`,
    after: `${title} 이후에는 제도, 사회 구조, 대외 관계 중 무엇이 달라졌는지 확인합니다.`,
    trap: '같은 시대처럼 보이는 단어라도 사건 순서가 바뀌면 오답입니다.',
    steps: [
      `1단계: ${grade.era} 안에서 단원의 위치를 잡습니다.`,
      '2단계: 자료의 핵심 단어를 기준 사건으로 둡니다.',
      '3단계: 선택지의 사건을 기준 사건 앞/뒤로 나누어 지웁니다.',
      '4단계: 마지막에 원인과 결과가 뒤바뀐 보기를 제거합니다.',
    ],
  };
}

function buildEliminateGuide(title, choices, answerIndex) {
  return choices.map((choice, index) => {
    if (index === answerIndex) {
      return {
        label: '남김',
        choice,
        reason: `${title}의 시대 범위와 핵심 개념을 동시에 만족합니다.`,
      };
    }
    const reasons = [
      '시대나 배경 확인을 생략하라는 표현이 있어 역사 문제 풀이 기준과 맞지 않습니다.',
      '자료 단서보다 느낌이나 문장 길이에 기대는 판단이라 제외합니다.',
      '시대, 지역, 제도명 중 하나를 확인하지 않는 방식이라 오답 가능성이 큽니다.',
    ];
    return {
      label: '제외',
      choice,
      reason: reasons[index % reasons.length],
    };
  });
}

function buildQuestionSource(grade, title, concept, questionIndex, asset, assetPhrase) {
  if (asset) {
    return `[이미지 자료] ${assetPhrase.subject}가 제시되어 있다. 사진·지도·기록의 형태와 보이는 단서를 ${title}의 핵심 개념과 연결한다.\n핵심: ${concept}\n범위: ${grade.era}`;
  }

  const frames = [
    `[교과서 자료] ${concept}`,
    `[연표 자료] ${title} 전후의 사건 순서를 묻고 있다. 먼저 기준 사건을 찾은 뒤 앞뒤 흐름을 비교한다.`,
    `[지도·사진 자료] 위치, 이동 방향, 유물의 쓰임처럼 눈에 보이는 단서를 ${title}의 개념과 연결한다.`,
    `[비교 자료] 같은 시대의 정치·사회·문화 변화를 나란히 놓고 이전 시기와 달라진 점을 확인한다.`,
    `[선택지 점검] 시대, 지역, 제도명 중 하나라도 맞지 않으면 그 보기는 먼저 제외한다.`,
  ];
  const frame = frames[questionIndex % frames.length];
  return `${frame}\n범위: ${grade.era}`;
}

function formatAssetPhrase(label) {
  const subject = label.endsWith('자료') ? label : `${label} 자료`;
  return {
    subject,
    object: withJosa(subject, '을', '를'),
  };
}

function withJosa(value, withBatchim, withoutBatchim) {
  return `${value}${hasBatchim(value) ? withBatchim : withoutBatchim}`;
}

function hasBatchim(value) {
  const char = [...String(value).trim()].pop();
  if (!char) return false;
  const code = char.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function buildAssets(gradeId, slug, questionIndex) {
  if (questionIndex % 4 === 1) return [];
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
    <text x="80" y="150" fill="#6ee7b7" font-family="sans-serif" font-size="34" font-weight="700">역사 자료</text>
    <text x="80" y="245" fill="#f8fafc" font-family="sans-serif" font-size="52" font-weight="800">${escapeSvg(asset.label)}</text>
    <text x="80" y="330" fill="#cbd5e1" font-family="sans-serif" font-size="28">지도, 유물, 연표 단서를 확인하세요.</text>
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
      prompt: `${withJosa(title, '과', '와')} 관련된 자료에서 '${concept}'라는 설명이 보인다면 무엇을 먼저 판단해야 할까?`,
      answer: `먼저 이 설명이 어느 시대 변화와 연결되는지 확인합니다. 그다음 원인, 전개, 결과 중 무엇을 묻는지 나누고, 선택지에서 ${title}의 특징과 맞지 않는 시대착오 표현을 지웁니다.`,
    },
    memory: [
      `${title} = ${concept}`,
      '용어만 외우지 말고 시대, 배경, 결과를 한 줄로 묶기',
      '자료 문제는 핵심 단어 표시 → 시대 판별 → 선택지 소거 순서로 풀기',
    ],
  };
}
