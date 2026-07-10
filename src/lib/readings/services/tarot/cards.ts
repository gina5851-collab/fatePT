// =====================================================
// 타로 78장 데이터 — 단일 소스
// =====================================================
// 라이더-웨이트-스미스(RWS) 표준 78장 구성. 카드명/구조는 공개된 사실 정보이며,
// 의미·키워드는 자체 요약(특정 저작물 복제 아님).
// imageUrl 은 필드만 두고 비워둔다 — 저작권이 확인된 이미지만 추후 채운다.
// 컴포넌트/프롬프트는 이 파일을 단일 소스로 참조하고, 카드 내용을 하드코딩하지 않는다.

export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";

export type TarotCard = {
  id: string;
  cardNumber: number; // 메이저 0-21, 마이너는 수트 내 1(Ace)-14(King)
  nameKo: string;
  nameEn: string;
  arcana: Arcana;
  suit: Suit | null; // 메이저는 null
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string; // 미확보(빈 문자열) — 카드 뒷면+카드명으로 동작
};

const MAJOR: TarotCard[] = [
  {
    id: "major-00", cardNumber: 0, nameKo: "바보", nameEn: "The Fool", arcana: "major", suit: null,
    uprightKeywords: ["새로운 시작", "순수", "모험", "자유"],
    reversedKeywords: ["무모함", "경솔", "망설임", "위험 회피"],
    uprightMeaning: "두려움 없이 새로운 길로 첫발을 내딛는 시기. 순수한 마음과 가능성이 열려 있습니다.",
    reversedMeaning: "준비 없이 뛰어들거나, 반대로 두려움에 첫발을 못 떼는 상태. 신중함이 필요합니다.",
    imageUrl: "",
  },
  {
    id: "major-01", cardNumber: 1, nameKo: "마법사", nameEn: "The Magician", arcana: "major", suit: null,
    uprightKeywords: ["의지", "실행력", "창조", "집중"],
    reversedKeywords: ["기만", "미숙", "재능 낭비", "자신감 부족"],
    uprightMeaning: "가진 자원을 현실로 만들어내는 힘. 의지와 집중으로 원하는 것을 실현할 때입니다.",
    reversedMeaning: "능력을 잘못 쓰거나 자신을 속이는 상태. 재능을 살리지 못하고 있을 수 있습니다.",
    imageUrl: "",
  },
  {
    id: "major-02", cardNumber: 2, nameKo: "여사제", nameEn: "The High Priestess", arcana: "major", suit: null,
    uprightKeywords: ["직관", "내면", "비밀", "지혜"],
    reversedKeywords: ["직관 무시", "혼란", "숨겨진 사실", "단절"],
    uprightMeaning: "말보다 직관과 내면의 목소리에 귀 기울일 때. 아직 드러나지 않은 진실이 있습니다.",
    reversedMeaning: "내면의 신호를 무시하거나 감춰진 것에 혼란스러운 상태. 스스로를 돌아보세요.",
    imageUrl: "",
  },
  {
    id: "major-03", cardNumber: 3, nameKo: "여황제", nameEn: "The Empress", arcana: "major", suit: null,
    uprightKeywords: ["풍요", "모성", "사랑", "창조성"],
    reversedKeywords: ["의존", "정체", "공허", "과보호"],
    uprightMeaning: "따뜻함과 풍요가 넘치는 시기. 관계와 감정이 자라나고 결실을 맺습니다.",
    reversedMeaning: "지나친 의존이나 감정적 공허. 자신을 돌보는 균형이 필요합니다.",
    imageUrl: "",
  },
  {
    id: "major-04", cardNumber: 4, nameKo: "황제", nameEn: "The Emperor", arcana: "major", suit: null,
    uprightKeywords: ["안정", "권위", "책임", "구조"],
    reversedKeywords: ["독단", "경직", "통제", "무책임"],
    uprightMeaning: "질서와 책임으로 기반을 다지는 시기. 주도적으로 상황을 이끌 수 있습니다.",
    reversedMeaning: "고집이나 지나친 통제가 갈등을 부릅니다. 유연함이 필요합니다.",
    imageUrl: "",
  },
  {
    id: "major-05", cardNumber: 5, nameKo: "교황", nameEn: "The Hierophant", arcana: "major", suit: null,
    uprightKeywords: ["전통", "가르침", "신뢰", "관습"],
    reversedKeywords: ["관습 탈피", "반항", "형식주의", "독자노선"],
    uprightMeaning: "검증된 방식과 조언을 따를 때 안정이 옵니다. 신뢰와 배움의 시기입니다.",
    reversedMeaning: "틀에 얽매이거나 반대로 규범을 벗어나려는 흐름. 나만의 기준을 점검하세요.",
    imageUrl: "",
  },
  {
    id: "major-06", cardNumber: 6, nameKo: "연인", nameEn: "The Lovers", arcana: "major", suit: null,
    uprightKeywords: ["사랑", "선택", "조화", "결합"],
    reversedKeywords: ["갈등", "불화", "잘못된 선택", "가치관 차이"],
    uprightMeaning: "마음이 통하는 결합과 중요한 선택의 시기. 진심으로 원하는 것을 따르세요.",
    reversedMeaning: "가치관 차이나 갈등으로 관계가 흔들립니다. 선택을 미루면 어긋납니다.",
    imageUrl: "",
  },
  {
    id: "major-07", cardNumber: 7, nameKo: "전차", nameEn: "The Chariot", arcana: "major", suit: null,
    uprightKeywords: ["의지", "전진", "승리", "통제"],
    reversedKeywords: ["방향 상실", "좌절", "충돌", "조급함"],
    uprightMeaning: "강한 의지로 장애를 뚫고 나아가는 시기. 집중하면 원하는 결과를 얻습니다.",
    reversedMeaning: "방향을 잃거나 조급함으로 힘이 분산됩니다. 속도보다 방향을 점검하세요.",
    imageUrl: "",
  },
  {
    id: "major-08", cardNumber: 8, nameKo: "힘", nameEn: "Strength", arcana: "major", suit: null,
    uprightKeywords: ["용기", "인내", "부드러운 힘", "자제"],
    reversedKeywords: ["자신감 부족", "조급", "감정 폭발", "무력감"],
    uprightMeaning: "부드럽지만 단단한 내면의 힘으로 상황을 다스릴 때. 인내가 답입니다.",
    reversedMeaning: "감정에 휘둘리거나 자신을 믿지 못하는 상태. 조급함을 내려놓으세요.",
    imageUrl: "",
  },
  {
    id: "major-09", cardNumber: 9, nameKo: "은둔자", nameEn: "The Hermit", arcana: "major", suit: null,
    uprightKeywords: ["성찰", "고독", "탐구", "내면의 빛"],
    reversedKeywords: ["고립", "외로움", "회피", "단절"],
    uprightMeaning: "혼자만의 시간 속에서 답을 찾는 시기. 내면을 들여다볼 때 길이 보입니다.",
    reversedMeaning: "지나친 고립이나 현실 회피. 홀로 있음이 외로움으로 굳어질 수 있습니다.",
    imageUrl: "",
  },
  {
    id: "major-10", cardNumber: 10, nameKo: "운명의 수레바퀴", nameEn: "Wheel of Fortune", arcana: "major", suit: null,
    uprightKeywords: ["전환점", "행운", "순환", "변화"],
    reversedKeywords: ["악순환", "지연", "불운", "저항"],
    uprightMeaning: "흐름이 바뀌는 전환점. 예상치 못한 기회가 찾아옵니다.",
    reversedMeaning: "같은 패턴이 반복되거나 흐름이 막힌 상태. 변화를 받아들이세요.",
    imageUrl: "",
  },
  {
    id: "major-11", cardNumber: 11, nameKo: "정의", nameEn: "Justice", arcana: "major", suit: null,
    uprightKeywords: ["균형", "공정", "인과", "결정"],
    reversedKeywords: ["불공정", "편향", "책임 회피", "왜곡"],
    uprightMeaning: "뿌린 대로 거두는 시기. 공정한 판단과 책임이 결과를 만듭니다.",
    reversedMeaning: "편향된 판단이나 책임 회피로 균형이 무너집니다. 솔직함이 필요합니다.",
    imageUrl: "",
  },
  {
    id: "major-12", cardNumber: 12, nameKo: "매달린 사람", nameEn: "The Hanged Man", arcana: "major", suit: null,
    uprightKeywords: ["멈춤", "관점 전환", "내려놓음", "기다림"],
    reversedKeywords: ["헛된 희생", "정체", "집착", "저항"],
    uprightMeaning: "잠시 멈추고 다른 시선으로 바라볼 때. 내려놓음이 새 길을 엽니다.",
    reversedMeaning: "의미 없는 희생이나 놓지 못하는 집착. 붙잡을수록 더 막힙니다.",
    imageUrl: "",
  },
  {
    id: "major-13", cardNumber: 13, nameKo: "죽음", nameEn: "Death", arcana: "major", suit: null,
    uprightKeywords: ["끝과 시작", "변화", "정리", "재생"],
    reversedKeywords: ["변화 거부", "미련", "정체", "두려움"],
    uprightMeaning: "한 장이 끝나고 새 장이 열리는 시기. 놓아주면 더 나은 것이 옵니다.",
    reversedMeaning: "끝난 것을 붙잡아 변화를 미루는 상태. 미련이 앞을 가립니다.",
    imageUrl: "",
  },
  {
    id: "major-14", cardNumber: 14, nameKo: "절제", nameEn: "Temperance", arcana: "major", suit: null,
    uprightKeywords: ["균형", "조화", "인내", "중용"],
    reversedKeywords: ["불균형", "과함", "조급", "부조화"],
    uprightMeaning: "서두르지 않고 균형을 맞춰가는 시기. 조화로운 절충이 답입니다.",
    reversedMeaning: "한쪽으로 치우치거나 조급해 균형이 깨진 상태. 속도를 늦추세요.",
    imageUrl: "",
  },
  {
    id: "major-15", cardNumber: 15, nameKo: "악마", nameEn: "The Devil", arcana: "major", suit: null,
    uprightKeywords: ["집착", "속박", "유혹", "욕망"],
    reversedKeywords: ["해방", "자각", "단절", "회복"],
    uprightMeaning: "끊지 못하는 집착이나 관계에 묶인 상태. 무엇이 나를 붙잡는지 직시하세요.",
    reversedMeaning: "속박을 끊고 벗어나는 흐름. 자각을 통해 자유로워집니다.",
    imageUrl: "",
  },
  {
    id: "major-16", cardNumber: 16, nameKo: "탑", nameEn: "The Tower", arcana: "major", suit: null,
    uprightKeywords: ["붕괴", "충격", "각성", "급변"],
    reversedKeywords: ["붕괴 지연", "두려움", "간신히 회피", "여진"],
    uprightMeaning: "예상 못한 사건으로 기존 구조가 무너지는 시기. 무너진 뒤 진실이 드러납니다.",
    reversedMeaning: "위기를 간신히 넘기거나 변화를 두려워 미루는 상태. 근본을 돌아보세요.",
    imageUrl: "",
  },
  {
    id: "major-17", cardNumber: 17, nameKo: "별", nameEn: "The Star", arcana: "major", suit: null,
    uprightKeywords: ["희망", "치유", "영감", "회복"],
    reversedKeywords: ["실망", "자신감 상실", "무기력", "회의"],
    uprightMeaning: "상처가 아물고 희망이 돌아오는 시기. 조용한 믿음이 길을 밝힙니다.",
    reversedMeaning: "희망을 잃거나 자신을 의심하는 상태. 다시 마음을 다독일 때입니다.",
    imageUrl: "",
  },
  {
    id: "major-18", cardNumber: 18, nameKo: "달", nameEn: "The Moon", arcana: "major", suit: null,
    uprightKeywords: ["불안", "환상", "직관", "모호함"],
    reversedKeywords: ["오해 해소", "진실 드러남", "혼란 정리", "안정"],
    uprightMeaning: "명확하지 않은 상황과 불안이 감도는 시기. 직관은 살리되 착각은 경계하세요.",
    reversedMeaning: "안개가 걷히며 오해와 두려움이 풀리는 흐름. 진실이 드러납니다.",
    imageUrl: "",
  },
  {
    id: "major-19", cardNumber: 19, nameKo: "태양", nameEn: "The Sun", arcana: "major", suit: null,
    uprightKeywords: ["기쁨", "성공", "활력", "명료함"],
    reversedKeywords: ["일시적 흐림", "지연된 기쁨", "과신", "번아웃"],
    uprightMeaning: "밝고 따뜻한 성공과 기쁨의 시기. 있는 그대로가 빛나는 때입니다.",
    reversedMeaning: "기쁨이 잠시 흐려지거나 지연되는 상태. 곧 다시 밝아집니다.",
    imageUrl: "",
  },
  {
    id: "major-20", cardNumber: 20, nameKo: "심판", nameEn: "Judgement", arcana: "major", suit: null,
    uprightKeywords: ["부활", "각성", "결단", "부름"],
    reversedKeywords: ["자기비판", "망설임", "회피", "미련"],
    uprightMeaning: "지난 일을 정리하고 새롭게 도약하는 시기. 부름에 응답할 때입니다.",
    reversedMeaning: "과거에 얽매이거나 결단을 미루는 상태. 자신을 너무 몰아세우지 마세요.",
    imageUrl: "",
  },
  {
    id: "major-21", cardNumber: 21, nameKo: "세계", nameEn: "The World", arcana: "major", suit: null,
    uprightKeywords: ["완성", "성취", "통합", "여정의 끝"],
    reversedKeywords: ["미완성", "지연", "마무리 부족", "정체"],
    uprightMeaning: "한 여정이 완성되고 결실을 맺는 시기. 온전한 마무리와 새 출발이 함께 옵니다.",
    reversedMeaning: "마지막 한 걸음이 남아 아직 완성에 이르지 못한 상태. 끝맺음에 집중하세요.",
    imageUrl: "",
  },
];

