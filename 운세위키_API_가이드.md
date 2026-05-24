# 운세위키 사주 분석 API 연동 가이드

> **이 문서를 AI(ChatGPT, Claude 등)에게 전달하고 "이 API 연동해줘"라고 요청하면 바로 연동할 수 있습니다.**

---

## 빠른 시작 (30초 테스트)

아래 명령어에서 `YOUR_API_KEY`만 교체하면 바로 동작합니다.

```bash
curl -X POST https://luckyloveme.com/api/saju-full-analysis \
  -H "Content-Type: application/json" \
  -H "User-Agent: SajuBookClient/1.0" \
  -H "X-SAJU-BOOK-API-KEY: YOUR_API_KEY" \
  -d '{
    "birthYear": "1990",
    "birthMonth": "5",
    "birthDay": "15",
    "birthHour": "14",
    "birthMinute": "30",
    "calendarType": "양력",
    "gender": "male"
  }'
```

성공하면 JSON 응답이 돌아옵니다. 실패하면 `401` (키 오류) 또는 `400` (파라미터 오류)이 반환됩니다.

---

## 1. API 기본 정보

| 항목 | 값 |
|------|-----|
| **Endpoint** | `POST https://luckyloveme.com/api/saju-full-analysis` |
| **인증** | Header `X-SAJU-BOOK-API-KEY: YOUR_API_KEY` |
| **Content-Type** | `application/json` |
| **Rate Limit** | 분당 500회 |
| **날짜 범위** | 1900년 ~ 2100년 (양력/음력) |
| **응답 크기** | 전체 분석 시 약 5~10KB |

---

## 2. Request Body

### 필수 파라미터

| 파라미터 | 타입 | 설명 | 예시 |
|----------|------|------|------|
| `birthYear` | string | 출생년도 | `"1990"` |
| `birthMonth` | string | 출생월 | `"5"` |
| `birthDay` | string | 출생일 | `"15"` |
| `calendarType` | string | `"양력"` 또는 `"음력"` | `"양력"` |
| `gender` | string | `"male"` 또는 `"female"` | `"male"` |

### 선택 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `birthHour` | string | - | 출생시 (0-23). 없으면 시주 생략 |
| `birthMinute` | string | - | 출생분 (0-59) |
| `isLeapMonth` | boolean | `false` | 음력 윤달 여부 |
| `useYajasiRule` | boolean | `false` | 야자시/조자시 구분 (23~01시 출생 시 적용) |
| `fields` | string[] | 전체 | 원하는 분석 항목만 선택 (아래 참조) |

### 선택 가능한 fields (16종)

| Field | 설명 |
|-------|------|
| `"ganji"` | 사주팔자 천간지지 (년주, 월주, 일주, 시주) |
| `"sipseong"` | 십성 분석 (비겁성, 식상성, 재성, 관성, 인성) |
| `"sinStrength"` | 신강/신약 분석 (7단계 강약 판단) |
| `"daeun"` | 대운 분석 (10년 주기 운세) |
| `"seun"` | 세운 분석 (연간 운세) |
| `"gyeokguk"` | 격국 분석 (내격/외격 판별, 억부용신/희신/기신) |
| `"gyeokgukYongsin"` | 격국용신 분석 — 자평진전 체계 (격국용신/상신/기신, 성격·파격 판단, 합거·충거 감지) |
| `"twelveFortune"` | 12운성 분석 (장생~양, 에너지 레벨 1-12) |
| `"hapchung"` | 합충형해파 관계 분석 |
| `"guiin"` | 귀인 분석 (16종 귀인) |
| `"sibisinsals"` | 십이신살 분석 |
| `"bigyeonGeobjae"` | 비견/겁재 분석 |
| `"hongyeom"` | 홍염살 분석 |
| `"dohwa"` | 도화살 분석 |
| `"hwagae"` | 화개살 분석 |
| `"weolun"` | 월운 분석 (최근 3개월 + 현재 + 향후 11개월 = 총 15개월) |

> `fields`를 생략하면 **15종**이 반환됩니다. (`gyeokgukYongsin`은 명시적 요청 시에만 반환)

---

## 3. 요청 예시

