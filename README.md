# History Study Arena

중1부터 고3까지 역사 과목을 학년별 퀘스트, 풀이 노트, 랭킹, 학부모 모니터링으로 운영하는 React + Vite 스터디 사이트입니다.

## 실행

```bash
npm run dev
```

## Firebase

`.env.example`을 복사해 `.env`를 만들고 Firebase Web App 값을 입력하세요.

Firebase Console에서 다음을 켭니다.

- Authentication: Google provider
- Firestore Database
- Authorized domains: 로컬 도메인, 배포 도메인

앱에서 사용하는 기본 컬렉션:

- `users/{uid}`
- `studyLogs/{uid}/logs/{logId}`
- `notes/{uid}/items/{noteId}`

Firestore rules 배포:

```bash
firebase deploy --only firestore:rules
```

## Cloudflare

Cloudflare Pages 배포 기준입니다.

- Build command: `npm run build`
- Output directory: `dist`
- DNS: `study.sanghak.kr` 또는 원하는 서브도메인을 Pages custom domain에 연결
- R2: `history-study-assets` 버킷 생성 후 공개 URL을 `VITE_CLOUDFLARE_R2_PUBLIC_URL`에 입력

`wrangler.toml`은 Pages 빌드 출력과 R2 바인딩 이름을 포함합니다.

R2를 S3 호환 API로 업로드 서버에서 사용할 때 필요한 값:

- Account ID
- Access Key ID
- Secret Access Key
- Endpoint: `https://<account-id>.r2.cloudflarestorage.com`
- Bucket: `history-study-assets`