// 마이너 아르카나 생성 헬퍼 — 수트별 랭크 14장
type MinorSpec = {
  rank: number; // 1(Ace)-14(King)
  nameKoRank: string;
  nameEnRank: string;
  up: string[];
  rev: string[];
  upM: string;
  revM: string;
};

const SUIT_META: Record<Suit, { ko: string; en: string; idPrefix: string }> = {
  wands: { ko: "완드", en: "Wands", idPrefix: "wands" },
  cups: { ko: "컵", en: "Cups", idPrefix: "cups" },
  swords: { ko: "소드", en: "Swords", idPrefix: "swords" },
  pentacles: { ko: "펜타클", en: "Pentacles", idPrefix: "pents" },
};

function minorCard(suit: Suit, s: MinorSpec): TarotCard {
  const meta = SUIT_META[suit];
  return {
    id: `${meta.idPrefix}-${String(s.rank).padStart(2, "0")}`,
    cardNumber: s.rank,
    nameKo: `${meta.ko} ${s.nameKoRank}`,
    nameEn: `${s.nameEnRank} of ${meta.en}`,
    arcana: "minor",
    suit,
    uprightKeywords: s.up,
    reversedKeywords: s.rev,
    uprightMeaning: s.upM,
    reversedMeaning: s.revM,
    imageUrl: "",
  };
}