### 전체 분석 (양력)
```json
{
  "birthYear": "1990",
  "birthMonth": "5",
  "birthDay": "15",
  "birthHour": "14",
  "birthMinute": "30",
  "calendarType": "양력",
  "gender": "male"
}
```

### 특정 항목만 요청
```json
{
  "birthYear": "1990",
  "birthMonth": "5",
  "birthDay": "15",
  "birthHour": "14",
  "birthMinute": "30",
  "calendarType": "양력",
  "gender": "male",
  "fields": ["ganji", "sipseong", "daeun", "seun"]
}
```

### 시간 정보 없이 요청
```json
{
  "birthYear": "2000",
  "birthMonth": "1",
  "birthDay": "1",
  "calendarType": "양력",
  "gender": "female",
  "fields": ["ganji", "sipseong", "sinStrength"]
}
```

### 음력 + 윤달 요청
```json
{
  "birthYear": "1984",
  "birthMonth": "10",
  "birthDay": "15",
  "birthHour": "14",
  "birthMinute": "30",
  "calendarType": "음력",
  "gender": "male",
  "isLeapMonth": true
}
```

---

## 4. Response 타입 정의

### 전체 구조
```typescript
{
  ganji?: GanjiInfo;                     // 천간지지
  sipseong?: SipseongResult;             // 십성
  sinStrength?: SinStrengthResult;       // 신강/신약
  daeun?: DaeunResult;                   // 대운 (10년 주기)
  seun?: SeunResult;                     // 세운 (연간)
  gyeokguk?: GyeokgukResult;            // 격국 (억부용신)
  gyeokgukYongsin?: GeokgukYongsinResult; // 격국용신 (자평진전 체계) — 명시 요청 시만
  twelveFortune?: TwelveFortuneResult;   // 12운성
  weolun?: WeolunResult;                 // 월운
  hapchung?: HapChungRelation[];         // 합충형해파
  guiin?: GuiinResult;                   // 귀인 (16종)
  sibisinsals?: SibisinsalResult;        // 십이신살
  bigyeonGeobjae?: BigyeonGeobjaeResult; // 비견/겁재
  hongyeom?: HongyeomResult;            // 홍염살
  dohwa?: DohwaResult;                  // 도화살
  hwagae?: HwagaeResult;                // 화개살
}
```

### ganji (천간지지)
```typescript
{
  year: {
    gan: string;         // 년간 (예: "경")
    ji: string;          // 년지 (예: "오")
    ganji: string;       // 년주 (예: "경오(庚午)")
    ganHanja: string;    // 년간 한자 (예: "庚")
    jiHanja: string;     // 년지 한자 (예: "午")
    fullHangul: string;  // 한글 (예: "경오")
    fullHanja: string;   // 한자 (예: "庚午")
    eumyang: {           // 음양 (전통 만세력 기준)
      gan: "양" | "음" | null;  // 천간 음양 (예: "양")
      ji: "양" | "음" | null;   // 지지 음양 (예: "양")
    };
    ohaeng: {            // 오행
      gan: "목" | "화" | "토" | "금" | "수" | null;  // 천간 오행 (예: "금")
      ji: "목" | "화" | "토" | "금" | "수" | null;   // 지지 오행 (예: "화")
    };
  };
  month: { /* 동일 구조 */ };
  day: { /* 동일 구조 */ };
  hour?: { /* 동일 구조, 시간 입력 시만 */ };
}
```

> `eumyang`/`ohaeng`은 천간·지지별로 분리 제공됩니다. 지지 음양은 전통 만세력 기준(자·인·진·오·신·술 = 양, 축·묘·사·미·유·해 = 음)이며, 십성 계산용 체용(體用) 음양과는 다릅니다.

### sipseong (십성)
```typescript
{
  sipseongs: Array<{
    position: string;    // "년간", "월지" 등
    ganji: string;       // 간지
    sipseong: string;    // "비견", "식신" 등
    type: "정" | "편";
    category: "비겁성" | "식상성" | "재성" | "관성" | "인성";
    meaning: string;     // 의미 설명
  }>;
  summary: {
    bigyeop: number;     // 비겁성 개수
    siksang: number;     // 식상성 개수
    jaeseong: number;    // 재성 개수
    gwanseong: number;   // 관성 개수
    inseong: number;     // 인성 개수
  };
  analysis: string;      // 종합 분석
  cheonganHap?: {        // 천간합 분석 (없을 수 있음)
    haps: Array<any>;
    hasAnyHap: boolean;
    hasAnyHaphwa: boolean;
    ohaengImpact: {
      originalCount: Record<"목"|"화"|"토"|"금"|"수", number>;
      afterHapCount: Record<"목"|"화"|"토"|"금"|"수", number>;
      changes: string[];
    };
    summary: string;
  };
}
```

