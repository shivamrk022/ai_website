// ============================================================
// SHIVAM AI AUTOMATION — Main JavaScript (UPDATED)
// ============================================================

// ── Apply saved theme and Check Auth Gate ──
(function () {
    // Global Auth Gate removed for public landing page
    const isLoggedIn = localStorage.getItem('userName');

    // 2. Theme Logic
    var saved = '';
    try { saved = localStorage.getItem('siteTheme') || ''; } catch (e) { }
    var theme = saved || document.documentElement.getAttribute('data-theme') || 'dark'; // Default to dark
    document.documentElement.setAttribute('data-theme', theme);
})();

// ── Theme Toggle (Updated for Slide Switch) ──
function toggleTheme() {
    var html = document.documentElement;
    var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('siteTheme', next); } catch (e) { }
    
    // Update Slide Toggle UI if it exists
    var slide = document.getElementById('theme-slide-toggle');
    if (slide) slide.checked = (next === 'dark');
}

// ── Dashboard Toggle ──
function toggleDashboard(show) {
    // PROTECTED FEATURE: Only allow if logged in
    if (show && !localStorage.getItem('userName')) {
        alert("Please Sign Up to access the AI Control Dashboard.");
        window.location.href = 'signup.html?mode=signup';
        return;
    }
    
    var dash = document.getElementById('dashboard');
    if (!dash) return;
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
let isSending = false; // 🔥 prevents multiple API calls

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
    if (isSending) return; // 🚫 stop spam
    isSending = true;

    var inp = document.getElementById('ai-chat-input');
    var msgs = document.getElementById('ai-chat-messages');

    if (!inp || !msgs) {
        isSending = false;
        return;
    }

    var text = inp.value.trim();
    if (!text) {
        isSending = false;
        return;
    }

    addMsg(text, 'user', msgs);
    inp.value = '';

    var dot = addTyping(msgs);

    var baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:5000';
    fetch(baseUrl + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (dot && dot.parentNode) dot.parentNode.removeChild(dot);
            addMsg(data.reply || "⚠️ No response", 'ai', msgs);
        })
        .catch(function (err) {
            if (dot && dot.parentNode) dot.parentNode.removeChild(dot);
            addMsg("⚠️ Server error. Try again.", 'ai', msgs);
        })
        .finally(function () {
            isSending = false; // ✅ allow next request
        });
}

function addMsg(text, role, msgs) {
    var d = document.createElement('div');
    d.className = role === 'user' ? 'user-msg' : 'ai-msg';
    
    // 🖼️ Simple Markdown-to-Image converter
    let formattedText = text;
    if (role === 'ai') {
        // Convert ![Alt](path) to <img src="path" class="chat-img">
        formattedText = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="chat-img" onclick="window.open(this.src)">');
        
        // Convert newlines to <br> for better spacing
        formattedText = formattedText.replace(/\n/g, '<br>');
    }

    d.innerHTML = formattedText;
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

// ── Page Loader ──
window.addEventListener('load', function () {
    var loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(function () { loader.classList.add('hidden'); }, 600);
        setTimeout(function () { loader.style.display = 'none'; }, 1200);
    }
});

// ── Scroll Reveal Animations ──
function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { observer.observe(el); });
}

// ── Stats Counter Animation ──
function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-target'));
                var duration = 2000;
                var startTime = null;
Loop:
                function animate(time) {
                    if (!startTime) startTime = time;
                    var progress = Math.min((time - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target) + '+';
                    if (progress < 1) requestAnimationFrame(animate);
                }

                requestAnimationFrame(animate);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
}

// ── Advanced Scroll Progress ──
window.addEventListener('scroll', function() {
    const scrollBar = document.getElementById('scrollBar');
    if (scrollBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + "%";
    }
});

// ── Active Nav Link ──
function initActiveNav() {
    var sections = document.querySelectorAll('section[id], header[id]');
    var navLinks = document.querySelectorAll('.nav-links > a');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(function (s) { observer.observe(s); });
}