// 완드(불) — 열정·행동·창조·에너지
const WANDS: MinorSpec[] = [
  { rank: 1, nameKoRank: "에이스", nameEnRank: "Ace", up: ["새 열정", "시작", "영감"], rev: ["동기 부족", "지연", "공회전"], upM: "새로운 열정과 기회의 불씨가 피어오릅니다.", revM: "의욕이 식거나 시작이 자꾸 미뤄집니다." },
  { rank: 2, nameKoRank: "2", nameEnRank: "Two", up: ["계획", "전망", "결정"], rev: ["망설임", "두려움", "계획 부재"], upM: "앞날을 내다보며 방향을 정하는 시기입니다.", revM: "선택을 미루거나 미래가 불안해 움직이지 못합니다." },
  { rank: 3, nameKoRank: "3", nameEnRank: "Three", up: ["확장", "기대", "진행"], rev: ["지연", "차질", "좁은 시야"], upM: "노력의 결과가 넓게 뻗어나가기 시작합니다.", revM: "진행이 더디거나 예상보다 성과가 늦습니다." },
  { rank: 4, nameKoRank: "4", nameEnRank: "Four", up: ["안정", "축하", "조화"], rev: ["불안정", "지연된 기쁨", "갈등"], upM: "기반이 다져지고 함께 기뻐할 일이 생깁니다.", revM: "축하가 미뤄지거나 안정감이 흔들립니다." },
  { rank: 5, nameKoRank: "5", nameEnRank: "Five", up: ["경쟁", "마찰", "도전"], rev: ["갈등 회피", "긴장 해소", "내분"], upM: "경쟁과 마찰 속에서 자기 자리를 다투는 시기입니다.", revM: "갈등을 피하거나 소모적인 다툼이 이어집니다." },
  { rank: 6, nameKoRank: "6", nameEnRank: "Six", up: ["승리", "인정", "성취"], rev: ["자만", "인정 지연", "실망"], upM: "노력이 인정받고 승리가 찾아옵니다.", revM: "기대한 인정이 늦거나 자만이 발목을 잡습니다." },
  { rank: 7, nameKoRank: "7", nameEnRank: "Seven", up: ["방어", "용기", "버티기"], rev: ["압도됨", "포기", "소진"], upM: "밀려드는 도전에 맞서 자리를 지키는 시기입니다.", revM: "버티기에 지치거나 물러서고 싶어집니다." },
  { rank: 8, nameKoRank: "8", nameEnRank: "Eight", up: ["빠른 진전", "소식", "속도"], rev: ["지연", "혼선", "성급함"], upM: "일이 빠르게 진전되고 반가운 소식이 옵니다.", revM: "진행이 막히거나 성급함이 혼선을 부릅니다." },
  { rank: 9, nameKoRank: "9", nameEnRank: "Nine", up: ["끈기", "경계", "마지막 고비"], rev: ["소진", "방어적", "포기 직전"], upM: "지쳤지만 마지막 고비를 버텨내는 시기입니다.", revM: "경계심이 지나치거나 힘이 바닥나 있습니다." },
  { rank: 10, nameKoRank: "10", nameEnRank: "Ten", up: ["부담", "책임 과중", "완수 직전"], rev: ["짐 내려놓기", "위임", "번아웃"], upM: "많은 짐을 지고 결승선을 향해 가는 시기입니다.", revM: "혼자 감당하던 짐을 내려놓을 때입니다." },
  { rank: 11, nameKoRank: "페이지", nameEnRank: "Page", up: ["호기심", "열정", "새 시도"], rev: ["산만", "미숙", "변덕"], upM: "새로운 것에 대한 설렘과 탐구심이 피어납니다.", revM: "관심이 흩어지거나 시작만 하고 끝을 못 냅니다." },
  { rank: 12, nameKoRank: "나이트", nameEnRank: "Knight", up: ["추진력", "모험", "열정적 행동"], rev: ["무모함", "충동", "조급"], upM: "과감하게 밀어붙이며 앞으로 돌진하는 시기입니다.", revM: "충동적으로 움직여 일을 그르칠 수 있습니다." },
  { rank: 13, nameKoRank: "퀸", nameEnRank: "Queen", up: ["자신감", "매력", "따뜻한 카리스마"], rev: ["질투", "고집", "소진"], upM: "당당한 매력과 활기로 주변을 이끄는 시기입니다.", revM: "자신감이 고집이나 질투로 흐를 수 있습니다." },
  { rank: 14, nameKoRank: "킹", nameEnRank: "King", up: ["리더십", "비전", "결단"], rev: ["독선", "성급한 결정", "충동"], upM: "비전을 갖고 사람을 이끄는 리더의 시기입니다.", revM: "독선이나 성급한 결정이 신뢰를 흔듭니다." },
];