### sinStrength (신강/신약)
```typescript
{
  isStrong: boolean;                    // 신강 여부
  strength: "태왕" | "신강" | "중강" | "중화" | "중약" | "신약" | "태약";
  level: number;                        // 1(태약) ~ 7(태왕)
  score: number;
  description: string;
  bigyeopCount: number;
  inseongCount: number;
  wolryeong: string;                    // 월령 정보
  deukryeong: boolean;                  // 득령 여부
  deukji: boolean;                      // 득지 여부
  deukse: boolean;                      // 득세 여부
  analysis: string;
  detailAnalysis: {
    scoreBreakdown: { year: number; month: number; day: number; hour: number; total: number; };
    supportElements: string[];
    weakenElements: string[];
  };
}
```

### daeun (대운)
```typescript
{
  direction: string;                    // "순행" | "역행"
  daeun_start_age: number;
  current_age: number;
  current_daeun: DaeunItem | null;
  next_daeun: DaeunItem | null;
  all_daeun: DaeunItem[];               // 전체 대운 목록
  // ... 기타 계산 정보
}

// DaeunItem
{
  sequence: number;
  age_start: number;
  age_end: number;
  ganji: string;          // 간지 (한글)
  ganji_hanja: string;    // 간지 (한자)
  start_date: string;
  year_start: number;
  year_end: number;
  sipseong?: {
    gan: string;
    ji: string;
    ganCategory: "비겁성" | "식상성" | "재성" | "관성" | "인성";
    jiCategory: "비겁성" | "식상성" | "재성" | "관성" | "인성";
    interpretation: string;
  };
  wongukInteraction?: {
    hapChungRelations: Array<{
      // 대운↔원국 합충: "합"|"충"|"형"|"해"|"파"|"육합"|"삼합"|"방합"|"원진" (기본형)
      type: string;
      source: string;
      target: string;
      sourcePosition?: string;  // "대운"
      targetPosition?: string;  // "년주"|"월주"|"일주"|"시주"
      meaning?: string;
    }>;
    yongsinRelation?: {         // 용신 관계 분석
      [key: string]: any;
    } | null;
  };
  twelveFortune?: TwelveFortuneItem | null;
}
```

### seun (세운)
```typescript
{
  currentSeun: SeunItem;
  nextSeun: SeunItem;
  recentSeuns: SeunItem[];        // 최근 5년
  upcomingSeuns: SeunItem[];      // 향후 12년
}

// SeunItem
{
  year: number;
  age: number;
  ganji: string;
  ganji_hanja: string;
  gan: string;
  ji: string;
  ganElement: string;
  jiElement: string;
  sipseongRelation?: { gan: string; ji: string; };
  interpretation?: string;
  // 세운↔원국 합충: "합"|"충"|"형"|"해"|"파"|"육합"|"삼합"|"방합"|"원진" (기본형)
  hapChungRelations?: Array<{
    type: string; source: string; target: string;
    sourcePosition?: string; targetPosition?: string; meaning?: string;
  }>;
  twelveFortune?: TwelveFortuneItem | null;
}
```

### gyeokguk (격국)
```typescript
{
  type: "내격" | "전왕격" | "종아격" | "종재격" | "종살격" | "화격" | "가화격";
  name: string;
  reason: string;
  naegeokDetail: {
    type: string;
    name: string;
    sipsin: string;
    description: string;
    characteristics: string[];
  } | null;
  yongsin: {
    십신: string;
    오행: string;
    method: "억부법" | "종격" | "화격";
    reason: string;
  };
  희신오행: string;
  기신오행: string;
  구신오행: string;
  신강여부: boolean;
  신강점수: number;
  종합설명: string;
}
```

### gyeokgukYongsin (격국용신 — 자평진전 체계)

