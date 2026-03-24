import fs from 'node:fs';
import path from 'node:path';

const METADATA_DIR = './metadata';
const OUTPUT_DIR = './docs';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Load metadata
const functions = JSON.parse(fs.readFileSync(path.join(METADATA_DIR, 'functions.json'), 'utf8'));
const events = JSON.parse(fs.readFileSync(path.join(METADATA_DIR, 'events.json'), 'utf8'));

// Group functions by category
const categories = [...new Set(functions.map(f => f.category))].sort();
const functionsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = functions.filter(f => f.category === cat).sort((a, b) => a.name.localeCompare(b.name));
    return acc;
}, {});

// Generate common CSS
const css = `
:root {
    --bg-color: #0d1117;
    --sidebar-bg: #161b22;
    --text-color: #c9d1d9;
    --text-muted: #8b949e;
    --accent-color: #58a6ff;
    --accent-glow: rgba(88, 166, 255, 0.15);
    --border-color: #30363d;
    --card-bg: #161b22;
    --hover-bg: #21262d;
    --code-bg: #0d1117;
    --type-color: #ff7b72;
    --arg-color: #ffa657;
    --func-color: #d2a8ff;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    display: flex;
    height: 100vh;
    overflow: hidden;
}

/* Sidebar */
.sidebar {
    width: 280px;
    background-color: var(--sidebar-bg);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0;
    overflow-y: auto;
}

.sidebar-header {
    padding: 0 1.5rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.sidebar-header h1 {
    font-size: 1.25rem;
    color: var(--accent-color);
    margin-bottom: 0.5rem;
}

.search-container {
    padding: 1rem 1.5rem;
}

.search-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-color);
    outline: none;
    transition: border-color 0.2s;
}

.search-input:focus {
    border-color: var(--accent-color);
}

.nav-section {
    padding: 1rem 0;
}

.nav-title {
    padding: 0.5rem 1.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
    letter-spacing: 0.05em;
}

.nav-link {
    display: block;
    padding: 0.4rem 1.5rem;
    color: var(--text-color);
    text-decoration: none;
    font-size: 0.9rem;
    transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
    background: var(--hover-bg);
    color: var(--accent-color);
}

.nav-link.active {
    background: var(--accent-glow);
    color: var(--accent-color);
    border-left: 3px solid var(--accent-color);
}

/* Main Content */
.main-content {
    flex: 1;
    overflow-y: auto;
    padding: 2.5rem;
    scroll-behavior: smooth;
}

.section {
    margin-bottom: 4rem;
}

.section-title {
    font-size: 2rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
    margin-bottom: 2rem;
    color: var(--accent-color);
}

.card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.function-name {
    font-size: 1.5rem;
    font-family: 'JetBrains Mono', monospace;
    color: var(--func-color);
}

.version-badge {
    background: var(--hover-bg);
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    font-size: 0.75rem;
    color: var(--text-muted);
    border: 1px solid var(--border-color);
}

.description {
    margin-bottom: 1.5rem;
    color: var(--text-muted);
}

.params-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-color);
}

.param-row {
    display: flex;
    padding: 0.5rem 0;
    border-top: 1px solid var(--border-color);
    font-size: 0.9rem;
}

.param-name {
    width: 150px;
    color: var(--arg-color);
    font-family: monospace;
}

.param-type {
    width: 100px;
    color: var(--type-color);
}

.param-desc {
    flex: 1;
    color: var(--text-muted);
}

.param-required {
    font-size: 0.7rem;
    color: #f85149;
    background: rgba(248, 81, 73, 0.1);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    margin-left: 0.5rem;
}

.syntax {
    background: var(--code-bg);
    padding: 1rem;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    margin-top: 1rem;
    overflow-x: auto;
    border: 1px solid var(--border-color);
}

.output-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.output-type {
    color: var(--type-color);
    font-family: monospace;
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: var(--bg-color);
}
::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}

@media (max-width: 768px) {
    body {
        flex-direction: column;
    }
    .sidebar {
        width: 100%;
        height: auto;
        max-height: 300px;
    }
    .main-content {
        padding: 1.5rem;
    }
}
`;

function generateFunctionHtml(func) {
    const argsHtml = func.args ? `
        <div class="params-title">Arguments</div>
        <div class="params-list">
            ${func.args.map(arg => `
                <div class="param-row">
                    <div class="param-name">${arg.name}${arg.required ? '<span class="param-required">required</span>' : ''}</div>
                    <div class="param-type">${arg.type}</div>
                    <div class="param-desc">${arg.description}</div>
                </div>
            `).join('')}
        </div>
    ` : '';

    const syntax = `${func.name}${func.brackets ? '[' : ''}${func.args ? func.args.map(a => a.name).join(';') : ''}${func.brackets ? ']' : ''}`;

    return `
        <div class="card" id="${func.name}">
            <div class="card-header">
                <div class="function-name">${func.name}</div>
                <div class="version-badge">v${func.version}</div>
            </div>
            <div class="description">${func.description}</div>
            <div class="syntax">
                ${syntax}
            </div>
            ${argsHtml}
            ${func.output ? `
                <div class="output-info">
                    Returns: <span class="output-type">${func.output.join(' | ')}</span>
                </div>
            ` : ''}
        </div>
    `;
}

function generateEventHtml(event) {
    return `
        <div class="card" id="event-${event.name}">
            <div class="card-header">
                <div class="function-name" style="color: var(--accent-color)">on(${event.name})</div>
                <div class="version-badge">v${event.version}</div>
            </div>
            <div class="description">${event.description}</div>
        </div>
    `;
}

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ForgeGames Documentation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h1>ForgeGames</h1>
            <p style="font-size: 0.8rem; color: var(--text-muted)">Documentation v1.0.0</p>
        </div>
        
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search functions..." onkeyup="search(this.value)">
        </div>

        <nav>
            <div class="nav-section">
                <div class="nav-title">Events</div>
                ${events.map(e => `<a href="#event-${e.name}" class="nav-link">${e.name}</a>`).join('')}
            </div>

            ${categories.map(cat => `
                <div class="nav-section">
                    <div class="nav-title">${cat}</div>
                    ${functionsByCategory[cat].map(f => `<a href="#${f.name}" class="nav-link">${f.name}</a>`).join('')}
                </div>
            `).join('')}
        </nav>
    </div>

    <div class="main-content">
        <div class="section">
            <h2 class="section-title">Events</h2>
            ${events.map(e => generateEventHtml(e)).join('')}
        </div>

        ${categories.map(cat => `
            <div class="section">
                <h2 class="section-title">${cat.charAt(0).toUpperCase() + cat.slice(1)} Functions</h2>
                ${functionsByCategory[cat].map(f => generateFunctionHtml(f)).join('')}
            </div>
        `).join('')}
    </div>

    <script>
        function search(query) {
            query = query.toLowerCase();
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const name = card.querySelector('.function-name').innerText.toLowerCase();
                const desc = card.querySelector('.description').innerText.toLowerCase();
                if (name.includes(query) || desc.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Simple active link highlight
        window.addEventListener('hashchange', () => {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === window.location.hash);
            });
        });
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
console.log('Documentation generated successfully in ./docs/index.html');