// 컵(물) — 감정·관계·사랑·직관
const CUPS: MinorSpec[] = [
  { rank: 1, nameKoRank: "에이스", nameEnRank: "Ace", up: ["새 감정", "사랑 시작", "설렘"], rev: ["감정 억압", "공허", "닫힌 마음"], upM: "새로운 사랑과 감정이 샘솟기 시작합니다.", revM: "감정을 억누르거나 마음이 메말라 있습니다." },
  { rank: 2, nameKoRank: "2", nameEnRank: "Two", up: ["결합", "교감", "상호 끌림"], rev: ["불화", "어긋남", "일방적"], upM: "서로 마음이 통하는 깊은 교감의 시기입니다.", revM: "마음이 어긋나거나 한쪽만 애쓰는 상태입니다." },
  { rank: 3, nameKoRank: "3", nameEnRank: "Three", up: ["우정", "축하", "어울림"], rev: ["과함", "가십", "소원해짐"], upM: "사람들과 어울리며 함께 기뻐하는 시기입니다.", revM: "관계가 소원해지거나 과한 모임에 지칩니다." },
  { rank: 4, nameKoRank: "4", nameEnRank: "Four", up: ["권태", "무관심", "재고"], rev: ["새 관심", "재발견", "수용"], upM: "익숙함에 심드렁해져 눈앞의 기회를 놓칠 수 있습니다.", revM: "다시 마음이 열리며 새 기회를 받아들입니다." },
  { rank: 5, nameKoRank: "5", nameEnRank: "Five", up: ["상실", "후회", "실망"], rev: ["회복", "용서", "앞으로 나아감"], upM: "잃은 것에 마음이 머무는 시기입니다.", revM: "슬픔을 딛고 남은 것을 보며 회복합니다." },
  { rank: 6, nameKoRank: "6", nameEnRank: "Six", up: ["추억", "향수", "순수함"], rev: ["과거 집착", "미련", "성장 거부"], upM: "따뜻한 추억과 순수한 마음이 위로가 됩니다.", revM: "지난 일에 매여 앞으로 나아가지 못합니다." },
  { rank: 7, nameKoRank: "7", nameEnRank: "Seven", up: ["선택지", "상상", "가능성"], rev: ["결정", "현실 직시", "혼란 정리"], upM: "여러 가능성 사이에서 상상이 부푸는 시기입니다.", revM: "환상을 걷어내고 현실적인 선택을 할 때입니다." },
  { rank: 8, nameKoRank: "8", nameEnRank: "Eight", up: ["떠남", "전환", "더 깊은 갈망"], rev: ["미련", "정체", "떠나지 못함"], upM: "익숙한 것을 뒤로하고 더 의미 있는 길을 찾아 떠납니다.", revM: "떠나야 함을 알면서도 발이 떨어지지 않습니다." },
  { rank: 9, nameKoRank: "9", nameEnRank: "Nine", up: ["만족", "소원 성취", "안락"], rev: ["과욕", "겉만족", "허전함"], upM: "바라던 것이 이뤄져 흐뭇한 만족의 시기입니다.", revM: "겉으론 채워졌지만 속은 허전할 수 있습니다." },
  { rank: 10, nameKoRank: "10", nameEnRank: "Ten", up: ["행복", "화목", "정서적 충만"], rev: ["불화", "겉치레", "가치관 차이"], upM: "관계가 무르익어 마음이 충만한 시기입니다.", revM: "겉은 화목해 보여도 속으로 균열이 있습니다." },
  { rank: 11, nameKoRank: "페이지", nameEnRank: "Page", up: ["설렘", "감수성", "고백"], rev: ["미성숙", "감정 기복", "회피"], upM: "여린 설렘과 순수한 감정이 피어나는 시기입니다.", revM: "감정이 오락가락하거나 마음을 숨깁니다." },
  { rank: 12, nameKoRank: "나이트", nameEnRank: "Knight", up: ["로맨스", "제안", "다가옴"], rev: ["변덕", "비현실", "식은 마음"], upM: "낭만적인 제안과 함께 마음이 다가오는 시기입니다.", revM: "달콤한 말과 달리 마음이 오락가락합니다." },
  { rank: 13, nameKoRank: "퀸", nameEnRank: "Queen", up: ["공감", "다정함", "직관"], rev: ["감정 의존", "예민", "소진"], upM: "따뜻한 공감과 직관으로 사람을 품는 시기입니다.", revM: "감정에 휘둘리거나 남에게 지나치게 의존합니다." },
  { rank: 14, nameKoRank: "킹", nameEnRank: "King", up: ["정서적 성숙", "포용", "안정된 사랑"], rev: ["억압", "변덕", "감정 조종"], upM: "감정을 다스리며 관계를 안정적으로 이끄는 시기입니다.", revM: "감정을 억누르거나 은근히 상대를 조종합니다." },
];

