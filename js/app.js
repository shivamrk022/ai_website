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

// 🔥 Send message to Python backend with error handling
async function sendMessageToAI(message) {
    try {
        console.log("📤 Sending to backend:", message);
        
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message })
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);
        
        if (response.ok && data.reply) {
            return data.reply;
        } else {
            return data.reply || "Unable to connect to AI server";
        }

    } catch (error) {
        console.error("❌ Fetch Error:", error);
        return "⚠️ Could not connect to AI server. Make sure the backend is running on http://localhost:5000";
    }
}

// 🔥 UPDATED: Send Chat Message to AI
async function sendChatMessage() {
    var inp = document.getElementById('ai-chat-input');
    var msgs = document.getElementById('ai-chat-messages');
    if (!inp || !msgs) return;

    var text = inp.value.trim();
    if (!text) return;

    addMsg(text, 'user', msgs);
    inp.value = '';

    var dot = addTyping(msgs);
    
    // Get AI response
    let botReply = await sendMessageToAI(text);
    
    // Remove typing indicator
    if (dot && dot.parentNode) dot.parentNode.removeChild(dot);
    
    // Add AI response
    addMsg(botReply || "Sorry, I couldn't generate a response", 'ai', msgs);
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

// ── Wire up events after DOM ready ──
document.addEventListener('DOMContentLoaded', function () {
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

    var sendBtn = document.getElementById('ai-chat-send');
    var chatInp = document.getElementById('ai-chat-input');

    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);

    if (chatInp) chatInp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') sendChatMessage();
    });
});

// Fallback
if (document.readyState !== 'loading') {
    var _s = document.getElementById('ai-chat-send');
    var _i = document.getElementById('ai-chat-input');
    if (_s) _s.onclick = sendChatMessage;
    if (_i) _i.onkeydown = function (e) { if (e.key === 'Enter') sendChatMessage(); };
}