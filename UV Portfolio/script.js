// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    }, 50);
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.5)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Add hover effect for clickable elements
const clickables = document.querySelectorAll('a, button, .project-card, .skill-tag, .contact-item');
clickables.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.border = '1px solid var(--primary)';
        follower.style.opacity = '0';
    });
    
    elem.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'var(--primary)';
        cursor.style.border = 'none';
        follower.style.opacity = '1';
    });
});

// Interactive Role Demo Sequence
const demoContainer = document.querySelector('.role-demo-container');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightPython(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
               .replace(/\b(def|return|print)\b/g, '<span class="py-keyword">$1</span>')
               .replace(/\b(build_system)\b/g, '<span class="py-function">$1</span>')
               .replace(/(".+")/g, '<span class="py-string">$1</span>');
}

function highlightHTML(text) {
    let safe = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    safe = safe.replace(/&lt;\/?([a-z0-9]+)/gi, '&lt;<span class="html-tag">$1</span>');
    safe = safe.replace(/([a-z\-]+)=/gi, '<span class="html-attr">$1</span>=');
    safe = safe.replace(/(".+?")/g, '<span class="html-val">$1</span>');
    return safe;
}

async function simulateTyping(box, fullText, type, speed = 30) {
    let current = "";
    for(let i=0; i < fullText.length; i++) {
        current += fullText[i];
        
        let displayHTML = current;
        if(type === 'python') displayHTML = highlightPython(displayHTML);
        if(type === 'html') displayHTML = highlightHTML(displayHTML);
        
        box.innerHTML = displayHTML + '<span class="cursor-blink">|</span>';
        box.scrollTop = box.scrollHeight; // Auto-scroll to bottom
        await sleep(Math.random() * speed + (speed/2));
    }
    box.innerHTML = (type === 'python' ? highlightPython(fullText) : highlightHTML(fullText));
    box.scrollTop = box.scrollHeight; // Ensure it stays at bottom at the very end
}

async function triggerBlast() {
    return new Promise(resolve => {
        if(!demoContainer) return resolve();
        
        const numStrikes = 6;
        const strikeElements = [];
        
        for (let i = 0; i < numStrikes; i++) {
            const strike = document.createElement('div');
            strike.className = 'electric-strike strike-anim';
            
            // Randomize rotation so they shoot out in all directions
            const angle = (360 / numStrikes) * i + (Math.random() * 30 - 15);
            strike.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            
            // Randomize duration between 0.4s and 0.8s for chaotic flickering
            const duration = 0.4 + Math.random() * 0.4;
            strike.style.animationDuration = `${duration}s`;
            
            demoContainer.appendChild(strike);
            strikeElements.push(strike);
        }
        
        // Remove all strikes after max animation time (800ms)
        setTimeout(() => {
            strikeElements.forEach(s => {
                if(s.parentNode) s.remove();
            });
            resolve();
        }, 800);
    });
}

function showFinalText(text) {
    const el = document.createElement('div');
    el.className = 'final-role-text';
    el.innerText = text;
    demoContainer.appendChild(el);
    return el;
}

async function runRoleDemos() {
    if(!demoContainer) return;
    
    // Wait a brief moment before starting
    await sleep(1000);
    
    while(true) {
        // --- PYTHON PHASE ---
        const pyBox = document.createElement('div');
        pyBox.className = 'demo-code-box';
        demoContainer.appendChild(pyBox);
        
        // fade in box
        await sleep(100);
        pyBox.classList.add('active');
        
        const pyScript = "def build_system():\n    return \"Python Developer\"\n\nprint(build_system())";
        await simulateTyping(pyBox, pyScript, 'python', 35);
        
        await sleep(600);
        
        // Blast & Swap
        triggerBlast(); // starts visually immediately
        pyBox.classList.remove('active');
        await sleep(300); // Wait for blast to expand slightly before showing text
        
        const pyText = showFinalText("Python Developer");
        await sleep(3000); // Increased view time
        
        pyText.style.opacity = '0';
        pyText.style.transform = 'scale(1.2)';
        pyText.style.transition = 'all 0.5s';
        await sleep(500);
        if(pyText.parentNode) pyText.remove();
        if(pyBox.parentNode) pyBox.remove();
        
        await sleep(200);
        
        // --- WEB PHASE ---
        const webBox = document.createElement('div');
        webBox.className = 'demo-code-box';
        demoContainer.appendChild(webBox);
        
        await sleep(100);
        webBox.classList.add('active');
        
        const htmlScript = "<html>\n  <style>\n    .vibrant { color: #00E5FF; }\n  </style>\n  <body>\n    <div class=\"vibrant\">Web Dev</div>\n  </body>\n</html>";
        await simulateTyping(webBox, htmlScript, 'html', 30);
        
        await sleep(400);
        webBox.classList.remove('active');
        await sleep(300);
        if(webBox.parentNode) webBox.remove();
        
        // Morph into Web Preview Demo!
        const browser = document.createElement('div');
        browser.className = 'mini-browser';
        browser.innerHTML = `
            <div class="browser-header">
                <div class="browser-dot"></div><div class="browser-dot"></div><div class="browser-dot"></div>
            </div>
            <div class="browser-content">
                <div class="browser-scroll-area">
                    <div class="browser-hero-mock">
                        <div class="pane-circle"></div>
                        <div class="pane-line title"></div>
                        <div class="pane-line short"></div>
                    </div>
                    <div class="browser-grid-mock">
                        <div class="browser-pane"><div class="pane-line"></div><div class="pane-line short"></div></div>
                        <div class="browser-pane"><div class="pane-line"></div><div class="pane-line short"></div></div>
                        <div class="browser-pane"><div class="pane-line"></div><div class="pane-line short"></div></div>
                        <div class="browser-pane"><div class="pane-line"></div><div class="pane-line short"></div></div>
                    </div>
                </div>
            </div>
        `;
        demoContainer.appendChild(browser);
        await sleep(50);
        browser.classList.add('active');
        
        // Let it "build" and animate scroll for 2 seconds
        await sleep(2000);
        
        // Blast & Swap
        triggerBlast();
        browser.classList.remove('active');
        await sleep(300);
        
        const webText = showFinalText("Web Developer");
        await sleep(3000);
        
        webText.style.opacity = '0';
        webText.style.transform = 'scale(1.2)';
        webText.style.transition = 'all 0.5s';
        await sleep(500);
        if(webText.parentNode) webText.remove();
        if(browser.parentNode) browser.remove();
        
        await sleep(300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    runRoleDemos();
});

// Particles JS Configuration (Optimized for Performance)
particlesJS('particles-js', {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ["#FF3366", "#00E5FF", "#FFD700"] },
        shape: { type: "circle" },
        opacity: { value: 0.4, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { grab: { distance: 200, line_linked: { opacity: 0.4 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        let target = document.querySelector(this.getAttribute('href'));
        if(target){
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