// 소드(공기) — 사고·갈등·진실·결정
const SWORDS: MinorSpec[] = [
  { rank: 1, nameKoRank: "에이스", nameEnRank: "Ace", up: ["명료함", "진실", "돌파구"], rev: ["혼란", "오판", "왜곡"], upM: "생각이 또렷해지고 진실이 드러나는 시기입니다.", revM: "판단이 흐려지거나 사실이 왜곡됩니다." },
  { rank: 2, nameKoRank: "2", nameEnRank: "Two", up: ["교착", "회피", "균형 유지"], rev: ["결정", "정보 공개", "긴장 해소"], upM: "결정을 미루고 균형을 유지하려는 시기입니다.", revM: "미뤄둔 결정을 마주하고 매듭짓게 됩니다." },
  { rank: 3, nameKoRank: "3", nameEnRank: "Three", up: ["상심", "이별", "아픈 진실"], rev: ["회복", "용서", "치유 시작"], upM: "마음이 베이는 아픔이나 이별을 겪는 시기입니다.", revM: "상처가 아물기 시작하며 회복의 길로 들어섭니다." },
  { rank: 4, nameKoRank: "4", nameEnRank: "Four", up: ["휴식", "회복", "재정비"], rev: ["번아웃", "정체", "복귀 준비"], upM: "잠시 물러나 몸과 마음을 회복하는 시기입니다.", revM: "쉼이 필요하거나 다시 움직일 준비를 합니다." },
  { rank: 5, nameKoRank: "5", nameEnRank: "Five", up: ["갈등", "이해타산", "상처뿐인 승리"], rev: ["화해", "후퇴", "관계 회복"], upM: "이겨도 남는 게 없는 소모적 갈등의 시기입니다.", revM: "다툼을 멈추고 화해로 방향을 트는 흐름입니다." },
  { rank: 6, nameKoRank: "6", nameEnRank: "Six", up: ["전환", "이동", "회복의 여정"], rev: ["정체", "미련", "떠나지 못함"], upM: "힘든 시기를 지나 더 잔잔한 곳으로 옮겨가는 시기입니다.", revM: "떠나야 할 상황에 아직 머물러 있습니다." },
  { rank: 7, nameKoRank: "7", nameEnRank: "Seven", up: ["전략", "은밀함", "기지"], rev: ["발각", "양심", "정직"], upM: "정면 대결보다 전략과 기지로 움직이는 시기입니다.", revM: "숨긴 것이 드러나거나 양심에 걸립니다." },
  { rank: 8, nameKoRank: "8", nameEnRank: "Eight", up: ["속박감", "무력", "갇힌 생각"], rev: ["해방", "자각", "탈출"], upM: "스스로 만든 한계에 갇힌 듯한 시기입니다.", revM: "생각의 족쇄를 풀고 벗어나기 시작합니다." },
  { rank: 9, nameKoRank: "9", nameEnRank: "Nine", up: ["불안", "걱정", "번민"], rev: ["회복", "희망", "과장된 두려움 해소"], upM: "밤잠 설치는 걱정과 불안이 마음을 누르는 시기입니다.", revM: "부풀린 두려움이 걷히며 마음이 가벼워집니다." },
  { rank: 10, nameKoRank: "10", nameEnRank: "Ten", up: ["끝", "바닥", "고통의 마무리"], rev: ["회복", "재기", "최악 통과"], upM: "한 국면이 완전히 끝나는 바닥의 시기입니다.", revM: "최악을 지나 다시 일어서기 시작합니다." },
  { rank: 11, nameKoRank: "페이지", nameEnRank: "Page", up: ["호기심", "경계", "진실 탐구"], rev: ["험담", "성급한 말", "산만"], upM: "날카로운 관찰력으로 진실을 파고드는 시기입니다.", revM: "말이 앞서거나 경계심이 지나칩니다." },
  { rank: 12, nameKoRank: "나이트", nameEnRank: "Knight", up: ["돌진", "직설", "속도"], rev: ["공격성", "무모함", "말실수"], upM: "거침없이 목표로 돌진하는 시기입니다.", revM: "성급함과 공격성이 관계를 다치게 합니다." },
  { rank: 13, nameKoRank: "퀸", nameEnRank: "Queen", up: ["명석함", "독립", "냉철"], rev: ["냉정함", "비판적", "외로움"], upM: "감정에 휘둘리지 않고 명석하게 판단하는 시기입니다.", revM: "지나친 냉정함이 벽을 세우고 외로움을 부릅니다." },
  { rank: 14, nameKoRank: "킹", nameEnRank: "King", up: ["논리", "공정", "권위"], rev: ["독단", "냉혹", "권위주의"], upM: "이성과 원칙으로 상황을 정리하는 시기입니다.", revM: "논리가 냉혹함이나 독단으로 흐릅니다." },
];

