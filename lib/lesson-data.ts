export interface LessonItem {
  id: number
  title: string
  japanese: string
  romaji: string
  translation: string
  type: "learn" | "review" | "summary"
  practicePrompt?: string
}

export const lessonData: LessonItem[] = [
  {
    id: 1,
    title: "Greeting",
    japanese: "はじめまして。",
    romaji: "Hajimemashite.",
    translation: "Senang bertemu denganmu.",
    type: "learn",
  },
  {
    id: 2,
    title: "Name",
    japanese: "わたしは あきらです。",
    romaji: "Watashi wa Akira desu.",
    translation: "Nama saya Akira.",
    type: "learn",
    practicePrompt: "Coba perkenalkan namamu sendiri!",
  },
  {
    id: 3,
    title: "Origin",
    japanese: "いんどねしあから きました。",
    romaji: "Indonesia kara kimashita.",
    translation: "Saya berasal dari Indonesia.",
    type: "learn",
  },
  {
    id: 4,
    title: "School",
    japanese: "わたしは こうこうせいです。",
    romaji: "Watashi wa koukousei desu.",
    translation: "Saya seorang siswa SMA.",
    type: "learn",
  },
  {
    id: 5,
    title: "Age",
    japanese: "じゅうろくさいです。",
    romaji: "Juurokusai desu.",
    translation: "Saya berusia 16 tahun.",
    type: "learn",
  },
  {
    id: 6,
    title: "Hobby",
    japanese: "しゅみは おんがくを きくことです。",
    romaji: "Shumi wa ongaku wo kikukoto desu.",
    translation: "Hobi saya mendengarkan musik.",
    type: "learn",
  },
  {
    id: 7,
    title: "Favorite Food",
    japanese: "すきなたべものは らーめんです。",
    romaji: "Suki na tabemono wa raamen desu.",
    translation: "Makanan favorit saya ramen.",
    type: "learn",
  },
  {
    id: 8,
    title: "Dream",
    japanese: "しょうらい、せんせいに なりたいです。",
    romaji: "Shourai, sensei ni naritai desu.",
    translation: "Saya ingin menjadi guru di masa depan.",
    type: "learn",
  },
  {
    id: 9,
    title: "Review",
    japanese: "ふくしゅう",
    romaji: "Fukushuu",
    translation: "Review semua materi yang telah dipelajari.",
    type: "review",
  },
  {
    id: 10,
    title: "Final Preparation",
    japanese: "じゅんび かんりょう",
    romaji: "Junbi kanryou",
    translation: "Kamu siap untuk tantangan!",
    type: "summary",
  },
]

export interface ListeningQuestion {
  id: number
  audioText: string
  question: string
  choices: string[]
  correctIndex: number
}

export const listeningQuestions: ListeningQuestion[] = [
  {
    id: 1,
    audioText: "わたしは あきらです。",
    question: "Apa yang diperkenalkan?",
    choices: ["Umur", "Nama", "Hobi", "Sekolah"],
    correctIndex: 1,
  },
  {
    id: 2,
    audioText: "しゅみは おんがくです。",
    question: "Apa topik percakapan?",
    choices: ["Sekolah", "Hobi", "Umur", "Makanan"],
    correctIndex: 1,
  },
]

export interface SpeakingChallenge {
  id: number
  japanese: string
  romaji: string
  translation: string
  useStudentName?: boolean
}

export const speakingChallenges: SpeakingChallenge[] = [
  {
    id: 1,
    japanese: "はじめまして。",
    romaji: "Hajimemashite.",
    translation: "Senang bertemu denganmu.",
  },
  {
    id: 2,
    japanese: "わたしは [name] です。",
    romaji: "Watashi wa [name] desu.",
    translation: "Nama saya [name].",
    useStudentName: true,
  },
]

export interface QuizQuestion {
  id: number
  type: "multiple-choice" | "listening" | "speaking"
  question: string
  japanese?: string
  choices?: string[]
  correctAnswer: string | number
  audioText?: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Apa arti dari: はじめまして。",
    japanese: "はじめまして。",
    choices: ["Selamat pagi", "Sampai jumpa", "Senang bertemu", "Terima kasih"],
    correctAnswer: 2,
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "Apa arti dari: いんどねしあから きました。",
    japanese: "いんどねしあから きました。",
    choices: ["Saya suka Indonesia", "Saya berasal dari Indonesia", "Saya pergi ke Indonesia", "Indonesia indah"],
    correctAnswer: 1,
  },
  {
    id: 3,
    type: "multiple-choice",
    question: "Apa arti dari: しゅみは おんがくを きくことです。",
    japanese: "しゅみは おんがくを きくことです。",
    choices: ["Saya suka bermain musik", "Hobi saya mendengarkan musik", "Musik adalah favorit saya", "Saya belajar musik"],
    correctAnswer: 1,
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "Kalimat mana yang memperkenalkan nama?",
    choices: ["はじめまして。", "わたしは あきらです。", "じゅうろくさいです。", "いんどねしあから きました。"],
    correctAnswer: 1,
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "Apa arti dari: じゅうろくさいです。",
    japanese: "じゅうろくさいです。",
    choices: ["Saya siswa SMA", "Saya berusia 16 tahun", "Saya suka angka 16", "Saya lahir tahun 16"],
    correctAnswer: 1,
  },
  {
    id: 6,
    type: "multiple-choice",
    question: "Apa arti dari: しょうらい、せんせいに なりたいです。",
    japanese: "しょうらい、せんせいに なりたいです。",
    choices: ["Saya adalah guru", "Guru saya baik", "Saya ingin menjadi guru", "Saya bertemu guru"],
    correctAnswer: 2,
  },
  {
    id: 7,
    type: "listening",
    question: "Dengarkan audio. Apa yang diperkenalkan?",
    audioText: "わたしは あきらです。",
    choices: ["Umur", "Nama", "Hobi", "Asal"],
    correctAnswer: 1,
  },
  {
    id: 8,
    type: "listening",
    question: "Dengarkan audio. Apa topik percakapan?",
    audioText: "しゅみは おんがくです。",
    choices: ["Sekolah", "Hobi", "Umur", "Makanan"],
    correctAnswer: 1,
  },
  {
    id: 9,
    type: "speaking",
    question: "Ucapkan kalimat berikut:",
    japanese: "はじめまして。",
    correctAnswer: "はじめまして",
  },
  {
    id: 10,
    type: "speaking",
    question: "Ucapkan kalimat perkenalan nama:",
    japanese: "わたしは [name] です。",
    correctAnswer: "わたしは",
  },
]