> ⚠️ `fields`에 `"gyeokgukYongsin"`을 명시적으로 포함해야 반환됩니다. 기본 전체 반환에는 포함되지 않습니다.
> 화격/종격/전왕격일 경우 `null`이 반환됩니다 (내격에만 적용).

```typescript
{
  geokgukType: string;              // "정관격", "편관격", "식신격" 등
  geokgukCategory: "순용" | "역용" | "특수";

  geokgukYongsin: {                 // 격국용신 (격 = 용신)
    sipsin: string;                 // "정관", "편관", "식신" 등
    oheng: string;                  // "목", "화" 등
    reason: string;
  };

  sangsin: {                        // 상신 (격국 보좌)
    primary: {
      sipsin: string;
      oheng: string;
      role: string;                 // "정관 보호 — 상관의 극제를 막고 관인상생"
    };
    secondary?: {                   // 보조 상신 (있는 경우)
      sipsin: string;
      oheng: string;
      role: string;
    };
    existsInChart: boolean;         // 원국에 상신이 있는지
    hasRoot: boolean;               // 상신이 지지에 통근하는지
    positions: string[];            // 상신 위치 (예: ["년간", "시지"])
  };

  gisin: {                          // 기신 (격국 방해)
    primary: {
      sipsin: string;
      oheng: string;
      reason: string;               // "상관견관(傷官見官) — 정관을 직접 극하여 파격 요인"
    };
    existsInChart: boolean;
    positions: string[];
  };

  hapChungDamage: {                 // 합거/충거 감지
    yongsinHapGeo: boolean;         // 용신이 천간합으로 합거
    yongsinChungGeo: boolean;       // 월지(격국 근본)가 지지충
    sangsinHapGeo: boolean;         // 상신이 천간합으로 합거
    details: string[];              // 상세 설명
  };

  seongPaGeok: {                    // 성격(成格)/파격(破格) 판단
    result: "성격" | "파격";
    grade: "상격" | "중격" | "하격" | "파격";
    reason: string;
    factors: string[];              // 판단 근거 목록
  };

  summary: string;                  // 종합 설명 (텍스트)
}
```

**격국용신 vs 억부용신 차이:**
- `gyeokguk.yongsin` → 억부용신 (일간 강약 기준, 적천수 체계)
- `gyeokgukYongsin.geokgukYongsin` → 격국용신 (격 자체가 용신, 자평진전 체계)

**성패 등급:**
| 등급 | 의미 |
|------|------|
| 상격 | 격국용신 건재 + 상신 통근 + 기신 없음 |
| 중격 | 격국 성립하나 상신 약하거나 기신 간섭 |
| 하격 | 격국 완성 미흡 |
| 파격 | 격국 파괴 (합거/충거 또는 상신 부재 + 기신 존재) |

### twelveFortune (12운성)
```typescript
{
  dayGan: string;                       // 일간 (예: "갑")
  fortunes: Array<{
    position: string;                   // "년주", "월주", "일주", "시주"
    gan: string;
    ji: string;
    fortune: string;                    // 장생, 목욕, 관대, 건록, 제왕, 쇠, 병, 사, 묘, 절, 태, 양
    interpretation: {
      keyword: string;
      energy: string;
      personality: string[];
      strengths: string[];
      weaknesses: string[];
      career: string;
      relationship: string;
      advice: string;
      level: number;                    // 에너지 강도 (1-12)
    };
  }>;
  summary: string;
  iljiAnalysis: string;                 // 일지 12운성 상세 분석
}
```

### weolun (월운)
```typescript
{
  currentWeolun: WeolunItem;       // 현재 월운
  nextWeolun: WeolunItem;          // 다음 월운
  recentWeoluns: WeolunItem[];     // 최근 3개월 월운
  upcomingWeoluns: WeolunItem[];   // 향후 11개월 월운
}

// WeolunItem
{
  year: number;
  month: number;
  monthLabel: string;        // "2026년 3월"
  isCurrentMonth: boolean;
  ganji: string;             // 간지 (한글)
  ganji_hanja: string;       // 간지 (한자)
  gan: string;               // 천간
  ji: string;                // 지지
  ganElement: string;        // 천간 오행
  jiElement: string;         // 지지 오행
  sipseongRelation?: {       // 십성 관계 (일간 기준)
    gan: string;
    ji: string;
  };
}
```

