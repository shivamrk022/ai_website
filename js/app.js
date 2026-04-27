// ============================================================
// SHIVAM AI AUTOMATION — Main JavaScript
// ============================================================

// ── Apply saved theme on load ──
(function () {
    var saved = '';
    try { saved = localStorage.getItem('siteTheme') || ''; } catch (e) {}
    var theme = saved || document.documentElement.getAttribute('data-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var icon = document.getElementById('theme-icon');
    if (icon) icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
})();

// ── Theme Toggle ──
function toggleTheme() {
    var html = document.documentElement;
    var icon = document.getElementById('theme-icon');
    var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('siteTheme', next); } catch (e) {}
    if (icon) icon.className = next === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ── Dashboard Toggle ──
function toggleDashboard(show) {
    var dash = document.getElementById('dashboard');
    dash.style.display = show ? 'block' : 'none';
    document.body.style.overflow = show ? 'hidden' : 'auto';
    if (show) dash.style.animation = 'fadeIn 0.5s ease-out';
}

// ── FAQ Accordion ──
function toggleFaq(btn) {
    var content = btn.nextElementSibling;
    var plus = btn.querySelector('span:last-child');
    var isOpen = content.style.display === 'block';
    content.style.display = isOpen ? 'none' : 'block';
    plus.textContent = isOpen ? '+' : '−';
    plus.style.color = isOpen ? 'var(--primary-blue)' : '#ef4444';
}

// ── AI Chatbot ──
var _chatOpen = false;

function toggleChat() {
    var win = document.getElementById('ai-chat-window');
    if (!win) return;
    _chatOpen = !_chatOpen;
    if (_chatOpen) {
        win.style.display = 'flex';
        win.style.flexDirection = 'column';
        win.style.animation = 'slideUp 0.3s ease';
        var inp = document.getElementById('ai-chat-input');
        if (inp) inp.focus();
    } else {
        win.style.display = 'none';
    }
}

function sendChatMessage() {
    var inp = document.getElementById('ai-chat-input');
    var msgs = document.getElementById('ai-chat-messages');
    if (!inp || !msgs) return;
    var text = inp.value.trim();
    if (!text) return;
    addMsg(text, 'user', msgs);
    inp.value = '';
    var dot = addTyping(msgs);
    setTimeout(function () {
        if (dot && dot.parentNode) dot.parentNode.removeChild(dot);
        addMsg(getBotReply(text), 'ai', msgs);
    }, 800 + Math.random() * 700);
}

function addMsg(text, role, msgs) {
    var d = document.createElement('div');
    d.className = role === 'user' ? 'user-msg' : 'ai-msg';
    d.innerHTML = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
}

function addTyping(msgs) {
    var d = document.createElement('div');
    d.className = 'typing-indicator';
    d.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
}

function getBotReply(msg) {
    var q = msg.toLowerCase();
    if (/plc|programmable|logic controller/.test(q))
        return '🔧 We specialise in <strong>custom PLC programming</strong> — covering Siemens, Allen-Bradley, Mitsubishi & more. Want a free consultation?';
    if (/robot|robotic/.test(q))
        return '🤖 Our <strong>Robotic Process Automation</strong> service handles pick-and-place, welding, assembly, and more end-to-end.';
    if (/smart factory|iot|industry 4/.test(q))
        return '🏭 We integrate <strong>IoT & Smart Factory</strong> solutions — connecting machines, sensors and data into one unified dashboard.';
    if (/price|cost|quote|pricing/.test(q))
        return '💰 Pricing depends on project scope. Fill our <strong>contact form</strong> below or WhatsApp us for a free estimate!';
    if (/contact|email|phone|whatsapp|reach/.test(q))
        return '📬 Reach us at <strong>contact@shivam-ai.com</strong> or WhatsApp <strong>+91 97025 15105</strong>.';
    if (/time|duration|long|week|implement/.test(q))
        return '⏱️ Implementation typically takes <strong>4 to 12 weeks</strong> depending on project complexity.';
    if (/hello|hi|hey|morning|afternoon/.test(q))
        return '👋 Hey there! How can I help you with <strong>industrial automation</strong> today?';
    if (/thank|thanks/.test(q))
        return "😊 You're welcome! Feel free to ask anything else.";
    if (/service|offer|provide|solution/.test(q))
        return '🛠️ We offer:<br>• <strong>PLC Programming</strong><br>• <strong>Robotic Automation</strong><br>• <strong>Smart Factory / IoT</strong><br>• <strong>AI Vision Systems</strong>';
    if (/automation/.test(q))
        return '⚙️ We deliver end-to-end <strong>industrial automation</strong> solutions tailored to your production line. Want to know more?';
    return '🤔 Great question! Please <strong>contact our team</strong> via the form below or WhatsApp us — we respond within a few hours.';
}

// ── Wire up events after DOM ready ──
document.addEventListener('DOMContentLoaded', function () {
    // Contact form
    var form = document.getElementById('contactForm');
    if (form) {
        form.onsubmit = function (e) {
            e.preventDefault();
            var btn = e.target.querySelector('button');
            btn.textContent = 'REQUEST SENT!';
            btn.style.background = '#10b981';
            setTimeout(function () {
                btn.textContent = 'SEND REQUEST';
                btn.style.background = '';
                e.target.reset();
            }, 3000);
        };
    }

    // Chat send button & Enter key
    var sendBtn = document.getElementById('ai-chat-send');
    var chatInp = document.getElementById('ai-chat-input');
    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
    if (chatInp) chatInp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') sendChatMessage();
    });
});

// Fallback: wire immediately if DOM already ready
if (document.readyState !== 'loading') {
    var _s = document.getElementById('ai-chat-send');
    var _i = document.getElementById('ai-chat-input');
    if (_s) _s.onclick = sendChatMessage;
    if (_i) _i.onkeydown = function (e) { if (e.key === 'Enter') sendChatMessage(); };
}
