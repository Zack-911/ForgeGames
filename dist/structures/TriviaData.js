"use strict";
// ============================================================
//  Built-in trivia question bank
//  Organised by category and difficulty so $gameNewTrivia
//  can filter without any external API dependency.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRIVIA_BANK = void 0;
exports.getQuestion = getQuestion;
exports.shuffleChoices = shuffleChoices;
exports.TRIVIA_BANK = [
    // ── General ──────────────────────────────────────────────
    {
        question: 'How many sides does a hexagon have?',
        answer: '6',
        choices: ['5', '6', '7', '8'],
        category: 'general',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'What color is the sky on a clear day?',
        answer: 'blue',
        choices: ['red', 'blue', 'green', 'yellow'],
        category: 'general',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'How many days are in a leap year?',
        answer: '366',
        choices: ['364', '365', '366', '367'],
        category: 'general',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'What is the chemical symbol for gold?',
        answer: 'au',
        choices: ['go', 'gd', 'au', 'ag'],
        category: 'general',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What is the square root of 144?',
        answer: '12',
        choices: ['10', '11', '12', '13'],
        category: 'general',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What is the speed of light in km/s (approx)?',
        answer: '300000',
        choices: ['150000', '300000', '450000', '600000'],
        category: 'general',
        difficulty: 'hard',
        points: 400,
    },
    // ── Science ───────────────────────────────────────────────
    {
        question: 'What planet is closest to the sun?',
        answer: 'mercury',
        choices: ['venus', 'earth', 'mercury', 'mars'],
        category: 'science',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'What gas do plants absorb from the air?',
        answer: 'carbon dioxide',
        choices: ['oxygen', 'nitrogen', 'carbon dioxide', 'helium'],
        category: 'science',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'What is the powerhouse of the cell?',
        answer: 'mitochondria',
        choices: ['nucleus', 'ribosome', 'mitochondria', 'golgi body'],
        category: 'science',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What is the atomic number of carbon?',
        answer: '6',
        choices: ['4', '6', '8', '12'],
        category: 'science',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What particle has no electric charge?',
        answer: 'neutron',
        choices: ['proton', 'electron', 'neutron', 'positron'],
        category: 'science',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What is the half-life of Carbon-14 in years?',
        answer: '5730',
        choices: ['1000', '5730', '10000', '50000'],
        category: 'science',
        difficulty: 'hard',
        points: 400,
    },
    {
        question: "What is Newton's second law formula?",
        answer: 'f=ma',
        choices: ['e=mc2', 'f=ma', 'v=ir', 'pv=nrt'],
        category: 'science',
        difficulty: 'hard',
        points: 400,
    },
    // ── History ───────────────────────────────────────────────
    {
        question: 'In what year did World War II end?',
        answer: '1945',
        choices: ['1943', '1944', '1945', '1946'],
        category: 'history',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'Who was the first president of the United States?',
        answer: 'george washington',
        choices: ['thomas jefferson', 'john adams', 'george washington', 'abraham lincoln'],
        category: 'history',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'In what year did the Berlin Wall fall?',
        answer: '1989',
        choices: ['1985', '1987', '1989', '1991'],
        category: 'history',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What empire was ruled by Genghis Khan?',
        answer: 'mongol empire',
        choices: ['roman empire', 'ottoman empire', 'mongol empire', 'british empire'],
        category: 'history',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What year did the French Revolution begin?',
        answer: '1789',
        choices: ['1776', '1789', '1804', '1815'],
        category: 'history',
        difficulty: 'hard',
        points: 400,
    },
    // ── Geography ─────────────────────────────────────────────
    {
        question: 'What is the capital of France?',
        answer: 'paris',
        choices: ['london', 'berlin', 'paris', 'madrid'],
        category: 'geography',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'What is the largest continent?',
        answer: 'asia',
        choices: ['africa', 'asia', 'europe', 'north america'],
        category: 'geography',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'Which country has the most natural lakes?',
        answer: 'canada',
        choices: ['russia', 'usa', 'canada', 'brazil'],
        category: 'geography',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What is the longest river in the world?',
        answer: 'nile',
        choices: ['amazon', 'nile', 'yangtze', 'mississippi'],
        category: 'geography',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What is the smallest country in the world?',
        answer: 'vatican city',
        choices: ['monaco', 'san marino', 'vatican city', 'liechtenstein'],
        category: 'geography',
        difficulty: 'hard',
        points: 400,
    },
    // ── Sports ────────────────────────────────────────────────
    {
        question: 'How many players are on a basketball team on the court?',
        answer: '5',
        choices: ['4', '5', '6', '7'],
        category: 'sports',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'How many points is a touchdown worth in American football?',
        answer: '6',
        choices: ['3', '6', '7', '8'],
        category: 'sports',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'In tennis, what term is used for zero points?',
        answer: 'love',
        choices: ['zero', 'nil', 'love', 'none'],
        category: 'sports',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'How many holes are in a standard round of golf?',
        answer: '18',
        choices: ['9', '12', '18', '24'],
        category: 'sports',
        difficulty: 'easy',
        points: 100,
    },
    // ── Entertainment ─────────────────────────────────────────
    {
        question: 'How many strings does a standard guitar have?',
        answer: '6',
        choices: ['4', '5', '6', '7'],
        category: 'entertainment',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'What is the highest-grossing film franchise of all time?',
        answer: 'marvel cinematic universe',
        choices: ['star wars', 'harry potter', 'marvel cinematic universe', 'james bond'],
        category: 'entertainment',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'How many keys does a standard piano have?',
        answer: '88',
        choices: ['76', '84', '88', '92'],
        category: 'entertainment',
        difficulty: 'medium',
        points: 200,
    },
    // ── Technology ────────────────────────────────────────────
    {
        question: 'What does CPU stand for?',
        answer: 'central processing unit',
        choices: [
            'central processing unit',
            'computer power unit',
            'central program utility',
            'core processing unit',
        ],
        category: 'technology',
        difficulty: 'easy',
        points: 100,
    },
    {
        question: 'What does HTTP stand for?',
        answer: 'hypertext transfer protocol',
        choices: [
            'hypertext transfer protocol',
            'hyper transmission text protocol',
            'high transfer text protocol',
            'hypertext transit protocol',
        ],
        category: 'technology',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'In binary, what does 1010 equal in decimal?',
        answer: '10',
        choices: ['8', '9', '10', '12'],
        category: 'technology',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What programming language was created by Brendan Eich in 1995?',
        answer: 'javascript',
        choices: ['java', 'python', 'javascript', 'c++'],
        category: 'technology',
        difficulty: 'medium',
        points: 200,
    },
    {
        question: 'What is the time complexity of binary search?',
        answer: 'o(log n)',
        choices: ['o(1)', 'o(n)', 'o(log n)', 'o(n^2)'],
        category: 'technology',
        difficulty: 'hard',
        points: 400,
    },
];
function getQuestion(opts) {
    let pool = [...exports.TRIVIA_BANK];
    if (opts.category)
        pool = pool.filter((q) => q.category === opts.category);
    if (opts.difficulty)
        pool = pool.filter((q) => q.difficulty === opts.difficulty);
    if (opts.exclude?.length)
        pool = pool.filter((q) => !opts.exclude.includes(q.question));
    if (!pool.length)
        return null;
    return pool[Math.floor(Math.random() * pool.length)];
}
function shuffleChoices(q) {
    return [...q.choices].sort(() => Math.random() - 0.5);
}
//# sourceMappingURL=TriviaData.js.map