// 펜타클(흙) — 물질·돈·일·현실
const PENTACLES: MinorSpec[] = [
  { rank: 1, nameKoRank: "에이스", nameEnRank: "Ace", up: ["기회", "번영", "안정된 시작"], rev: ["기회 상실", "불안정", "지연"], upM: "현실적인 기회와 풍요의 씨앗이 주어집니다.", revM: "좋은 기회를 놓치거나 기반이 흔들립니다." },
  { rank: 2, nameKoRank: "2", nameEnRank: "Two", up: ["균형", "융통성", "저글링"], rev: ["과부하", "불균형", "혼란"], upM: "여러 일을 유연하게 저울질하며 굴려가는 시기입니다.", revM: "감당할 게 너무 많아 균형이 무너집니다." },
  { rank: 3, nameKoRank: "3", nameEnRank: "Three", up: ["협업", "실력", "기반 다지기"], rev: ["불협화음", "실력 부족", "지연"], upM: "함께 힘을 모아 탄탄한 기반을 쌓는 시기입니다.", revM: "손발이 안 맞거나 준비가 부족합니다." },
  { rank: 4, nameKoRank: "4", nameEnRank: "Four", up: ["안정", "소유", "보존"], rev: ["집착", "인색", "손실 두려움"], upM: "가진 것을 지키며 안정을 다지는 시기입니다.", revM: "지나친 집착과 인색함이 흐름을 막습니다." },
  { rank: 5, nameKoRank: "5", nameEnRank: "Five", up: ["결핍", "곤란", "소외"], rev: ["회복", "도움", "위기 탈출"], upM: "물질적·정서적 결핍으로 힘든 시기입니다.", revM: "도움의 손길로 어려움에서 벗어나기 시작합니다." },
  { rank: 6, nameKoRank: "6", nameEnRank: "Six", up: ["나눔", "관대함", "균형된 주고받음"], rev: ["불공정", "의존", "조건부 호의"], upM: "주고받음의 균형 속에 도움이 오가는 시기입니다.", revM: "일방적이거나 조건이 붙은 관계가 됩니다." },
  { rank: 7, nameKoRank: "7", nameEnRank: "Seven", up: ["인내", "투자", "결실 대기"], rev: ["조급", "헛수고 우려", "재검토"], upM: "노력의 결실을 기다리며 점검하는 시기입니다.", revM: "성과가 더뎌 조급해지거나 방향을 재검토합니다." },
  { rank: 8, nameKoRank: "8", nameEnRank: "Eight", up: ["숙련", "성실", "집중"], rev: ["매너리즘", "완벽주의", "무성의"], upM: "묵묵히 갈고닦아 실력이 느는 시기입니다.", revM: "반복에 지치거나 대충하려는 마음이 듭니다." },
  { rank: 9, nameKoRank: "9", nameEnRank: "Nine", up: ["자립", "풍요", "여유"], rev: ["과시", "불안정", "고립"], upM: "스스로의 힘으로 이룬 여유를 누리는 시기입니다.", revM: "겉치레에 치우치거나 홀로 남은 느낌이 듭니다." },
  { rank: 10, nameKoRank: "10", nameEnRank: "Ten", up: ["풍요", "안정된 기반", "가족"], rev: ["재정 불안", "갈등", "유산 문제"], upM: "탄탄한 기반과 안정이 오래 이어지는 시기입니다.", revM: "안정이 흔들리거나 관계·재정에 균열이 생깁니다." },
  { rank: 11, nameKoRank: "페이지", nameEnRank: "Page", up: ["배움", "목표", "현실적 시작"], rev: ["산만", "게으름", "비현실"], upM: "새로운 배움과 목표를 착실히 시작하는 시기입니다.", revM: "집중이 흐려지거나 계획이 뜬구름 같습니다." },
  { rank: 12, nameKoRank: "나이트", nameEnRank: "Knight", up: ["성실", "꾸준함", "책임감"], rev: ["정체", "완고", "지루함"], upM: "느리지만 믿음직하게 밀고 나가는 시기입니다.", revM: "지나친 신중함이 정체로 이어집니다." },
  { rank: 13, nameKoRank: "퀸", nameEnRank: "Queen", up: ["실용", "보살핌", "안정"], rev: ["과로", "물질 집착", "자기소홀"], upM: "현실을 잘 챙기며 주변을 보살피는 시기입니다.", revM: "일과 물질에 매여 자신을 돌보지 못합니다." },
  { rank: 14, nameKoRank: "킹", nameEnRank: "King", up: ["성취", "안정", "풍요로운 리더"], rev: ["탐욕", "완고", "물질주의"], upM: "노력으로 이룬 안정과 풍요를 누리는 시기입니다.", revM: "탐욕이나 완고함이 관계를 메마르게 합니다." },
];

const MINOR: TarotCard[] = [
  ...WANDS.map((s) => minorCard("wands", s)),
  ...CUPS.map((s) => minorCard("cups", s)),
  ...SWORDS.map((s) => minorCard("swords", s)),
  ...PENTACLES.map((s) => minorCard("pentacles", s)),
];

export const TAROT_CARDS: TarotCard[] = [...MAJOR, ...MINOR];

// id → 카드 빠른 조회
const CARD_BY_ID = new Map(TAROT_CARDS.map((c) => [c.id, c]));

export function getCard(id: string): TarotCard | undefined {
  return CARD_BY_ID.get(id);
}

// 무결성: 78장, id 중복 없음 (개발 중 조기 감지)
if (process.env.NODE_ENV !== "production") {
  if (TAROT_CARDS.length !== 78) {
    console.warn(`[tarot] 카드 수가 78이 아닙니다: ${TAROT_CARDS.length}`);
  }
  if (CARD_BY_ID.size !== TAROT_CARDS.length) {
    console.warn("[tarot] 카드 id 중복이 있습니다");
  }
}