### hapchung (합충형해파)
```typescript
Array<{
  type: "천간합" | "지지합" | "천간충" | "천간충(확장)" | "지지충" | "지지형" | "지지해" | "지지파" | "육합" | "삼합" | "방합" | "원진";
  source: string;
  target: string;
  sourcePosition?: string;
  targetPosition?: string;    // "년주"|"월주"|"일주"|"시주" 또는 삼합 완성 시 "완전삼합"
  meaning: string;            // 인접 기둥 관계일 경우 "[인접]" 접두어가 붙을 수 있음
}>
```

### guiin (귀인)
```typescript
{
  cheoneul: GuiinItem[];     // 천을귀인
  taegeuk: GuiinItem[];      // 태극귀인
  mungok: GuiinItem[];       // 문곡귀인
  munchang: GuiinItem[];     // 문창귀인
  bokseong: GuiinItem[];     // 복성귀인
  cheonju: GuiinItem[];      // 천주귀인
  cheongwan: GuiinItem[];    // 천관귀인
  cheonbok: GuiinItem[];     // 천복귀인
  hakdang: GuiinItem[];      // 학당귀인
  jaego: GuiinItem[];        // 재고귀인
  cheondeok: GuiinItem[];    // 천덕귀인
  woldeok: GuiinItem[];      // 월덕귀인
  amrok: GuiinItem[];        // 암록
  geumyeo: GuiinItem[];      // 금여
  yuha: GuiinItem[];         // 유하
  hyeoprok: GuiinItem[];     // 협록
}

// GuiinItem
{ position: string; ji: string; name: string; description: string; }
```

### sibisinsals (십이신살)
```typescript
{
  sibisinsals: Array<{
    name: string;         // "장성살", "역마살" 등
    position: string;     // "년지", "월지" 등
    ji: string;
    description: string;
  }>;
  nakjeonggwansal?: Array<{
    name: string;
    position: string;
    ji: string;
    description: string;
  }>;
}
```

### bigyeonGeobjae (비견/겁재)
```typescript
{
  bigyeon: Array<{ position: string; ganji: string; name: string; type: "비견"; meaning: string; }>;
  geobjae: Array<{ position: string; ganji: string; name: string; type: "겁재"; meaning: string; }>;
  bigyeonCount: number;
  geobjaeCount: number;
  totalCount: number;
  analysis: string;
}
```

### hongyeom, dohwa, hwagae (신살)
```typescript
// hongyeom
{ hongyeom: Array<{ position: string; ji: string; name: string; meaning?: string; }>; }

// dohwa
{ dohwa: Array<{ position: string; ji: string; name: string; type: string; meaning?: string; }>; }

// hwagae
{ hwagae: Array<{ position: string; ji: string; name: string; type: string; meaning?: string; }>; }
```

---

## 5. 복사해서 쓰는 연동 코드

### JavaScript / TypeScript
```typescript
const API_KEY = "YOUR_API_KEY";
const API_URL = "https://luckyloveme.com/api/saju-full-analysis";

async function getSajuAnalysis(params: {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour?: string;
  birthMinute?: string;
  calendarType: "양력" | "음력";
  gender: "male" | "female";
  isLeapMonth?: boolean;
  useYajasiRule?: boolean;
  fields?: string[];
}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-SAJU-BOOK-API-KEY": API_KEY,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API 오류 (${response.status}): ${error.message}`);
  }

  return response.json();
}

// --- 사용 예시 ---

// 전체 분석
const fullResult = await getSajuAnalysis({
  birthYear: "1990",
  birthMonth: "5",
  birthDay: "15",
  birthHour: "14",
  birthMinute: "30",
  calendarType: "양력",
  gender: "male",
});

// 사주팔자 + 대운만
const partialResult = await getSajuAnalysis({
  birthYear: "1990",
  birthMonth: "5",
  birthDay: "15",
  birthHour: "14",
  birthMinute: "30",
  calendarType: "양력",
  gender: "male",
  fields: ["ganji", "daeun", "seun"],
});
```

### Python
```python
import requests

API_KEY = "YOUR_API_KEY"
API_URL = "https://luckyloveme.com/api/saju-full-analysis"