// ── Back to Top ──
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Hamburger Menu ──
function initHamburger() {
    var btn = document.getElementById('hamburgerBtn');
    var nav = document.getElementById('navLinks');

    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
        btn.classList.toggle('active');
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            btn.classList.remove('active');
            nav.classList.remove('open');
        });
    });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function () {
    var sendBtn = document.getElementById('ai-chat-send');
    var chatInp = document.getElementById('ai-chat-input');

    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);

    if (chatInp) {
        chatInp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    initReveal();
    initCounters();
    initActiveNav();
    initBackToTop();
    initHamburger();

    // ── Sign Up Button Redirect ──
    var signupBtn = document.getElementById('nav-signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    }

    // Handle Change Password Form
    const changePassForm = document.getElementById('change-pass-form');
    if (changePassForm) {
        changePassForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const oldPassword = document.getElementById('current-pass').value;
            const newPassword = document.getElementById('new-pass').value;
            const email = localStorage.getItem('userEmail');
            const submitBtn = changePassForm.querySelector('button');

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            submitBtn.disabled = true;

            const baseUrlPw = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:5000';
            fetch(baseUrlPw + '/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, oldPassword, newPassword })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Password updated successfully!');
                    changePassForm.reset();
                    closeSettings();
                } else {
                    alert(data.message || 'Failed to update password');
                }
            })
            .catch(err => alert('Error connecting to backend'))
            .finally(() => {
                submitBtn.innerHTML = 'Update Password';
                submitBtn.disabled = false;
            });
        });
    }
    // Handle Profile Picture Upload with Cropper.js
    let cropper = null;
    const profilePicInput = document.getElementById('profile-pic-input');
    const cropModal = document.getElementById('crop-modal');
    const cropImage = document.getElementById('crop-image');
    const btnCropUpload = document.getElementById('btn-crop-upload');

    window.closeCropModal = function() {
        if (cropModal) cropModal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        if (profilePicInput) profilePicInput.value = '';
    };

    if (profilePicInput) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Load image into cropper
            const reader = new FileReader();
            reader.onload = function(event) {
                cropImage.src = event.target.result;
                cropModal.style.display = 'flex';

                if (cropper) {
                    cropper.destroy();
                }

                cropper = new Cropper(cropImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 1,
                    restore: false,
                    guides: false,
                    center: false,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                });
            };
            reader.readAsDataURL(file);
        });
    }

    if (btnCropUpload) {
        btnCropUpload.addEventListener('click', function() {
            if (!cropper) return;

            const email = localStorage.getItem('userEmail');
            if (!email) {
                alert('User email not found. Please log in again.');
                return;
            }

            btnCropUpload.innerText = 'Uploading...';
            btnCropUpload.disabled = true;

            cropper.getCroppedCanvas({
                width: 400,
                height: 400
            }).toBlob(function(blob) {
                const formData = new FormData();
                formData.append('file', blob, 'profile.jpg');
                formData.append('email', email);
                const baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:5000';
                fetch(baseUrl + '/upload-profile-picture', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.profile_pic) {
                        localStorage.setItem('userProfilePic', data.profile_pic);
                        checkAuth();
                        if (typeof updateDashUserInfo === 'function') updateDashUserInfo();
                        closeCropModal();
                        
                        const statusEl = document.getElementById('profile-pic-upload-status');
                        if (statusEl) {
                            statusEl.style.display = 'block';
                            statusEl.innerText = 'Upload successful!';
                            setTimeout(() => statusEl.style.display = 'none', 3000);
                        }
                    } else {
                        alert(data.message || 'Upload failed');
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Error connecting to server for upload.');
                })
                .finally(() => {
                    btnCropUpload.innerText = 'Crop & Upload';
                    btnCropUpload.disabled = false;
                });
            }, 'image/jpeg');
        });
    }

    // Image Viewer Modal Logic
    window.openImageView = function(url) {
        const modal = document.getElementById('image-view-modal');
        const fullImg = document.getElementById('full-size-image');
        if (modal && fullImg && url) {
            fullImg.src = url;
            modal.style.display = 'flex';
        }
    };

    window.closeImageView = function() {
        const modal = document.getElementById('image-view-modal');
        if (modal) modal.style.display = 'none';
    };

    window.removeProfilePicture = function() {
        const email = localStorage.getItem('userEmail');
        if (!email) return;

        if (confirm("Are you sure you want to remove your profile picture?")) {
            const btnRemove = document.getElementById('btn-remove-profile-pic');
            if (btnRemove) {
                btnRemove.innerText = 'Removing...';
                btnRemove.disabled = true;
            }
            const baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:5000';
            fetch(baseUrl + '/remove-profile-picture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem('userProfilePic');
                    checkAuth();
                    if (typeof updateDashUserInfo === 'function') updateDashUserInfo();
                } else {
                    alert(data.message || 'Failed to remove picture.');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Connection error.');
            })
            .finally(() => {
                if (btnRemove) {
                    btnRemove.innerHTML = '<i class="fas fa-trash"></i> Remove';
                    btnRemove.disabled = false;
                }
            });
        }
    };

    checkAuth();
});

