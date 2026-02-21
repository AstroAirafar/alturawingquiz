require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD){
  console.error("ADMIN_PASSWORD not set in .env");
  process.exit(1);
}

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Database Setup ─────────────────────────────────────────
const db = new Database(path.join(__dirname, 'quiz.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    answers TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Quiz Data ──────────────────────────────────────────────
const quizData = {
  caseStudy: {
    title: "The Tata Nano: A Vision for the Common Man",
    content: `In 2008, Ratan Tata unveiled the Tata Nano, the world's cheapest car priced at approximately ₹1 lakh. The idea was born when Ratan Tata saw a family of four precariously riding a scooter in the rain. He envisioned an affordable, safe mode of transportation for millions of Indian families who couldn't afford a conventional car.

The project faced enormous challenges — engineers had to rethink every component to cut costs without compromising safety. The Nano featured a rear-mounted 624cc engine, achieved 25 km/l fuel efficiency, and met all Indian safety and emission standards.

Despite the innovative engineering, the Nano faced marketing challenges. It became labeled as "the poor man's car," which hurt its brand image. Customers who could afford it didn't want to be seen driving the cheapest car, while those it was designed for still couldn't afford even ₹1 lakh.

Production was initially planned at Singur, West Bengal, but had to be relocated to Sanand, Gujarat due to political protests and land acquisition issues. This added over ₹1,500 crore in additional costs.

By 2018, production had virtually ceased with only 1 unit produced. However, the Nano remains a powerful case study in innovation, frugal engineering, and the complexities of market positioning. Ratan Tata himself said he regretted that it was positioned as "cheap" rather than "affordable."`
  },
  caseStudyQuestions: [
    {
      id: 1,
      question: "What inspired Ratan Tata to conceptualize the Tata Nano?",
      options: [
        "Competing with Maruti Suzuki's Alto",
        "Seeing a family of four riding a scooter in the rain",
        "A government initiative for affordable cars",
        "Request from Tata Motors' board of directors"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "What was the original price of the Tata Nano when it was unveiled?",
      options: [
        "₹50,000",
        "₹2 lakh",
        "₹1 lakh",
        "₹1.5 lakh"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "Why was the Nano's production shifted from Singur, West Bengal to Sanand, Gujarat?",
      options: [
        "Better infrastructure in Gujarat",
        "Tax incentives offered by Gujarat government",
        "Political protests and land acquisition issues",
        "Proximity to raw material suppliers"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "What did Ratan Tata say was his biggest regret about the Nano?",
      options: [
        "That the car was too small",
        "That it was positioned as 'cheap' rather than 'affordable'",
        "That the engine was underpowered",
        "That he didn't launch it internationally"
      ],
      correct: 1
    }
  ],
  generalQuestions: [
    {
      id: 5,
      question: "Which of the following strategic moves best exemplifies Ratan Tata's transformational leadership in taking the Tata Group global?",
      options: [
        "Focusing the conglomerate's efforts exclusively on the protected Indian domestic market.",
        "Acquiring major international legacy brands like Jaguar Land Rover, Tetley, and Corus.",
        "Liquidating Tata Steel to focus purely on software and IT services.",
        "Decentralizing the Tata Group so each company operated without a unified brand."
      ],
      correct: 1
    },
    {
      id: 6,
      question: "How did Ratan Tata most notably demonstrate his \"servant\" and empathetic leadership style in the aftermath of the 26/11 Mumbai terror attacks?",
      options: [
        "By immediately restructuring the hospitality division to recoup financial losses.",
        "By delegating the crisis response entirely to his human resources and PR departments.",
        "By permanently closing the Taj Mahal Palace Hotel to avoid future risks.",
        "By personally visiting affected employees and ensuring comprehensive financial, medical, and psychological support for their families."
      ],
      correct: 3
    },
    {
      id: 7,
      question: "When Ratan Tata took over as Chairman in 1991, he faced resistance from powerful subsidiary leaders (often called \"satraps\"). How did he strategically enforce cohesion and a unified corporate identity?",
      options: [
        "He implemented a mandatory retirement age and increased Tata Sons' shareholding in group companies.",
        "He gave the subsidiary leaders total autonomy to operate as independent businesses.",
        "He sold off the subsidiaries that refused to comply with his new vision.",
        "He avoided confrontation and allowed the existing fragmented structure to remain."
      ],
      correct: 0
    },
    {
      id: 8,
      question: "The inception and development of the Tata Nano, despite its eventual commercial hurdles, primarily highlighted which of Ratan Tata's leadership qualities?",
      options: [
        "A strict adherence to producing only high-margin, premium products.",
        "His visionary thinking and desire to innovate an affordable, safer transportation option for the average Indian family.",
        "A tendency to prioritize marketing budgets over grassroots engineering.",
        "An aversion to taking calculated risks in new market segments."
      ],
      correct: 1
    },
    {
      id: 9,
      question: "Ratan Tata's approach to ethical leadership is best characterized by which of the following philosophies?",
      options: [
        "Profitability must be achieved at all costs, prioritizing shareholders above all stakeholders.",
        "Corporate Social Responsibility (CSR) is a secondary function used primarily for public relations.",
        "Business growth must be intrinsically linked with social welfare, corporate integrity, and human dignity.",
        "Ethical standards should be flexible depending on the legal loopholes of the country of operation."
      ],
      correct: 2
    },
    {
      id: 10,
      question: "Ratan Tata's perspective on decisiveness and confidence as a leader is perfectly captured in his famous quote: \"I don't believe in taking the right decision, I take a decision and...\"",
      options: [
        "\"...hope the market responds favorably.\"",
        "\"...make it right.\"",
        "\"...let the board handle the consequences.\"",
        "\"...change it if the data proves me wrong.\""
      ],
      correct: 1
    }
  ]
};

// ── API Routes ─────────────────────────────────────────────

// Get quiz data (without correct answers)
app.get('/api/quiz', (req, res) => {
  const safeQuiz = {
    caseStudy: quizData.caseStudy,
    caseStudyQuestions: quizData.caseStudyQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    })),
    generalQuestions: quizData.generalQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }))
  };
  res.json(safeQuiz);
});