def get_saju_analysis(
    birth_year: str,
    birth_month: str,
    birth_day: str,
    calendar_type: str,  # "양력" 또는 "음력"
    gender: str,          # "male" 또는 "female"
    birth_hour: str = None,
    birth_minute: str = None,
    fields: list = None,
    is_leap_month: bool = False,
    use_yajasi_rule: bool = False,
):
    payload = {
        "birthYear": birth_year,
        "birthMonth": birth_month,
        "birthDay": birth_day,
        "calendarType": calendar_type,
        "gender": gender,
    }
    if birth_hour is not None:
        payload["birthHour"] = birth_hour
    if birth_minute is not None:
        payload["birthMinute"] = birth_minute
    if fields:
        payload["fields"] = fields
    if is_leap_month:
        payload["isLeapMonth"] = True
    if use_yajasi_rule:
        payload["useYajasiRule"] = True

    response = requests.post(
        API_URL,
        json=payload,
        headers={
            "Content-Type": "application/json",
            "X-SAJU-BOOK-API-KEY": API_KEY,
        },
    )
    response.raise_for_status()
    return response.json()


# --- 사용 예시 ---

# 전체 분석
result = get_saju_analysis("1990", "5", "15", "양력", "male", "14", "30")

# 사주팔자 + 대운만
result = get_saju_analysis(
    "1990", "5", "15", "양력", "male", "14", "30",
    fields=["ganji", "daeun", "seun"]
)

import json
print(json.dumps(result, indent=2, ensure_ascii=False))
```

### PHP
```php
<?php
$apiKey = "YOUR_API_KEY";
$url = "https://luckyloveme.com/api/saju-full-analysis";

function getSajuAnalysis($params) {
    global $apiKey, $url;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "X-SAJU-BOOK-API-KEY: $apiKey",
        ],
        CURLOPT_POSTFIELDS => json_encode($params),
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("API 오류 ($httpCode): $response");
    }

    return json_decode($response, true);
}

// 사용 예시
$result = getSajuAnalysis([
    "birthYear" => "1990",
    "birthMonth" => "5",
    "birthDay" => "15",
    "birthHour" => "14",
    "birthMinute" => "30",
    "calendarType" => "양력",
    "gender" => "male",
]);
```

---

## 6. 에러 처리

| HTTP Code | 의미 | 대응 |
|-----------|------|------|
| `200` | 성공 | 정상 처리 |
| `400` | 필수 파라미터 누락 | 요청 바디 확인 |
| `401` | API 키 오류 / 비활성 계정 / 테스트 키 만료 | 아래 상세 참조 |
| `404` | 해당 날짜 데이터 없음 | 날짜 범위 확인 (1900~2100년) |
| `405` | POST 아닌 메소드 사용 | POST로 변경 |
| `429` | 요청 한도 초과 | 분당 500회 또는 일일 한도 초과, 잠시 후 재시도 |
| `500` | 서버 오류 | 재시도 또는 문의 |

### 에러 응답 형식

```json
// 400 에러 (파라미터 누락)
{
  "message": "필수 항목을 모두 입력해주세요.",
  "missingFields": ["birthYear", "gender"],
  "requiredFields": ["birthYear", "birthMonth", "birthDay", "gender", "calendarType"]
}

// 401 에러 (인증 실패)
{ "message": "Invalid B2B API key" }

// 405 에러
{ "message": "Method not allowed" }

