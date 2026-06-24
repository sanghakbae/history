import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpenCheck,
  CircleCheck,
  Flame,
  GraduationCap,
  History,
  LineChart,
  LogIn,
  LogOut,
  NotebookPen,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import {
  auth,
  db,
  isFirebaseConfigured,
  approveStudentForParent,
  getStudentApproval,
  listStudentUsers,
  listStudyLogs,
  signInWithGoogle,
  signOutUser,
  subscribeToAuth,
  upsertUserProfile,
} from './services/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { grades, totalQuestionCount } from './data/curriculum';
import './styles.css';

const leaderboard = [];
const xpPenaltyGuideKeys = new Set(['timeline', 'eliminate']);

function calculateAwardedXp(question, usedGuides = []) {
  const penaltyCount = usedGuides.filter((key) => xpPenaltyGuideKeys.has(key)).length;
  return Math.max(0, Math.round(question.xp * (1 - penaltyCount * 0.05)));
}

function App() {
  const isManagerRoute = window.location.pathname.startsWith('/manager');
  const isParentRoute = window.location.pathname.startsWith('/parent');
  const [role, setRole] = useState(isManagerRoute ? 'admin' : isParentRoute ? 'parent' : '');
  const [selectedGrade, setSelectedGrade] = useState(grades[0]);
  const [selectedUnitId, setSelectedUnitId] = useState(grades[0].units[0].id);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  const [studySplit, setStudySplit] = useState(50);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [solvedQuestionIds, setSolvedQuestionIds] = useState(() => new Set());
  const [usedGuidesByQuestion, setUsedGuidesByQuestion] = useState({});
  const [approvedChild, setApprovedChild] = useState(() => localStorage.getItem('historyApprovedChild') || '');

  useEffect(() => {
    if (isManagerRoute) {
      setRole('admin');
    } else if (isParentRoute) {
      setRole('parent');
    } else if (!user) {
      setRole('');
    }
  }, [isManagerRoute, isParentRoute, user]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthReady(true);
      return undefined;
    }

    return subscribeToAuth(async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (nextUser) {
        const storedRole =
          sessionStorage.getItem('historyPendingLoginRole') ||
          localStorage.getItem('historyLoginRole') ||
          role ||
          'student';
        setRole(storedRole);
        await upsertUserProfile(nextUser, storedRole);
        if (storedRole === 'student') {
          const localApproval =
            localStorage.getItem(`historyApprovedStudent:${nextUser.uid}`) ||
            localStorage.getItem('historyApprovedChild');
          if (localApproval) {
            localStorage.setItem(`historyApprovedStudent:${nextUser.uid}`, localApproval);
            setApprovedChild(localApproval);
          } else {
            try {
              const approval = await getStudentApproval(nextUser.uid);
              if (approval) {
                const approvedName = approval.studentName || nextUser.displayName || nextUser.email || nextUser.uid;
                localStorage.setItem(`historyApprovedStudent:${nextUser.uid}`, approvedName);
                setApprovedChild(approvedName);
              } else {
                setApprovedChild('');
              }
            } catch {
              setApprovedChild('');
            }
          }
          try {
            const logs = await listStudyLogs(nextUser.uid);
            const restoredSolvedIds = new Set(logs.map((log) => log.questionId).filter(Boolean));
            const restoredGuides = logs.reduce((guides, log) => {
              if (!log.questionId || !Array.isArray(log.usedGuides)) return guides;
              return { ...guides, [log.questionId]: log.usedGuides };
            }, {});
            setSolvedQuestionIds(restoredSolvedIds);
            setUsedGuidesByQuestion(restoredGuides);
          } catch {
            setSolvedQuestionIds(new Set());
            setUsedGuidesByQuestion({});
          }
        }
        setSelectedGrade(grades[0]);
        setSelectedUnitId(grades[0].units[0].id);
        setSelectedQuestionIndex(0);
      }
    });
  }, [role]);

  const totalProgress = useMemo(
    () => Math.round(grades.reduce((sum, item) => sum + item.progress, 0) / grades.length),
    [],
  );

  const selectedUnit = useMemo(
    () => selectedGrade.units.find((unit) => unit.id === selectedUnitId) ?? selectedGrade.units[0],
    [selectedGrade, selectedUnitId],
  );
  const selectedQuestion = selectedUnit.questions[selectedQuestionIndex] ?? selectedUnit.questions[0];
  const allUnits = useMemo(
    () => grades.flatMap((grade) => grade.units.map((unit) => ({ grade, unit }))),
    [],
  );
  const allQuestions = useMemo(
    () => allUnits.flatMap(({ unit }) => unit.questions),
    [allUnits],
  );
  const earnedXp = useMemo(
    () =>
      allQuestions.reduce((total, question) => {
        if (!solvedQuestionIds.has(question.id)) return total;
        return total + calculateAwardedXp(question, usedGuidesByQuestion[question.id] || []);
      }, 0),
    [allQuestions, solvedQuestionIds, usedGuidesByQuestion],
  );
  const currentRank = earnedXp > 0 ? 1 : null;

  useEffect(() => {
    setSelectedQuestionIndex(0);
  }, [selectedUnit.id]);

  function getSolvedCount(unit, solvedIds = solvedQuestionIds) {
    return unit.questions.filter((question) => solvedIds.has(question.id)).length;
  }

  function isUnitComplete(unit, solvedIds = solvedQuestionIds) {
    return unit.questions.length > 0 && getSolvedCount(unit, solvedIds) >= unit.questions.length;
  }

  function isUnitUnlockedById(unitId, solvedIds = solvedQuestionIds) {
    const globalIndex = allUnits.findIndex(({ unit }) => unit.id === unitId);
    if (globalIndex <= 0) return true;
    return isUnitComplete(allUnits[globalIndex - 1].unit, solvedIds);
  }

  function isUnitUnlocked(grade, unitIndex) {
    const targetUnit = grade.units[unitIndex];
    if (!targetUnit) return false;
    return isUnitUnlockedById(targetUnit.id);
  }

  function getFirstUnlockedUnit(grade) {
    return grade.units.find((unit) => isUnitUnlockedById(unit.id)) ?? grade.units[0];
  }

  function handleSelectGrade(grade, unitId) {
    const targetUnit = unitId
      ? grade.units.find((unit) => unit.id === unitId)
      : getFirstUnlockedUnit(grade);
    if (!targetUnit || !isUnitUnlockedById(targetUnit.id)) {
      setNotice('이전 스킬의 모든 문항을 완료하면 열립니다.');
      return;
    }
    setSelectedGrade(grade);
    setSelectedUnitId(targetUnit.id);
    setSelectedQuestionIndex(0);
  }

  function handleSelectUnit(unitId) {
    handleSelectGrade(selectedGrade, unitId);
  }

  function startStudyResize(event) {
    const container = event.currentTarget.parentElement;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);

    function move(pointerEvent) {
      const rect = container.getBoundingClientRect();
      const next = ((pointerEvent.clientX - rect.left) / rect.width) * 100;
      setStudySplit(Math.min(68, Math.max(32, next)));
    }

    function stop() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    }

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  }

  async function handleGoogleSignIn(loginRole = role || (isManagerRoute ? 'admin' : isParentRoute ? 'parent' : 'student')) {
    if (!isFirebaseConfigured) {
      setNotice('Firebase 환경 변수를 입력하면 Google 로그인이 활성화됩니다.');
      return;
    }
    setRole(loginRole);
    localStorage.setItem('historyLoginRole', loginRole);
    sessionStorage.setItem('historyPendingLoginRole', loginRole);
    const credential = await signInWithGoogle();
    await upsertUserProfile(credential.user, loginRole);
    sessionStorage.removeItem('historyPendingLoginRole');
    setNotice('Google 계정으로 로그인되었습니다.');
    if (loginRole === 'parent' && !isParentRoute) {
      window.location.assign('/parent');
    }
    if (loginRole === 'student' && (isParentRoute || isManagerRoute)) {
      window.location.assign('/');
    }
  }

  async function handleApproveChild(child) {
    const childName = child.displayName || child.email || child.id;
    localStorage.setItem('historyApprovedChild', childName);
    localStorage.setItem(`historyApprovedStudent:${child.id}`, childName);
    try {
      await approveStudentForParent(user, child);
      setApprovedChild(childName);
      setNotice(`${childName} 자녀가 등록되었습니다. 다음부터 다시 묻지 않습니다.`);
    } catch {
      setApprovedChild(childName);
      setNotice(`${childName} 자녀가 이 브라우저에 등록되었습니다. Firestore 규칙 배포 후 계정에도 저장됩니다.`);
    }
  }

  async function handleCompleteMission(question) {
    if (solvedQuestionIds.has(question.id)) return;
    const usedGuides = usedGuidesByQuestion[question.id] || [];
    const awardedXp = calculateAwardedXp(question, usedGuides);
    const nextSolvedIds = new Set(solvedQuestionIds);
    nextSolvedIds.add(question.id);
    const completedUnit = isUnitComplete(selectedUnit, nextSolvedIds);
    setSolvedQuestionIds((current) => {
      if (current.has(question.id)) return current;
      const next = new Set(current);
      next.add(question.id);
      return next;
    });
    setNotice(
      completedUnit
        ? `${selectedUnit.title} 완료. 다음 스킬을 선택할 수 있습니다. +${awardedXp} XP`
        : `${selectedUnit.title} ${getSolvedCount(selectedUnit, nextSolvedIds)}/${selectedUnit.questions.length}문제 완료. +${awardedXp} XP`,
    );
    if (!isFirebaseConfigured || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'studyLogs', auth.currentUser.uid, 'logs'), {
        role,
        gradeId: selectedGrade.id,
        gradeLabel: selectedGrade.label,
        unitId: selectedUnit.id,
        unitTitle: selectedUnit.title,
        questionId: question.id,
        questionTitle: question.title,
        points: awardedXp,
        basePoints: question.xp,
        usedGuides,
        createdAt: serverTimestamp(),
      });
    } catch {
      setNotice('화면 진행도는 반영되었습니다. Firestore 규칙 배포 후 서버에도 저장됩니다.');
    }
  }

  function handleUseGuide(questionId, guideKey) {
    if (!xpPenaltyGuideKeys.has(guideKey)) return;
    setUsedGuidesByQuestion((current) => {
      const used = current[questionId] || [];
      if (used.includes(guideKey)) return current;
      return { ...current, [questionId]: [...used, guideKey] };
    });
  }

  async function handleSaveNote() {
    const trimmed = note.trim();
    if (!trimmed) return;
    setNotice('풀이 노트가 저장되었습니다.');
    setNote('');

    if (!isFirebaseConfigured || !auth.currentUser) return;

    await addDoc(collection(db, 'notes', auth.currentUser.uid, 'items'), {
      role,
      gradeId: selectedGrade.id,
      body: trimmed,
      createdAt: serverTimestamp(),
    });
  }

  if (!authReady || !user) {
    return (
      <LoginScreen
        isManager={isManagerRoute}
        authReady={authReady}
        notice={notice}
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  if (isManagerRoute && localStorage.getItem('historyLoginRole') !== 'admin') {
    return (
      <LoginScreen
        isManager
        authReady={authReady}
        notice="관리자 계정으로 다시 로그인하세요."
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  if (isParentRoute && localStorage.getItem('historyLoginRole') !== 'parent') {
    return (
      <LoginScreen
        isManager={false}
        authReady={authReady}
        notice="학부모 계정으로 다시 로그인하세요."
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  if (isManagerRoute) {
    return (
      <main className="arenaShell managerShell">
        <header className="arenaTopbar">
          <div className="arenaBrand">
            <span className="brandMark">
              <History size={22} />
            </span>
            <span>
              <strong>History Study Arena</strong>
              <small>관리자 페이지</small>
            </span>
          </div>
          <div className="arenaActions">
            <span className="topChip strong">{user.displayName || user.email}</span>
            <button className="topChip" onClick={signOutUser}>
              <LogOut size={15} />
              로그아웃
            </button>
          </div>
        </header>
        <ManagerBoard />
      </main>
    );
  }

  if (isParentRoute || role === 'parent') {
    return (
      <main className="arenaShell managerShell">
        <header className="arenaTopbar">
          <div className="arenaBrand">
            <span className="brandMark">
              <History size={22} />
            </span>
            <span>
              <strong>History Study Arena</strong>
              <small>학부모 페이지</small>
            </span>
          </div>
          <div className="arenaActions">
            <span className="topChip strong">{user.displayName || user.email}</span>
            <button className="topChip" onClick={signOutUser}>
              <LogOut size={15} />
              로그아웃
            </button>
          </div>
        </header>
        <ParentDashboard onApproveChild={handleApproveChild} approvedChild={approvedChild} />
      </main>
    );
  }

  if (!approvedChild) {
    return (
      <PendingApprovalScreen
        user={user}
        notice={notice}
        onSignOut={signOutUser}
      />
    );
  }

  return (
    <main className="arenaShell">
      <header className="arenaTopbar">
        <div className="arenaBrand">
          <span className="brandMark">
            <History size={22} />
          </span>
          <span>
            <strong>History Study Arena</strong>
            <small>중등부터 고등까지, 시대 흐름을 열며 푸는 역사</small>
          </span>
        </div>
        <div className="arenaActions">
          <button className="topChip active" onClick={() => setRole('student')}>
            <GraduationCap size={15} />
            학생
          </button>
          <span className="topChip strong">
            <Trophy size={15} />
            순위 {currentRank ? `#${currentRank}` : '-'}
          </span>
          <span className="topChip strong">
            <Flame size={15} />
            {earnedXp.toLocaleString()} XP
          </span>
          <span className="topChip strong questionCountChip">{totalQuestionCount}문항</span>
          <button className="topChip" onClick={signOutUser}>
            <LogOut size={15} />
            로그아웃
          </button>
        </div>
      </header>

      <section className="arenaGrid">
        <SkillTree
          selectedGrade={selectedGrade}
          selectedUnit={selectedUnit}
          getSolvedCount={getSolvedCount}
          isUnitUnlockedById={isUnitUnlockedById}
          onSelectGrade={handleSelectGrade}
        />
        <RankingPanel user={user} earnedXp={earnedXp} currentRank={currentRank} />
        <div className="studySplit" style={{ '--study-left': `${studySplit}%` }}>
          <ChallengePanel
            selectedGrade={selectedGrade}
            selectedUnit={selectedUnit}
            selectedQuestion={selectedQuestion}
            selectedQuestionIndex={selectedQuestionIndex}
            solvedQuestionIds={solvedQuestionIds}
            usedGuides={usedGuidesByQuestion[selectedQuestion.id] || []}
            onSelectQuestion={setSelectedQuestionIndex}
            onSelectUnit={handleSelectUnit}
            onComplete={handleCompleteMission}
          />
          <button
            className="splitHandle"
            type="button"
            aria-label="문제와 풀이 도우미 폭 조절"
            onPointerDown={startStudyResize}
          />
          <TutorPanel question={selectedQuestion} onUseGuide={handleUseGuide} />
        </div>
      </section>

      {notice && (
        <div className="toast" role="status">
          <CircleCheck size={18} />
          {notice}
        </div>
      )}
    </main>
  );
}

function LoginScreen({ isManager, authReady, notice, onGoogleSignIn }) {
  return (
    <main className="loginScreen">
      <section className="loginArt">
        <div className="loginPanel">
          <span className="brandMark loginBrandMark">
            <History size={30} />
          </span>
          <h1>{isManager ? '관리자 페이지 접속' : 'History Study Arena'}</h1>
          <p className={isManager ? 'managerLoginWarning' : ''}>
            {isManager
              ? '관리자만 접속이 가능합니다.'
              : '중1부터 고3까지, 한국사와 세계사 흐름을 문제로 익히는 학습장입니다.'}
          </p>
          {!isManager && (
            <div className="loginRoleGrid" role="group" aria-label="로그인 역할 선택">
              <button
                type="button"
                disabled={!authReady}
                onClick={() => onGoogleSignIn('student')}
              >
                <GraduationCap size={18} />
                <strong>학생</strong>
                <span>학부모 승인 후 문제 풀이</span>
              </button>
            <button
              type="button"
              disabled={!authReady}
              onClick={() => onGoogleSignIn('parent')}
            >
              <Users size={18} />
              <strong>학부모</strong>
              <span>자녀 학습 현황 확인</span>
            </button>
            </div>
          )}
          {isManager && (
            <button className="googleLoginButton" disabled={!authReady} onClick={() => onGoogleSignIn('admin')}>
              <LogIn size={15} />
              Google 로그인
            </button>
          )}
          {notice && <strong className="loginNotice">{notice}</strong>}
        </div>
      </section>
    </main>
  );
}

function PendingApprovalScreen({ user, notice, onSignOut }) {
  return (
    <main className="approvalScreen">
      <section className="approvalCard">
        <span className="brandMark loginBrandMark">
          <History size={30} />
        </span>
        <h1>학부모 승인 대기</h1>
        <p>
          {user?.displayName || user?.email} 계정으로 로그인되었습니다. 학부모가 자녀를 선택하면 중1 자료와 역사 해석부터
          학습을 시작할 수 있습니다.
        </p>
        <div className="approvalSteps">
          <span>1. 학생 로그인 완료</span>
          <span>2. 학부모가 자녀 선택</span>
          <span>3. 승인 후 문제 풀이 시작</span>
        </div>
        <button type="button" onClick={onSignOut}>
          다른 계정으로 로그인
        </button>
        {notice && <strong className="loginNotice">{notice}</strong>}
      </section>
    </main>
  );
}

function ParentDashboard({ onApproveChild, approvedChild }) {
  const [childQuery, setChildQuery] = useState('');
  const [children, setChildren] = useState([]);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [childrenError, setChildrenError] = useState('');
  const activities = [];
  const searched = childQuery.trim().length > 0;
  const filteredChildren = searched
    ? children.filter((child) =>
        `${child.displayName ?? ''} ${child.email ?? ''} ${child.grade ?? ''}`.toLowerCase().includes(childQuery.trim().toLowerCase()),
      )
    : [];

  useEffect(() => {
    let alive = true;
    setChildrenLoading(true);
    setChildrenError('');
    listStudentUsers()
      .then((items) => {
        if (alive) setChildren(items);
      })
      .catch(() => {
        if (alive) setChildrenError('학생 목록을 불러오지 못했습니다. Firestore 권한을 확인하세요.');
      })
      .finally(() => {
        if (alive) setChildrenLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="parentDashboard">
      <div className="parentMain">
        <div className="arenaPanel managerPanel">
          <div className="sectionTitle compact">
            <Users size={18} />
            <h2>자녀 학습 현황</h2>
          </div>
          <input
            className="managerSearch"
            value={childQuery}
            placeholder="자녀 이름 또는 이메일로 검색"
            onChange={(event) => setChildQuery(event.target.value)}
          />
          <div className="childCards">
            {!searched && (
              <p className="emptyState">자녀 이름 또는 이메일을 검색하면 학생 목록이 표시됩니다.</p>
            )}
            {childrenLoading && <p className="emptyState">학생 목록을 불러오는 중입니다.</p>}
            {childrenError && <p className="emptyState errorState">{childrenError}</p>}
            {searched && filteredChildren.length === 0 && (
              <p className="emptyState">검색 결과가 없습니다.</p>
            )}
            {filteredChildren.map((child, index) => (
              <article key={child.id} className="childCard">
                <header>
                  <span className="childAvatar"><Users size={18} /></span>
                  <div>
                    <strong>자녀({child.displayName || child.email}) · {child.grade || '학년 미지정'}</strong>
                    <small>검색 결과 {filteredChildren.length}명 중 {index + 1}번째</small>
                  </div>
                  <b>{(child.xp ?? 0).toLocaleString()} XP</b>
                </header>
                <div className="childMetrics">
                  <Stat icon={Flame} label="XP" value={(child.xp ?? 0).toLocaleString()} />
                  <Stat icon={BookOpenCheck} label="문제 해결" value={child.solved ?? 0} />
                  <Stat icon={LineChart} label="평균 XP 대비" value={child.avgXp ?? '-'} />
                  <Stat icon={Target} label="평균 해결 수 대비" value={child.avgSolved ?? '-'} />
                </div>
                <section className="childSection">
                  <h3>상단 요약</h3>
                  <div><span>현재 진행 단원</span><strong>자료와 역사 해석</strong></div>
                  <div><span>전체 완료율</span><strong>{child.completion ?? '-'}</strong></div>
                  <div><span>최근 7일 해결</span><strong>0문제</strong></div>
                  <div><span>최근 7일 정답률</span><strong>-</strong></div>
                </section>
                <section className="childSection">
                  <h3>위험 신호</h3>
                  <div><span>반복 오답 문제</span><strong>없음</strong></div>
                  <div><span>힌트 많이 쓴 단원</span><strong>없음</strong></div>
                  <div><span>오래 멈춘 단원</span><strong>기록 없음</strong></div>
                </section>
                <section className="childSection">
                  <h3>비교/성장</h3>
                  <div><span>같은 학년 평균 대비</span><strong>{child.avgSolved ?? '-'}</strong></div>
                  <div><span>지난주 대비</span><strong>0</strong></div>
                  <div><span>랭킹 변화</span><strong>{child.rank ?? '-'}</strong></div>
                </section>
                <button type="button" onClick={() => onApproveChild(child)}>
                  {approvedChild === (child.displayName || child.email || child.id) ? '선택된 자녀' : '자녀 선택'}
                </button>
              </article>
            ))}
          </div>
        </div>
        <div className="arenaPanel managerPanel">
          <div className="sectionTitle compact">
            <BookOpenCheck size={18} />
            <h2>자녀 학습 기록</h2>
          </div>
          <p className="managerSubtitle">최근 활동</p>
          <div className="activityTableWrap">
            <table className="activityTable">
              <thead>
                <tr>
                  <th>자녀</th>
                  <th>날짜</th>
                  <th>구분</th>
                  <th>문제</th>
                  <th>입력 답</th>
                  <th>상태</th>
                  <th>사용한 도움</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((row) => (
                  <tr key={row.join('-')}>
                    {row.map((cell, index) => (
                      <td key={`${cell}-${index}`} className={index === 5 ? 'positiveCell' : ''}>{cell}</td>
                    ))}
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan="7">학습 기록이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManagerBoard() {
  const [managerTab, setManagerTab] = useState('members');
  const members = [];

  return (
    <section className="managerBoard">
      <aside className="managerSidebar">
        <button className={managerTab === 'members' ? 'active' : ''} type="button" onClick={() => setManagerTab('members')}><Users size={16} />회원 관리</button>
        <button className={managerTab === 'stats' ? 'active' : ''} type="button" onClick={() => setManagerTab('stats')}><LineChart size={16} />학습 통계</button>
        <button className={managerTab === 'problems' ? 'active' : ''} type="button" onClick={() => setManagerTab('problems')}><BookOpenCheck size={16} />문제 관리</button>
        <button className={managerTab === 'logs' ? 'active' : ''} type="button" onClick={() => setManagerTab('logs')}><NotebookPen size={16} />감사 로그</button>
        <button className={managerTab === 'usage' ? 'active' : ''} type="button" onClick={() => setManagerTab('usage')}><Sparkles size={16} />사용량</button>
      </aside>
      <div className="arenaPanel managerPanel managerConsole">
        {managerTab === 'members' && <MemberManager members={members} />}
        {managerTab === 'stats' && <LearningStats />}
        {managerTab === 'problems' && <ProblemManager />}
        {managerTab === 'logs' && <AuditLog />}
        {managerTab !== 'members' && managerTab !== 'stats' && managerTab !== 'problems' && managerTab !== 'logs' && <ManagerPlaceholder tab={managerTab} />}
      </div>
    </section>
  );
}

function MemberManager({ members }) {
  return (
    <>
      <div className="sectionTitle compact">
        <Users size={18} />
        <h2>회원 관리</h2>
      </div>
      <p className="managerSubtitle">회원 관리</p>
      <div className="memberTableWrap">
        <table className="memberTable">
          <thead>
            <tr>
              <th>회원</th>
              <th>이름</th>
              <th>학년</th>
              <th>XP</th>
              <th>해결</th>
              <th>초기화</th>
              <th>권한</th>
              <th>자녀</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.email}>
                <td>
                  <strong>{member.type}</strong>
                  <span>{member.email}</span>
                </td>
                <td><input defaultValue={member.name} /></td>
                <td><input defaultValue={member.grade} /></td>
                <td><input defaultValue={member.xp} /></td>
                <td><input defaultValue={member.solved} /></td>
                <td><button className="resetButton" type="button">초기화</button></td>
                <td>
                  <select defaultValue={member.role}>
                    <option value="student">학생</option>
                    <option value="parent">학부모</option>
                    <option value="admin">관리자(서비스 운영자)</option>
                  </select>
                </td>
                <td>
                  {member.role === 'parent' ? (
                    <select defaultValue={member.child}>
                      <option>-</option>
                    </select>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="8">회원 데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function LearningStats() {
  return (
    <>
      <div className="managerPanelHeader">
        <div className="sectionTitle compact">
          <LineChart size={18} />
          <h2>학습 통계</h2>
        </div>
        <div className="managerTools">
          <select defaultValue="all">
            <option value="all">전체 학생</option>
          </select>
          <button type="button">리포트 출력</button>
          <button type="button" disabled>부모에게 발송</button>
        </div>
      </div>
      <div className="statSummaryGrid">
        <Stat icon={Users} label="전체 학생" value="0명" />
        <Stat icon={BookOpenCheck} label="해결 문제" value="0개" />
        <Stat icon={Target} label="평균 해결" value="0개" />
        <Stat icon={CircleCheck} label="정답률" value="-" />
      </div>
      <div className="statsGrid">
        <section className="statChartPanel">
          <h3>전체 스킬 완료 현황</h3>
          <DonutChart value="0" label="완료" colors={['#14b8a6', '#38bdf8', '#f59e0b']} />
          <p><span className="dot teal" />완료 스킬 0 <span className="dot blue" />진행 중 스킬 0 <span className="dot amber" />미완료 스킬 0</p>
        </section>
        <section className="statChartPanel">
          <h3>스킬별 해결 수</h3>
          <DonutChart value="0" label="해결" colors={['#14b8a6', '#38bdf8', '#f59e0b']} />
          <p>표시할 데이터가 없습니다.</p>
        </section>
        <section className="statChartPanel empty">
          <h3>스킬별 오답 수</h3>
          <p>표시할 데이터가 없습니다.</p>
        </section>
        <section className="statChartPanel empty">
          <h3>스킬별 도움 사용량</h3>
          <p>표시할 데이터가 없습니다.</p>
        </section>
      </div>
      <section className="weeklyPanel">
        <h3>최근 7일 학습 흐름</h3>
        <div className="weeklyBars">
          {['06. 19.', '06. 20.', '06. 21.', '06. 22.', '06. 23.', '06. 24.', '06. 25.'].map((day) => (
            <div key={day}>
              <i />
              <strong>0</strong>
              <span>{day}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function DonutChart({ value, label }) {
  return (
    <div className="donutChart">
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ManagerPlaceholder({ tab }) {
  const labels = { problems: '문제 관리', logs: '감사 로그', usage: '사용량' };
  return (
    <div className="managerPlaceholder">
      <h2>{labels[tab]}</h2>
      <p>화면 구성을 준비 중입니다.</p>
    </div>
  );
}

function AuditLog() {
  return (
    <>
      <div className="managerPanelHeader">
        <div className="sectionTitle compact">
          <NotebookPen size={18} />
          <h2>감사 로그</h2>
        </div>
        <div className="managerTools">
          <input className="auditSearch" placeholder="학생, 문제, 결과 검색" />
        </div>
      </div>
      <div className="auditTableWrap">
        <table className="auditTable">
          <thead>
            <tr>
              <th>날짜</th>
              <th>학생</th>
              <th>구분</th>
              <th>문제</th>
              <th>입력 답</th>
              <th>결과</th>
              <th>사용한 도움</th>
            </tr>
          </thead>
        </table>
        <p>검색 결과가 없습니다.</p>
      </div>
    </>
  );
}

function ProblemManager() {
  const unit = grades[0].units[0];
  const rows = unit.questions.slice(0, 15);

  return (
    <>
      <div className="managerPanelHeader">
        <div className="sectionTitle compact">
          <BookOpenCheck size={18} />
          <h2>문제 관리</h2>
        </div>
        <div className="managerTools">
          <select defaultValue={unit.id}>
            <option value={unit.id}>중1 · {unit.title}</option>
          </select>
          <input className="problemSearch" placeholder="문제, 정답, 힌트 검색" />
        </div>
      </div>
      <div className="statSummaryGrid problemSummaryGrid">
        <Stat icon={BookOpenCheck} label="전체 문제" value={`${unit.questions.length}개`} />
        <Stat icon={Target} label="조회 결과" value={`${unit.questions.length}개`} />
        <Stat icon={Users} label="화면 표시" value={`${unit.questions.length}개`} />
        <Stat icon={CircleCheck} label="상태" value="준비" />
      </div>
      <div className="problemAdminTableWrap">
        <table className="problemAdminTable">
          <thead>
            <tr>
              <th>단원</th>
              <th>번호</th>
              <th>난이도</th>
              <th>문제</th>
              <th>정답</th>
              <th>힌트</th>
              <th>풀이 방향</th>
              <th>개념 학습</th>
              <th>저장</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((question, index) => (
              <tr key={question.id}>
                <td>{unit.title}</td>
                <td>{index + 1}</td>
                <td><input defaultValue={question.difficulty} /></td>
                <td><textarea defaultValue={question.stem} /></td>
                <td><input defaultValue={question.choices[question.answerIndex]} /></td>
                <td><textarea defaultValue={`## 힌트\n### 단원: ${unit.title}\n- 자료의 핵심 단어를 먼저 확인하세요.`} /></td>
                <td><textarea defaultValue={`## 다음 한 단계\n- 단원: ${unit.title}\n- 개념: ${question.source}`} /></td>
                <td><textarea defaultValue={`## 개념 다시보기\n### ${unit.title}\n- ${question.source}`} /></td>
                <td><button type="button" disabled>저장</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SkillTree({ selectedGrade, selectedUnit, getSolvedCount, isUnitUnlockedById, onSelectGrade }) {
  return (
    <section className="arenaPanel skillTreePanel">
      <div className="sectionTitle compact">
        <BookOpenCheck size={18} />
        <h2>스킬 트리</h2>
      </div>
      <div className="skillColumns">
        {grades.map((grade) => (
          <div className="skillColumn" key={grade.id} style={{ '--accent': grade.color }}>
            <button
              className={selectedGrade.id === grade.id ? 'gradeTab selected' : 'gradeTab'}
              onClick={() => onSelectGrade(grade)}
            >
              {grade.label}
            </button>
            <div className="skillNodes">
              {grade.units.map((unit) => {
                const unlocked = isUnitUnlockedById(unit.id);
                return (
                <button
                  key={unit.id}
                  className={[
                    'skillNode',
                    selectedUnit.id === unit.id ? 'active' : '',
                    unlocked ? '' : 'locked',
                    getSolvedCount(unit) === unit.questions.length ? 'complete' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={!unlocked}
                  onClick={() => onSelectGrade(grade, unit.id)}
                >
                  <b>{unit.title}</b>
                </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RankingPanel({ user, earnedXp, currentRank }) {
  const currentName = user?.displayName || user?.email?.split('@')[0] || '학생';
  const currentRow =
    earnedXp > 0
      ? {
          name: currentName,
          grade: '중1',
          score: earnedXp,
          tone: 'gold',
          rank: currentRank,
        }
      : null;
  const rankingRows = currentRow ? [currentRow, ...leaderboard] : leaderboard;

  return (
    <aside className="arenaPanel rankingPanel">
      <div className="sectionTitle compact">
        <Trophy size={18} />
        <h2>랭킹</h2>
      </div>
      <div className="currentRankCard">
        <div>
          <span>현재 순위</span>
          <strong>{currentRank ? `#${currentRank}` : '-'}</strong>
        </div>
        <i>
          <b style={{ width: earnedXp > 0 ? '18%' : '0%' }} />
        </i>
        <p>
          {currentName} · {earnedXp > 0 ? `${earnedXp.toLocaleString()} XP` : '학습 기록 없음'}
        </p>
      </div>
      <div className="rankDivider">
        <span>전체 순위</span>
      </div>
      <div className="leaderboard rankingList">
        {rankingRows.length === 0 && <p className="emptyState">아직 풀이 기록이 없습니다.</p>}
        {rankingRows.slice(0, 5).map((row, index) => (
          <div className={`rankRow rankTone-${row.tone}`} key={`${row.name}-${index}`}>
            <span>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</span>
            <em>
              {typeof row.avatar === 'string' && row.avatar.startsWith('http') ? (
                <img src={row.avatar} alt="" />
              ) : (
                row.avatar
              )}
            </em>
            <strong title={`${row.name} (${row.grade})`}>
              {row.name} ({row.grade})
            </strong>
            <b>{row.score.toLocaleString()} XP</b>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ChallengePanel({
  selectedGrade,
  selectedUnit,
  selectedQuestion,
  selectedQuestionIndex,
  solvedQuestionIds,
  usedGuides,
  onSelectQuestion,
  onSelectUnit,
  onComplete,
}) {
  const question = selectedQuestion;
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const isCorrect = selectedChoice === question.answerIndex;
  const awardedXp = calculateAwardedXp(question, usedGuides);
  const penaltyCount = usedGuides.filter((key) => xpPenaltyGuideKeys.has(key)).length;
  const solvedInUnit = selectedUnit.questions.filter((item) => solvedQuestionIds.has(item.id)).length;
  const isSolved = solvedQuestionIds.has(question.id);
  const unitProgress = selectedUnit.questions.length > 0
    ? Math.round((solvedInUnit / selectedUnit.questions.length) * 100)
    : 0;

  useEffect(() => {
    setSelectedChoice(null);
    setCelebrate(false);
    setShowWrongFeedback(false);
  }, [question.id]);

  useEffect(() => {
    if (selectedChoice === null || selectedChoice === question.answerIndex) {
      setShowWrongFeedback(false);
      return undefined;
    }

    setShowWrongFeedback(true);
    const timer = window.setTimeout(() => setShowWrongFeedback(false), 1400);
    return () => window.clearTimeout(timer);
  }, [selectedChoice, question.answerIndex, question.id]);

  function chooseAnswer(index) {
    setSelectedChoice(index);
    if (index === question.answerIndex) {
      setCelebrate(true);
      if (!isSolved) {
        onComplete(question);
      }
      window.setTimeout(() => setCelebrate(false), 1200);
    }
  }

  return (
    <section className="arenaPanel challengePanel">
      <div className="challengeHeader">
        <div>
          <p className="eyebrow">{selectedGrade.label} · 한국사</p>
          <h2>{selectedGrade.course}</h2>
        </div>
        <select value={selectedUnit.id} aria-label="문제 선택" onChange={(event) => onSelectUnit(event.target.value)}>
          {selectedGrade.units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.questions[0].title}
            </option>
          ))}
        </select>
      </div>
      <div className="progressLine">
        <div className="progressHeader">
          <span>스킬 진행도</span>
          <b>{solvedInUnit}/{selectedUnit.questions.length}문제 완료 · 현재 {selectedQuestionIndex + 1}번</b>
        </div>
        <i style={{ width: `${unitProgress}%` }} />
      </div>
      <article className="problemCard">
        <div className="problemPrompt">
          <div className="problemMeta">
            <span>{'★'.repeat(question.difficulty ?? selectedUnit.difficulty)}{'☆'.repeat(5 - (question.difficulty ?? selectedUnit.difficulty))}</span>
            <b>{penaltyCount > 0 ? `+${awardedXp} XP (${penaltyCount * 5}% 차감)` : `+${question.xp} XP`}</b>
            <button>개념 학습</button>
          </div>
          <h3>{question.stem}</h3>
          {question.source && (
            <div className="sourceBox">
              <span>자료</span>
              <p>{question.source}</p>
            </div>
          )}
          {question.assets?.length > 0 && (
            <div className="problemAssets">
              {question.assets.map((asset) => (
                <figure key={asset.url}>
                  <img src={asset.url} alt={asset.label} loading="lazy" />
                  <figcaption>{asset.label}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
        <ol className="choiceList">
          {question.choices.map((choice, index) => (
            <li
              key={choice}
              className={[
                selectedChoice === index ? 'selectedChoice' : '',
                selectedChoice !== null && index === question.answerIndex ? 'answerChoice' : '',
                selectedChoice === index && index !== question.answerIndex ? 'wrongChoice' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>{index + 1}</span>
              <button onClick={() => chooseAnswer(index)}>{choice}</button>
            </li>
          ))}
        </ol>
        {selectedChoice !== null && (isCorrect || showWrongFeedback) && (
          <div className={isCorrect ? 'feedbackBox correct' : 'feedbackBox wrong'}>
            <strong>{isCorrect ? `정답입니다. +${awardedXp} XP` : '오답'}</strong>
            <p>{isCorrect ? question.explanation : question.mistakes[0]}</p>
          </div>
        )}
      </article>
      <div className="problemActions">
        <button onClick={() => onComplete(question)} disabled={isSolved}>
          {isSolved ? '완료됨' : '완료'}
        </button>
        <button
          onClick={() => onSelectQuestion(Math.min(selectedUnit.questions.length - 1, selectedQuestionIndex + 1))}
          disabled={selectedQuestionIndex >= selectedUnit.questions.length - 1}
        >
          다음 문항
        </button>
      </div>
      {celebrate && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => (
            <i key={index} style={{ '--x': `${(index % 12) * 8 + 4}%`, '--delay': `${(index % 6) * 0.04}s` }} />
          ))}
        </div>
      )}
    </section>
  );
}

function TutorPanel({ question, onUseGuide }) {
  const [activeGuide, setActiveGuide] = useState('concept');

  useEffect(() => {
    setActiveGuide('concept');
  }, [question.id]);

  const guideButtons = [
    { key: 'reading', label: '역사 읽기' },
    { key: 'timeline', label: '연표 힌트', meta: 'XP -5%' },
    { key: 'eliminate', label: '오답 소거', meta: 'XP -5%' },
    { key: 'concept', label: '개념 학습', meta: '기본 제공' },
  ];

  return (
    <aside className="arenaPanel tutorPanel">
      <div className="sectionTitle compact">
        <Sparkles size={18} />
        <h2>풀이 도우미</h2>
      </div>
      <div className="helperActions">
        {guideButtons.map((button) => (
          <button
            key={button.key}
            className={activeGuide === button.key ? 'active' : ''}
            type="button"
            onClick={() => {
              setActiveGuide(button.key);
              onUseGuide(question.id, button.key);
            }}
          >
            <span>{button.label}</span>
            {button.meta && <b>{button.meta}</b>}
          </button>
        ))}
      </div>
      <GuideContent question={question} activeGuide={activeGuide} />
    </aside>
  );
}

function GuideContent({ question, activeGuide }) {
  if (activeGuide === 'reading') {
    return (
      <div className="conceptBox">
        <h3>역사 읽기</h3>
        <p>{question.source}</p>
        <h3>자료 읽는 법</h3>
        <ol>
          {question.lesson.reading.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <h3>예시 적용</h3>
        <p>
          <strong>{question.lesson.example.prompt}</strong>
        </p>
        <p>{question.lesson.example.answer}</p>
      </div>
    );
  }

  if (activeGuide === 'timeline') {
    return (
      <div className="conceptBox">
        <h3>연표 힌트</h3>
        <p>
          이 문제는 시대 순서와 배경을 좁히는 도움입니다. 정답을 바로 외우기보다, 단서가 어느 시기에 놓이는지
          먼저 잡아야 합니다.
        </p>
        <ul>
          {question.lesson.context.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>문제 단서</h3>
        <ul>
          {question.concepts.map((concept) => (
            <li key={concept}>{concept}</li>
          ))}
        </ul>
        <h3>풀이 순서</h3>
        <ol>
          {question.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h3>마지막 확인</h3>
        <p>{question.explanation}</p>
      </div>
    );
  }

  if (activeGuide === 'eliminate') {
    return (
      <div className="conceptBox">
        <h3>오답 소거</h3>
        <p>
          선택지를 하나씩 지우는 도움입니다. 정답을 찍기 전에, 시대 범위와 핵심 표현이 맞지 않는 선택지를 먼저
          제거하세요.
        </p>
        <ul>
          {question.mistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
        <h3>선택지 확인</h3>
        <ol>
          {question.choices.map((choice, index) => (
            <li key={choice}>
              {index === question.answerIndex ? '남길 선택지: ' : '지울 선택지: '}
              {choice}
            </li>
          ))}
        </ol>
        <h3>정답 판단 기준</h3>
        <p>{question.explanation}</p>
      </div>
    );
  }

  return (
    <div className="conceptBox">
      <h3>개념 설명</h3>
      <p>{question.lesson.summary}</p>
      <h3>용어</h3>
      <dl className="termList">
        {question.lesson.terms.map((term) => (
          <div key={term.name}>
            <dt>{term.name}</dt>
            <dd>{term.body}</dd>
          </div>
        ))}
      </dl>
      <h3>암기 포인트</h3>
      <ul>
        {question.lesson.memory.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3>핵심 개념 요약</h3>
      <ul>
        {question.concepts.map((concept) => (
          <li key={concept}>{concept}</li>
        ))}
      </ul>
      <h3>해설</h3>
      <p>{question.explanation}</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
