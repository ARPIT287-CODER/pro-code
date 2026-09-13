const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_PATH = path.join(__dirname, 'ProCode_Documentation_and_Guide.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(writeStream);

// Theme Colors
const COLOR_PRIMARY = '#0F172A';   // Deep Navy / Slate 900
const COLOR_ACCENT = '#D97706';    // Amber 600
const COLOR_BLUE = '#2563EB';      // Blue 600
const COLOR_TEXT = '#1E293B';      // Slate 800
const COLOR_MUTED = '#64748B';     // Slate 500
const COLOR_CARD_BG = '#F8FAFC';   // Slate 50
const COLOR_CARD_BORDER = '#E2E8F0';

function drawHeader(title) {
  doc.save();
  doc.fontSize(8).fillColor(COLOR_MUTED).font('Helvetica');
  doc.text(title.toUpperCase(), 50, 30, { align: 'left' });
  doc.text('PROCODE OFFICIAL SPECIFICATION & GUIDE', 50, 30, { align: 'right' });
  doc.moveTo(50, 42).lineTo(545, 42).strokeColor(COLOR_CARD_BORDER).lineWidth(0.5).stroke();
  doc.restore();
}

function drawSectionHeading(number, title) {
  doc.moveDown(1.5);
  doc.fontSize(18).fillColor(COLOR_PRIMARY).font('Helvetica-Bold');
  doc.text(`${number}. ${title}`);
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(COLOR_ACCENT).lineWidth(2).stroke();
  doc.moveDown(0.8);
}

function drawSubHeading(title) {
  doc.moveDown(0.8);
  doc.fontSize(13).fillColor(COLOR_BLUE).font('Helvetica-Bold');
  doc.text(title);
  doc.moveDown(0.4);
}

function drawParagraph(text) {
  doc.fontSize(9.5).fillColor(COLOR_TEXT).font('Helvetica').lineGap(3.5);
  doc.text(text);
  doc.moveDown(0.5);
}

function drawCallout(title, text, borderColor = COLOR_BLUE, bgColor = '#EFF6FF') {
  const currentY = doc.y;
  doc.save();
  doc.roundedRect(50, currentY, 495, 52, 6).fillColor(bgColor).fill();
  doc.roundedRect(50, currentY, 495, 52, 6).strokeColor(borderColor).lineWidth(1).stroke();
  doc.restore();

  doc.fontSize(9.5).fillColor(borderColor).font('Helvetica-Bold').text(title, 62, currentY + 8);
  doc.fontSize(8.5).fillColor(COLOR_TEXT).font('Helvetica').lineGap(2).text(text, 62, currentY + 24, { width: 470 });
  doc.y = currentY + 62;
}

function drawCodeBlock(code) {
  const lines = code.split('\n');
  const boxHeight = lines.length * 12 + 16;
  const currentY = doc.y;

  doc.save();
  doc.roundedRect(50, currentY, 495, boxHeight, 4).fillColor('#0F172A').fill();
  doc.restore();

  doc.fontSize(8).fillColor('#F8FAFC').font('Courier').lineGap(2);
  doc.text(code, 60, currentY + 8, { width: 475 });
  doc.y = currentY + boxHeight + 8;
}

function drawTable(headers, rows, columnWidths) {
  const startX = 50;
  let currentY = doc.y;
  const rowHeight = 22;

  // Header Row
  doc.save();
  doc.rect(startX, currentY, 495, rowHeight).fillColor(COLOR_PRIMARY).fill();
  doc.restore();

  let curX = startX;
  doc.fontSize(8.5).fillColor('#FFFFFF').font('Helvetica-Bold');
  headers.forEach((h, i) => {
    doc.text(h, curX + 6, currentY + 6, { width: columnWidths[i] - 12 });
    curX += columnWidths[i];
  });

  currentY += rowHeight;

  // Body Rows
  rows.forEach((row, rIdx) => {
    const bg = rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
    doc.save();
    doc.rect(startX, currentY, 495, rowHeight).fillColor(bg).fill();
    doc.rect(startX, currentY, 495, rowHeight).strokeColor(COLOR_CARD_BORDER).lineWidth(0.5).stroke();
    doc.restore();

    curX = startX;
    doc.fontSize(8).fillColor(COLOR_TEXT).font('Helvetica');
    row.forEach((cell, cIdx) => {
      doc.text(String(cell), curX + 6, currentY + 6, { width: columnWidths[cIdx] - 12 });
      curX += columnWidths[cIdx];
    });
    currentY += rowHeight;
  });

  doc.y = currentY + 10;
}

// ==========================================
// PAGE 1: COVER PAGE
// ==========================================
doc.save();
// Background Header Block
doc.rect(0, 0, 595, 280).fillColor(COLOR_PRIMARY).fill();
// Accent bar
doc.rect(0, 276, 595, 6).fillColor(COLOR_ACCENT).fill();

// Title content
doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(36).text('ProCode', 50, 75);
doc.fillColor(COLOR_ACCENT).fontSize(16).text('COLLEGE DSA & CODING PRACTICE PLATFORM', 50, 120);

doc.fillColor('#94A3B8').font('Helvetica').fontSize(12).lineGap(4);
doc.text('A curriculum-aligned coding platform built for first-year students to practice syllabus DSA, compete on class leaderboards, and seamlessly graduate to LeetCode.', 50, 150, { width: 495 });

doc.fillColor('#E2E8F0').font('Helvetica-Bold').fontSize(10);
doc.text('TECHNICAL ARCHITECTURE  |  HOSTING RUNBOOK  |  STUDENT USER MANUAL', 50, 230);
doc.restore();

doc.y = 310;
doc.fontSize(14).fillColor(COLOR_PRIMARY).font('Helvetica-Bold').text('Document Overview & Metadata');
doc.moveDown(0.5);

drawTable(
  ['Property', 'Platform Specification'],
  [
    ['Platform Name', 'ProCode (College DSA Practice Platform)'],
    ['Target Audience', 'First-Year Engineering Students, Faculty & Administrators'],
    ['Core Architecture', 'MERN Stack (MongoDB, Express, React, Node) + Judge0 Execution Engine'],
    ['Gamification Model', 'Section/Class Leaderboards (Daily, Weekly, Career) + Bronze-to-Conqueror Tiers'],
    ['Exam Preparation', 'Unit-wise Problem Ladder + Integrated College PYQ Library + Concept Notes'],
    ['Bridge Mechanism', 'Automatic LeetCode Equivalent Linkage upon Problem Solve'],
    ['Deployment Targets', 'Frontend: Vercel / Netlify | Backend: Render / VPS | Database: Atlas'],
    ['Document Version', '1.0.0 (Production Master Release)']
  ],
  [140, 355]
);

doc.moveDown(1);
drawCallout(
  'EXECUTIVE SUMMARY',
  'Generic platforms like LeetCode or GeeksforGeeks fail first-year college beginners because they assume prior knowledge and disconnect from college exam patterns. ProCode solves this by mapping problems directly to semester units and past papers, while offering batch-level rivalry and a direct graduation bridge to LeetCode.'
);

// ==========================================
// PAGE 2: ARCHITECTURE & HOW IT WAS MADE
// ==========================================
doc.addPage();
drawHeader('Chapter 1 — System Architecture');
drawSectionHeading('1', 'How ProCode Was Built & Architectural Blueprint');

drawParagraph('ProCode is engineered as a decoupled, resilient, mobile-first client-server platform. It isolates the high-risk, computationally heavy task of code execution from general web browsing, ensuring that even under severe student concurrency spikes (e.g. during lab exams or batch contests), the platform remains responsive and never crashes.');

drawSubHeading('1.1 High-Level Component Flow');
drawParagraph('The system is structured across four primary cooperative layers:');

drawTable(
  ['Component', 'Role & Implementation Details'],
  [
    ['Client SPA (React + Vite)', 'Responsive web interface with dark navy theme, interactive multi-language code editor, syllabus ladders, and live batch podium.'],
    ['API Gateway (Express.js)', 'Stateless REST server managing authentication (JWT), rate-limiting safeguards, anti-cheat reporting, and gamification calculations.'],
    ['Execution Bridge (Judge0 / Local)', 'Sandboxed code execution proxy supporting C, C++, Java, and Python with CPU time (2.0s) and memory caps (128MB). Includes offline fallback evaluator.'],
    ['Persistence (MongoDB / Local Store)', 'Dual-mode database storing student profiles, problem test cases, PYQs, concept notes, and immutable submission audit logs.']
  ],
  [150, 345]
);

drawSubHeading('1.2 Gamification & Point Integrity Algorithm');
drawParagraph('To eliminate "point-farming" where students repeatedly re-submit the same solution, points are awarded exactly once per unique problem. Rank tiers only move upward (no demotion), preserving beginner confidence:');

drawTable(
  ['Difficulty Level', 'Points Awarded', 'Criteria & Constraints'],
  [
    ['Easy', '10 Points', 'Basic 1D array/string iterations, single loop O(N) operations.'],
    ['Medium', '25 Points', 'Two pointers, recursion trees, stack applications, sorting.'],
    ['Hard', '50 Points', 'Topic graduation problems, optimal two-pointer math (e.g. Water Container).']
  ],
  [120, 100, 275]
);

drawParagraph('Rank Tiers: Bronze (0–79 pts) -> Silver (80–299 pts) -> Gold (300–699 pts) -> Platinum (700–1499 pts) -> Diamond (1500–2999 pts) -> Conqueror (3000+ pts).');

drawSubHeading('1.3 Reliability, Crash Resilience & Defensive Design');
drawParagraph('In accordance with the build roadmap, multiple fail-safes are hardcoded:');
drawParagraph('• Express Global Error Middleware: All uncaught exceptions return structured HTTP 500 JSON without terminating the Node.js process.');
drawParagraph('• React Error Boundary: Catches runtime UI rendering exceptions and renders a helpful recovery button instead of a blank white screen.');
drawParagraph('• Maintenance Interceptor: Toggled via MAINTENANCE_MODE=true in .env; immediately serves a friendly "Back in 10 minutes" screen to prevent users hitting partial states during upgrades.');
drawParagraph('• Rate Limiting: IP-based sliding window restricts aggressive submission bursts and protects authentication endpoints from brute force.');

// ==========================================
// PAGE 3: TECHNOLOGY STACK BREAKDOWN
// ==========================================
doc.addPage();
drawHeader('Chapter 2 — Technology Stack');
drawSectionHeading('2', 'Complete Technology Stack Breakdown');

drawParagraph('The technologies powering ProCode were deliberately chosen for rapid responsiveness, zero-friction developer setup, and effortless cloud scaling:');

drawTable(
  ['Tier', 'Technology Choice', 'Technical Rationale & Advantage'],
  [
    ['Frontend Core', 'React 19 + Vite 8', 'Instant HMR, blazing-fast JSX bundling, and lightweight modern rendering architecture.'],
    ['UI & Styling', 'Tailwind CSS v4', 'Utility-first styling with zero CSS bloat; built-in sm:, md:, lg: responsive breakpoints for mobile devices.'],
    ['Icons & Effects', 'Lucide React + Canvas Confetti', 'Clean SVG icons and celebratory particle physics upon problem solve.'],
    ['Backend Server', 'Node.js v24 + Express 4', 'Asynchronous event-driven I/O ideal for handling concurrent student submission streams.'],
    ['Security & Auth', 'JSON Web Tokens (JWT) + Bcrypt', 'Stateless cryptographic token authentication and salted one-way password hashing.'],
    ['Traffic Defense', 'express-rate-limit', 'Protects against DDOS, submission spamming, and API enumeration.'],
    ['Database Layer', 'Dual-Mode (Mongoose + JSON)', 'Full MongoDB Atlas support in production + zero-setup local persistent fallback for offline running.'],
    ['Execution Sandboxing', 'Judge0 Engine (API / Docker)', 'Multi-language isolated Linux container runner for C, C++, Java, and Python with hard resource quotas.']
  ],
  [110, 140, 245]
);

drawSubHeading('2.1 Why Dual-Mode Database Architecture?');
drawParagraph('During local evaluation or in environments without an active MongoDB daemon, traditional MERN apps crash on startup. ProCode incorporates a transparent JsonCollection adapter in services/db.js. If MONGODB_URI is provided in .env, it seamlessly binds to MongoDB Atlas; otherwise, it synchronizes atomically with local store.json, making it completely zero-friction for examiners or student demonstrations.');

drawSubHeading('2.2 Sandboxed Execution Safety');
drawParagraph('Student-submitted code is inherently untrusted — infinite loops (while(1)), excessive heap allocation, or file system access attempts are common. By delegating compilation to Judge0 containers with 2-second CPU limits and 128MB memory caps, student code cannot affect the host Node.js application.');

// ==========================================
// PAGE 4: HOSTING & DEPLOYMENT RUNBOOK
// ==========================================
doc.addPage();
drawHeader('Chapter 3 — Platform Owner Hosting Runbook');
drawSectionHeading('3', 'Hosting Instructions for Platform Owner (You)');

drawParagraph('Follow these step-by-step instructions to host and operate ProCode in production for your college or cohort.');

drawSubHeading('3.1 Step 1: Database Setup (MongoDB Atlas — Free Tier)');
drawParagraph('1. Create a free account on mongodb.com/cloud/atlas.');
drawParagraph('2. Deploy a free M0 Shared Cluster in your nearest AWS region (e.g. Mumbai / Singapore).');
drawParagraph('3. In "Database Access", create a user (e.g., procode_admin) and secure password.');
drawParagraph('4. In "Network Access", add IP Address 0.0.0.0/0 (Allow access from anywhere).');
drawParagraph('5. Under "Connect" -> "Drivers", copy your MongoDB connection URI:');
drawCodeBlock('mongodb+srv://procode_admin:<password>@cluster0.procode.mongodb.net/procode_db?retryWrites=true&w=majority');

drawSubHeading('3.2 Step 2: Code Execution Setup (Judge0)');
drawParagraph('Choose one of two options:');
drawParagraph('• Option A (Fastest): Subscribe to Judge0 CE on RapidAPI (rapidapi.com/hermanzdosilovic/api/judge0-ce). Copy your RapidAPI Key.');
drawParagraph('• Option B (Self-Hosted): Deploy Judge0 CE using Docker on a $5/month DigitalOcean droplet:');
drawCodeBlock('curl -s https://raw.githubusercontent.com/judge0/judge0/master/docker-compose.yml -o docker-compose.yml\ndocker-compose up -d');

drawSubHeading('3.3 Step 3: Backend Deployment (Render.com / VPS)');
drawParagraph('1. Connect your GitHub repository to Render.com and create a new "Web Service".');
drawParagraph('2. Set Root Directory to "server", Runtime to "Node", Build Command to "npm install", and Start Command to "node index.js".');
drawParagraph('3. Configure Environment Variables in the Render dashboard:');

drawTable(
  ['Variable Name', 'Recommended Production Value'],
  [
    ['PORT', '5000 (or Render default)'],
    ['MONGODB_URI', 'mongodb+srv://procode_admin:... (from Step 1)'],
    ['JWT_SECRET', 'your_long_random_cryptographic_secret_string'],
    ['JUDGE0_API_URL', 'https://judge0-ce.p.rapidapi.com (or your Docker host)'],
    ['JUDGE0_API_KEY', 'your_rapidapi_judge0_key'],
    ['MAINTENANCE_MODE', 'false (set to true only during updates)']
  ],
  [160, 335]
);

drawParagraph('4. Health Check Verification: Test https://your-backend.onrender.com/api/health. It must return status: "ok".');

drawSubHeading('3.4 Step 4: Frontend Deployment (Vercel / Netlify)');
drawParagraph('1. In Vercel, import your Git repo and choose the "client" folder as the root.');
drawParagraph('2. Build Command: "npm run build" | Output Directory: "dist".');
drawParagraph('3. Deploy! Vercel provides free SSL, automatic global CDN, and DDoS protection.');

// ==========================================
// PAGE 5: SCALING & MAINTENANCE
// ==========================================
doc.addPage();
drawHeader('Chapter 3 — Scaling & Maintenance Operations');
drawSectionHeading('3.5', 'Handling 1,000 Concurrent Students & Maintenance');

drawParagraph('When hosting internal college exams or competitive programming contests with up to 1,000 students online at once, apply these production guidelines (Roadmap Page 7, 9 & 10):');

drawSubHeading('A. Isolating Browsing from Execution Traffic');
drawParagraph('Browsing problem descriptions, reading concept notes, and checking leaderboards consumes almost zero CPU on your server. Code submission is the bottleneck. By utilizing Judge0 queueing, submissions are processed in worker threads without exhausting Express socket pools.');

drawSubHeading('B. PM2 Process Clustering (on VPS / Ubuntu)');
drawParagraph('If self-hosting the backend on an Ubuntu VPS, run Node.js in cluster mode across all CPU cores:');
drawCodeBlock('npm install -g pm2\npm2 start index.js -i max --name "procode-api"\npm2 startup\npm2 save');

drawSubHeading('C. Activating Planned Maintenance Mode');
drawParagraph('Before updating syllabus problem sets or modifying database schemas:');
drawParagraph('1. Set MAINTENANCE_MODE=true in your server environment variables.');
drawParagraph('2. Redeploy or restart the backend. All incoming API calls immediately receive a friendly 503 response stating: "ProCode is undergoing scheduled maintenance. Back in 10 minutes."');
drawParagraph('3. Perform your updates safely, then set MAINTENANCE_MODE=false to restore student access.');

drawCallout(
  'UPTIME MONITORING TIP',
  'Configure free uptime monitoring with UptimeRobot (uptimerobot.com) pointed at /api/health every 3 minutes. If downtime occurs, you will receive immediate Telegram/Email alerts.'
);

// ==========================================
// PAGE 6: STUDENT USER INSTRUCTIONS
// ==========================================
doc.addPage();
drawHeader('Chapter 4 — Student User Manual');
drawSectionHeading('4', 'User Instructions for Students (How to Use ProCode)');

drawParagraph('Welcome to ProCode! This platform was built specifically to help you ace your internal college exams, master DSA fundamentals, and graduate confidently to LeetCode.');

drawSubHeading('4.1 Creating Your Account & Joining Your Batch');
drawParagraph('1. Click "Join / Sign In" at the top right of the navigation bar.');
drawParagraph('2. Switch to the "Register Student" tab.');
drawParagraph('3. Enter your Full Name, College Email ID, and Password.');
drawParagraph('4. Select your College Batch / Section (e.g. CSE-1A, IT-1B, ECE-1A). This links you directly to your class leaderboard!');
drawParagraph('5. Choose an optional Public Alias if you prefer displaying a handle instead of your legal name.');

drawSubHeading('4.2 Navigating the Problem Ladder');
drawParagraph('The problem ladder is structured strictly in college syllabus sequence:');
drawParagraph('• Unit 1: Arrays (Linear data structures, two-pointer swaps, memory formulas)');
drawParagraph('• Unit 2: Strings (Palindrome checking, pattern matching)');
drawParagraph('• Unit 3: Recursion (Tower of Hanoi, Fibonacci trees, recurrence relations)');
drawParagraph('• Unit 4: Searching (Binary search variations, O(log N) proofs)');
drawParagraph('• Unit 5 & 6: Stacks & Queues (Balanced parentheses, infix-to-postfix expressions)');
drawParagraph('Each problem displays its official College Exam Citation Tag (e.g., 🎓 Mid-Term Oct 2024, 5 Marks) so you know exactly which university exam tested this concept.');

drawSubHeading('4.3 Coding in the Studio & Running Tests');
drawParagraph('1. Select your preferred programming language: C, C++, Java, or Python from the top bar. ProCode automatically provides an exam-ready boilerplate template.');
drawParagraph('2. Write your algorithm in the code editor.');
drawParagraph('3. Click "Run Cases" to test your solution against visible Sample Test Cases.');
drawParagraph('4. Use the "Custom Input" tab to supply your own test inputs for edge-case debugging.');
drawParagraph('5. When confident, click "Submit Code" to evaluate your solution against the protected Hidden Test Cases.');

drawSubHeading('4.4 Earning Points & Climbing Rank Tiers');
drawParagraph('When all hidden test cases pass, you will receive an "Accepted" verdict with celebratory confetti:');
drawParagraph('• Easy Problems: +10 Points | Medium Problems: +25 Points | Hard Problems: +50 Points');
drawParagraph('• Points are awarded ONCE per problem — you cannot farm points by re-solving the same problem.');
drawParagraph('• Rank Tiers only move UPWARD (no demotion): Bronze -> Silver -> Gold -> Platinum -> Diamond -> Conqueror.');

drawSubHeading('4.5 The LeetCode Graduation Bridge');
drawParagraph('Every topic ends with a starred Graduation Problem. Once solved, ProCode unlocks direct links to the equivalent LeetCode problem along with 2 recommended follow-ups (Easy -> Medium) to help you transition to tech placement interviews.');

drawSubHeading('4.6 Accessing PYQ Exam Papers & Concept Notes');
drawParagraph('• PYQ Papers: Visit the "PYQ Papers" tab to search and download past semester exam papers, mid-term question sets, and practical lab viva prompts.');
drawParagraph('• Exam Notes: Visit "Exam Notes" for concise, high-yield formula summaries and derivations that professors love to test in 10-mark theory questions.');

// ==========================================
// FINALIZE PDF & WRITE PAGE NUMBERS
// ==========================================
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  if (i > 0) { // skip cover page
    doc.save();
    doc.fontSize(8).fillColor(COLOR_MUTED).font('Helvetica');
    doc.text(`PROCODE DOCUMENTATION  |  PAGE ${i + 1} OF ${range.count}`, 50, 800, { align: 'center', width: 495 });
    doc.restore();
  }
}

doc.end();

writeStream.on('finish', () => {
  console.log('PDF documentation successfully generated at:', OUTPUT_PATH);
});