// ── Session Management ──
function checkAuth() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userProfilePic = localStorage.getItem('userProfilePic');
    const signupBtn = document.getElementById('nav-signup-btn');
    const userProfile = document.getElementById('user-profile');
    const userDisplayName = document.getElementById('user-display-name');
    const menuUserName = document.getElementById('menu-user-name');
    const menuUserEmail = document.getElementById('menu-user-email');
    const userInitial = document.getElementById('user-initial');
    const navProfileImg = document.getElementById('nav-profile-img');
    
    // Settings displays
    const settingsName = document.getElementById('settings-name-display');
    const settingsEmail = document.getElementById('settings-email-display');
    const settingsProfileImg = document.getElementById('settings-profile-img');
    const settingsProfileInitial = document.getElementById('settings-profile-initial');

    if (userName && userProfile && signupBtn) {
        signupBtn.style.display = 'none';
        userProfile.style.display = 'block';
        userDisplayName.innerText = userName;
        
        if (menuUserName) menuUserName.innerText = userName;
        if (menuUserEmail) menuUserEmail.innerText = userEmail || 'user@example.com';
        
        // Handle profile picture or initial
        const initialStr = userName.charAt(0).toUpperCase();
        const btnRemoveProfilePic = document.getElementById('btn-remove-profile-pic');
        
        if (userProfilePic && userProfilePic !== 'undefined' && userProfilePic !== 'null') {
            if (userInitial) userInitial.style.display = 'none';
            if (navProfileImg) {
                navProfileImg.src = userProfilePic;
                navProfileImg.style.display = 'block';
            }
            if (settingsProfileInitial) settingsProfileInitial.style.display = 'none';
            if (settingsProfileImg) {
                settingsProfileImg.src = userProfilePic;
                settingsProfileImg.style.display = 'block';
            }
            if (btnRemoveProfilePic) btnRemoveProfilePic.style.display = 'inline-block';
        } else {
            if (userInitial) {
                userInitial.innerText = initialStr;
                userInitial.style.display = 'block';
            }
            if (navProfileImg) navProfileImg.style.display = 'none';
            
            if (settingsProfileInitial) {
                settingsProfileInitial.innerText = initialStr;
                settingsProfileInitial.style.display = 'block';
            }
            if (settingsProfileImg) settingsProfileImg.style.display = 'none';
            if (btnRemoveProfilePic) btnRemoveProfilePic.style.display = 'none';
        }

        // Update settings modal displays
        if (settingsName) settingsName.innerText = userName;
        if (settingsEmail) settingsEmail.innerText = userEmail || 'user@example.com';
    }
}

// ── Settings Logic ──
function openSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'flex';
        toggleProfileMenu(); // Close the profile menu
        
        // Initialize the Slide Toggle state
        const slide = document.getElementById('theme-slide-toggle');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (slide) slide.checked = (currentTheme === 'dark');
    }
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'none';
}

function showSettingsTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.settings-tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById('settings-' + tabName).style.display = 'block';
    document.getElementById('tab-' + tabName).classList.add('active');
}