// 500 에러
{
  "message": "분석 처리 중 오류가 발생했습니다.",
  "error": "상세 에러 메시지"
}
```

### 401 에러 상세 (B2B 인증)

| 에러 메시지 | 원인 | 대응 |
|------------|------|------|
| `Invalid B2B API key` | 잘못된 API 키 | 키 값 확인 |
| `Client account is deactivated` | 비활성화된 계정 | 관리자 문의 |
| `Test API key expired on {날짜}` | 테스트 키 만료 | 키 갱신 요청 |
| `Daily test limit exceeded ({사용량}/{한도})` | 일일 테스트 한도 초과 | 다음 날 재시도 또는 라이브 키 전환 |
| `Endpoint not allowed: {경로}` | 허용되지 않은 엔드포인트 | 관리자 문의 |

> **참고**: 테스트 키의 일일 한도는 best-effort 방식으로 적용되며, 동시 요청 시 한도를 소폭 초과할 수 있습니다.

---

## 7. 자주 묻는 질문

**Q: 시간 정보 없이도 분석 가능한가요?**
A: 네. `birthHour`, `birthMinute`를 생략하면 시주 없이 년/월/일주만으로 분석합니다.

**Q: 응답이 너무 크면 어떻게 줄이나요?**
A: `fields` 파라미터로 필요한 항목만 선택하세요. 예: `["ganji", "sipseong"]`

**Q: 음력 날짜는 어떻게 입력하나요?**
A: `calendarType`을 `"음력"`으로 설정하고, 윤달이면 `isLeapMonth: true`를 추가하세요.

**Q: 한국 서머타임(1949~1960, 1987~1988)은 자동 보정되나요?**
A: 네. 해당 기간 출생자는 자동으로 1시간 빼서 실제 태양시로 계산합니다.

---

## 8. 만세력 API (무료)

특정 날짜의 간지(干支)·음양·오행을 조회하는 보조 API입니다. **별도 인증 키가 필요 없으며 무료**이고, 일일 호출 한도에 포함되지 않습니다. (유료 API 이용 업체 대상 제공)

| 항목 | 값 |
|------|-----|
| **Endpoint** | `POST https://luckyloveme.com/api/mansae` |
| **인증** | 불필요 (무료) |
| **Content-Type** | `application/json` |

### Request Body

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `year` | string | ✅ | 년도 (예: `"2024"`) |
| `month` | string | ✅ | 월 (예: `"1"`) |
| `day` | string | ✅ | 일 (예: `"15"`) |
| `birthHour` | string | - | 시 (0-23). 입력 시 시주(時柱) 계산 |
| `birthMinute` | string | - | 분 (0-59). 기본값 `0` |
| `calendarType` | `"양력" \| "음력"` | - | 기본값 `"양력"`. `"음력"`이면 양력으로 변환 후 조회 |
| `isLeapMonth` | boolean | - | 음력 윤달 여부 (기본값 `false`) |
| `useYajasiRule` | boolean | - | 야자시/조자시 규칙 적용 (기본값 `false`) |

### 요청 예시

```bash
curl -X POST https://luckyloveme.com/api/mansae \
  -H "Content-Type: application/json" \
  -d '{
    "year": "2024", "month": "1", "day": "15",
    "birthHour": "14", "birthMinute": "30",
    "calendarType": "양력", "useYajasiRule": false
  }'
```

### Response (비절기일)

```typescript
{
  isSolarTerm: boolean;              // 절기일 여부
  ganji: string;                     // "년주(漢) 월주(漢) 일주(漢)"
  hourGanji: {                       // 시주 (birthHour 입력 시. 없으면 null)
    hangul: string; hanja: string;
    eumyang: { gan: "양"|"음"|null; ji: "양"|"음"|null };
    ohaeng: { gan: "목"|"화"|"토"|"금"|"수"|null; ji: ... };
    sipseong: { gan: string|null; ji: string|null };  // 일간 기준 십성
  } | null;
  jasiType: "none" | "yajasi" | "jojasi";  // 야자시/조자시 구분
  solarDate?: { year: number; month: number; day: number }; // 음력 입력 시 변환된 양력
  birthInfo: { year; month; day; hour; minute; calendarType; isLeapMonth; useYajasiRule };
  fullData: {
    // year/month/day 동일 구조. sipseong은 일간 기준이며 일간 자리는 "일간"(본원)
    year:  { hangul; hanja; eumyang; ohaeng; sipseong: { gan: string|null; ji: string|null } };
    month: { ... };
    day:   { ... };
    양력: string; 음력: string; dayOfWeek: string; julianDate: string;
  };
}
```

> 절기일(`isSolarTerm: true`)인 경우 `fullData` 대신 `beforeTerm`/`afterTerm`(절기 전/후 간지)과 `baseData`가 반환됩니다. `beforeTerm`/`afterTerm`의 각 글자에도 `eumyang`/`ohaeng`/`sipseong`이 포함되며, 십성은 해당 절기 전/후로 확정된 년·월주 기준으로 각각 계산됩니다. `eumyang`/`ohaeng` 기준은 위 `ganji (천간지지)` 항목의 설명과 동일합니다.

---

## 문의

- 기술 문의 / API 키 발급: luckylovemesaju@gmail.com