// Submit quiz
app.post('/api/submit', (req, res) => {
  const { userName, answers } = req.body;

  if (!userName || !answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Invalid submission. Name and answers required.' });
  }

  const trimmedName = userName.trim();
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return res.status(400).json({ error: 'Name must be between 2 and 50 characters.' });
  }

  // Grade the quiz
  const allQuestions = [...quizData.caseStudyQuestions, ...quizData.generalQuestions];
  let score = 0;
  const total = allQuestions.length;
  const detailedResults = [];

  for (const q of allQuestions) {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct;
    if (isCorrect) score++;

    detailedResults.push({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct,
      userAnswer: userAnswer !== undefined ? userAnswer : null,
      isCorrect
    });
  }

  const id = uuidv4();
  const stmt = db.prepare(
    'INSERT INTO responses (id, user_name, answers, score, total, submitted_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run(id, trimmedName, JSON.stringify(answers), score, total, new Date().toISOString());

  res.json({
    id,
    userName: trimmedName,
    score,
    total,
    percentage: Math.round((score / total) * 100),
    results: detailedResults
  });
});

// Get individual result
app.get('/api/result/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM responses WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Result not found.' });
  }

  const allQuestions = [...quizData.caseStudyQuestions, ...quizData.generalQuestions];
  const userAnswers = JSON.parse(row.answers);
  const detailedResults = allQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correct,
    userAnswer: userAnswers[q.id] !== undefined ? userAnswers[q.id] : null,
    isCorrect: userAnswers[q.id] === q.correct
  }));

  res.json({
    id: row.id,
    userName: row.user_name,
    score: row.score,
    total: row.total,
    percentage: Math.round((row.score / row.total) * 100),
    submittedAt: row.submitted_at,
    results: detailedResults
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    // Return a simple token
    const token = Buffer.from(`admin:${Date.now()}:${ADMIN_PASSWORD}`).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid password.' });
  }
});

// Admin middleware
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    if (decoded.includes(ADMIN_PASSWORD)) {
      next();
    } else {
      res.status(401).json({ error: 'Invalid token.' });
    }
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
}

// Admin: Get all responses
app.get('/api/admin/responses', adminAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM responses ORDER BY submitted_at DESC').all();
  const totalResponses = rows.length;
  const avgScore = totalResponses > 0
    ? Math.round(rows.reduce((sum, r) => sum + r.score, 0) / totalResponses * 10) / 10
    : 0;
  const highestScore = totalResponses > 0 ? Math.max(...rows.map(r => r.score)) : 0;
  const lowestScore = totalResponses > 0 ? Math.min(...rows.map(r => r.score)) : 0;

  // Question-wise accuracy
  const allQuestions = [...quizData.caseStudyQuestions, ...quizData.generalQuestions];
  const questionStats = allQuestions.map(q => {
    let correct = 0;
    for (const row of rows) {
      const ans = JSON.parse(row.answers);
      if (ans[q.id] === q.correct) correct++;
    }
    return {
      id: q.id,
      question: q.question,
      correctCount: correct,
      totalAttempts: totalResponses,
      accuracy: totalResponses > 0 ? Math.round((correct / totalResponses) * 100) : 0
    };
  });

  res.json({
    stats: {
      totalResponses,
      avgScore,
      highestScore,
      lowestScore,
      totalQuestions: allQuestions.length
    },
    questionStats,
    responses: rows.map(r => ({
      id: r.id,
      userName: r.user_name,
      score: r.score,
      total: r.total,
      percentage: Math.round((r.score / r.total) * 100),
      submittedAt: r.submitted_at
    }))
  });
});

// Admin: Get single response detail
app.get('/api/admin/responses/:id', adminAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM responses WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Response not found.' });

  const allQuestions = [...quizData.caseStudyQuestions, ...quizData.generalQuestions];
  const userAnswers = JSON.parse(row.answers);
  const detailedResults = allQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correct,
    userAnswer: userAnswers[q.id] !== undefined ? userAnswers[q.id] : null,
    isCorrect: userAnswers[q.id] === q.correct
  }));

  res.json({
    id: row.id,
    userName: row.user_name,
    score: row.score,
    total: row.total,
    percentage: Math.round((row.score / row.total) * 100),
    submittedAt: row.submitted_at,
    results: detailedResults
  });
});

// ── Serve Pages ────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/quiz', (req, res) => res.sendFile(path.join(__dirname, 'public', 'quiz.html')));
app.get('/result', (req, res) => res.sendFile(path.join(__dirname, 'public', 'result.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 AlturaWing Server running at http://localhost:${PORT}`);
  console.log(`📋 Admin password: ${ADMIN_PASSWORD}`);
});