function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu');
    const dropdown = document.querySelector('.profile-dropdown');
    if (menu) {
        menu.classList.toggle('show');
        dropdown.classList.toggle('active');
    }
}

// Close dropdown when clicking outside
window.addEventListener('click', function(e) {
    const menu = document.getElementById('profile-menu');
    const dropdown = document.querySelector('.profile-dropdown');
    if (menu && !dropdown.contains(e.target)) {
        menu.classList.remove('show');
        dropdown.classList.remove('active');
    }
});

// ── Dashboard Controller ──
function toggleDashboard(show) {
    const dash = document.getElementById('dashboard');
    if (dash) {
        dash.style.display = show ? 'block' : 'none';
        if (show) {
            document.body.style.overflow = 'hidden';
            updateDashUserInfo();
            showDashView('monitor'); // Default view
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

function showDashView(viewId) {
    // Hide all views
    document.querySelectorAll('.dash-view').forEach(v => v.style.display = 'none');
    // Show selected view
    document.getElementById('view-' + viewId).style.display = 'block';
    
    // Update Sidebar active state
    document.querySelectorAll('.dash-nav a').forEach(a => a.classList.remove('active'));
    // Find the link by text match or data attribute (adding simpler text match here)
    const title = viewId.charAt(0).toUpperCase() + viewId.slice(1);
    document.getElementById('dash-view-title').innerText = title + ' Overview';
}

function updateDashUserInfo() {
    const name = localStorage.getItem('userName') || "Engineer";
    const userProfilePic = localStorage.getItem('userProfilePic');
    const nameEl = document.getElementById('dash-user-name');
    const dashAvatarIcon = document.getElementById('dash-avatar-icon');
    const dashProfileImg = document.getElementById('dash-profile-img');

    if (nameEl) nameEl.innerText = name;
    
    if (userProfilePic && userProfilePic !== 'undefined' && userProfilePic !== 'null') {
        if (dashAvatarIcon) dashAvatarIcon.style.display = 'none';
        if (dashProfileImg) {
            dashProfileImg.src = userProfilePic;
            dashProfileImg.style.display = 'block';
        }
    } else {
        if (dashAvatarIcon) dashAvatarIcon.style.display = 'block';
        if (dashProfileImg) dashProfileImg.style.display = 'none';
    }
}

function clearLogs() {
    const container = document.getElementById('dash-logs');
    if (container) container.innerHTML = '<div class="log-entry"><span class="time">[' + new Date().toLocaleTimeString([], {hour12:false}) + ']</span> Log cleared by user.</div>';
}

// ── Dashboard Live Simulation ──
function initDashSimulation() {
    const logContainer = document.getElementById('dash-logs');
    if (!logContainer) return;
    const logs = ["Analyzing kinematic sync...", "Neural nodes responding: 1284/1284", "Optimizing power distribution...", "Swarm logic stabilized.", "Detecting sub-millimeter defects...", "Safety protocol active.", "Data relay synced with Global Core.", "AI temperature within parameters."];
    
    setInterval(() => {
        const dash = document.getElementById('dashboard');
        if (dash && dash.style.display === 'block') {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            const time = new Date().toLocaleTimeString([], { hour12: false });
            const msg = logs[Math.floor(Math.random() * logs.length)];
            entry.innerHTML = `<span class="time">[${time}]</span> ${msg}`;
            logContainer.prepend(entry);
            if (logContainer.children.length > 50) logContainer.removeChild(logContainer.lastChild);

            // Update mini stats
            updateMiniStats();
        }
    }, 3000);
}

function updateMiniStats() {
    const power = (4.0 + Math.random() * 0.5).toFixed(1) + " PetaFLOPS";
    const nodes = (1280 + Math.floor(Math.random() * 10));
    const latency = (2.0 + Math.random() * 1.0).toFixed(1) + "ms";
    
    if (document.getElementById('stat-power')) document.getElementById('stat-power').innerText = power;
    if (document.getElementById('stat-nodes')) document.getElementById('stat-nodes').innerText = nodes;
    if (document.getElementById('stat-latency')) document.getElementById('stat-latency').innerText = latency;
}

function logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfilePic');
    window.location.reload();
}