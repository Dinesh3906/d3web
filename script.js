// Global variables
let currentSlide = 1;
const totalSlides = 9;
let isTransitioning = false;
let presentationStarted = false;

// Initialize the presentation
document.addEventListener('DOMContentLoaded', function() {
    initializeStartupScreen();
    addKeyboardControls();
    startBackgroundAnimations();
    initializeCounters();
    addVHSTransitionEffect();
});

function initializeStartupScreen() {
    // Create startup particles
    createStartupParticles();
    
    // Add startup screen event listeners
    const startupScreen = document.querySelector('.startup-screen');
    const presentationContainer = document.querySelector('.presentation-container');
    
    if (startupScreen && presentationContainer) {
        // Initially hide presentation container
        presentationContainer.style.display = 'none';
    }
}

function startPresentation() {
    const startupScreen = document.querySelector('.startup-screen');
    const presentationContainer = document.querySelector('.presentation-container');
    
    if (startupScreen && presentationContainer) {
        // Play startup sound
        playRetroSound('start');
        
        // Hide startup screen with animation
        startupScreen.classList.add('hidden');
        
        setTimeout(() => {
            startupScreen.style.display = 'none';
            presentationContainer.style.display = 'block';
            
            // Trigger presentation fade in
            setTimeout(() => {
                presentationContainer.classList.add('active');
                presentationStarted = true;
                initializePresentation();
            }, 100);
        }, 1000);
    }
}

function goFullscreen() {
    playRetroSound('fullscreen');
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            // Auto-start presentation after going fullscreen
            setTimeout(() => {
                startPresentation();
            }, 500);
        }).catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
            // Start presentation anyway if fullscreen fails
            startPresentation();
        });
    }
}

function createStartupParticles() {
    const particleContainer = document.querySelector('.startup-particles');
    if (!particleContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: ${['#ff00ff', '#00ffff', '#ffff00'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            pointer-events: none;
            opacity: ${0.3 + Math.random() * 0.7};
            animation: startup-float ${3 + Math.random() * 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        particleContainer.appendChild(particle);
    }
    
    // Add CSS for startup particle animations
    if (!document.querySelector('#startup-particle-styles')) {
        const style = document.createElement('style');
        style.id = 'startup-particle-styles';
        style.textContent = `
            @keyframes startup-float {
                0% { transform: translateY(0) rotate(0deg) scale(1); }
                25% { transform: translateY(-30px) rotate(90deg) scale(1.2); }
                50% { transform: translateY(0) rotate(180deg) scale(0.8); }
                75% { transform: translateY(30px) rotate(270deg) scale(1.1); }
                100% { transform: translateY(0) rotate(360deg) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializePresentation() {
    updateSlideIndicator();
    updateProgressBar();
    
    // Add entrance animation to first slide
    setTimeout(() => {
        const firstSlide = document.querySelector('#slide-1');
        if (firstSlide) {
            firstSlide.classList.add('entrance-active');
        }
    }, 500);
}

function nextSlide() {
    if (isTransitioning) return;
    
    if (currentSlide < totalSlides) {
        changeSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (isTransitioning) return;
    
    if (currentSlide > 1) {
        changeSlide(currentSlide - 1);
    }
}

function changeSlide(newSlideNumber) {
    if (isTransitioning || newSlideNumber === currentSlide) return;
    
    isTransitioning = true;
    
    // Trigger VHS static effect
    triggerVHSStatic();
    
    setTimeout(() => {
        const currentSlideElement = document.querySelector(`#slide-${currentSlide}`);
        const newSlideElement = document.querySelector(`#slide-${newSlideNumber}`);
        
        // Remove active class from current slide
        currentSlideElement.classList.remove('active');
        currentSlideElement.classList.add('prev');
        
        // Add active class to new slide
        newSlideElement.classList.add('active');
        newSlideElement.classList.remove('prev');
        
        // Update current slide number
        currentSlide = newSlideNumber;
        
        // Update UI elements
        updateSlideIndicator();
        updateProgressBar();
        
        // Trigger slide-specific animations
        triggerSlideAnimations(newSlideNumber);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }, 150);
}

function updateSlideIndicator() {
    const indicator = document.querySelector('.current-slide');
    if (indicator) {
        indicator.textContent = currentSlide;
    }
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progressPercentage = (currentSlide / totalSlides) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
}

function triggerVHSStatic() {
    // Create VHS static overlay if it doesn't exist
    let vhsStatic = document.querySelector('.vhs-transition');
    if (!vhsStatic) {
        vhsStatic = document.createElement('div');
        vhsStatic.className = 'vhs-transition';
        document.body.appendChild(vhsStatic);
    }
    
    vhsStatic.classList.add('active');
    setTimeout(() => {
        vhsStatic.classList.remove('active');
    }, 300);
}

function triggerSlideAnimations(slideNumber) {
    const slide = document.querySelector(`#slide-${slideNumber}`);
    
    switch(slideNumber) {
        case 1:
            animateTitleSlide();
            break;
        case 2:
            animateIntroSlide();
            break;
        case 3:
        case 4:
            animateEventCards(slide);
            break;
        case 5:
            animateTimeline();
            break;
        case 6:
            animateStatistics();
            break;
        case 7:
            animateSponsors();
            break;
        case 8:
            animateContactSlide();
            break;
        case 9:
            animateClosingSlide();
            break;
    }
}

function animateTitleSlide() {
    const equalizer = document.querySelector('.equalizer');
    if (equalizer) {
        equalizer.style.animation = 'none';
        setTimeout(() => {
            equalizer.style.animation = '';
        }, 10);
    }
}

function animateIntroSlide() {
    const cassette = document.querySelector('.cassette-icon');
    const rewindText = document.querySelector('.rewind-text');
    const fastForwardText = document.querySelector('.fast-forward-text');
    
    if (cassette) {
        cassette.style.animation = 'none';
        setTimeout(() => {
            cassette.style.animation = 'cassette-spin 3s linear infinite';
        }, 100);
    }
    
    // Animate theme text with delay
    setTimeout(() => {
        if (rewindText) rewindText.style.animation = 'rewind-effect 2s infinite';
    }, 500);
    
    setTimeout(() => {
        if (fastForwardText) fastForwardText.style.animation = 'fast-forward-effect 2s infinite';
    }, 800);
}

function animateEventCards(slide) {
    const cards = slide.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.style.animation = `card-pop-in 0.6s ease-out forwards`;
        }, index * 200);
    });
}

function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            item.style.animation = 'timeline-slide-in 0.8s ease-out forwards';
        }, index * 200);
    });
}

function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((statElement, index) => {
        const target = parseInt(statElement.getAttribute('data-target'));
        const isPrice = statElement.textContent.includes('₹');
        const hasPlus = statElement.textContent.includes('+');
        
        setTimeout(() => {
            animateCounter(statElement, target, isPrice, hasPlus);
        }, index * 300);
    });
}

function animateCounter(element, target, isPrice = false, hasPlus = false) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        
        if (isPrice) {
            displayValue = `₹${displayValue.toLocaleString()}`;
        } else if (hasPlus && current >= target) {
            displayValue = `${displayValue}+`;
        }
        
        element.textContent = displayValue;
        
        // Add glitch effect at milestones
        if (current >= target * 0.5 && current < target * 0.6) {
            element.style.animation = 'glitch-1 0.1s';
            setTimeout(() => {
                element.style.animation = '';
            }, 100);
        }
    }, stepTime);
}

function animateSponsors() {
    const stickers = document.querySelectorAll('.sponsor-sticker');
    stickers.forEach((sticker, index) => {
        sticker.style.opacity = '0';
        sticker.style.transform = 'scale(0.5) rotate(0deg)';
        
        setTimeout(() => {
            sticker.style.opacity = '1';
            sticker.style.transform = `scale(1) rotate(${index % 2 === 0 ? '-2deg' : '2deg'})`;
            sticker.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, index * 150);
    });
}

function animateContactSlide() {
    const tvFrame = document.querySelector('.tv-frame');
    const contacts = document.querySelectorAll('.contact-item');
    
    if (tvFrame) {
        tvFrame.style.transform = 'scale(0.8)';
        tvFrame.style.opacity = '0.5';
        
        setTimeout(() => {
            tvFrame.style.transform = 'scale(1)';
            tvFrame.style.opacity = '1';
            tvFrame.style.transition = 'all 0.8s ease-out';
        }, 200);
    }
    
    contacts.forEach((contact, index) => {
        contact.style.opacity = '0';
        contact.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            contact.style.opacity = '1';
            contact.style.transform = 'translateY(0)';
            contact.style.transition = 'all 0.5s ease-out';
        }, 500 + (index * 200));
    });
}

function animateClosingSlide() {
    const words = document.querySelectorAll('.word');
    const subtitle = document.querySelector('.closing-subtitle');
    
    words.forEach((word, index) => {
        word.style.opacity = '0';
        word.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            word.style.opacity = '1';
            word.style.transform = 'scale(1)';
            word.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, index * 400);
    });
    
    setTimeout(() => {
        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
                subtitle.style.transition = 'all 0.8s ease-out';
            }, 100);
        }
    }, 1200);
}

function addKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        // If presentation hasn't started yet, allow Enter or Space to start it
        if (!presentationStarted) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                startPresentation();
                return;
            }
            if (e.key === 'F11' || e.key === 'f') {
                e.preventDefault();
                goFullscreen();
                return;
            }
        }
        
        // Only handle slide navigation if presentation has started
        if (presentationStarted) {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    changeSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    changeSlide(totalSlides);
                    break;
                case 'Escape':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
            }
        }
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function startBackgroundAnimations() {
    // Create floating particles for ambiance
    createFloatingParticles();
    
    // Start matrix rain for closing slide
    createMatrixRain();
    
    // Add random glitch effects
    setInterval(randomGlitch, 10000);
}

function createFloatingParticles() {
    const particleCount = 20;
    const container = document.querySelector('.presentation-container');
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: ${['#ff00ff', '#00ffff', '#ffff00'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
            opacity: 0.6;
            animation: float-${Math.floor(Math.random() * 3)} ${5 + Math.random() * 5}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
    }
    
    // Add CSS for floating animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-0 {
            0% { transform: translateY(0) translateX(0) rotate(0deg); }
            33% { transform: translateY(-20px) translateX(10px) rotate(120deg); }
            66% { transform: translateY(20px) translateX(-10px) rotate(240deg); }
            100% { transform: translateY(0) translateX(0) rotate(360deg); }
        }
        
        @keyframes float-1 {
            0% { transform: translateX(0) translateY(0) scale(0.5); }
            50% { transform: translateX(30px) translateY(-30px) scale(1); }
            100% { transform: translateX(0) translateY(0) scale(0.5); }
        }
        
        @keyframes float-2 {
            0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
    `;
    document.head.appendChild(style);
}

function createMatrixRain() {
    const matrixSlide = document.querySelector('#slide-9 .matrix-rain');
    if (!matrixSlide) return;
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            top: -100%;
            left: ${i * 20}px;
            color: #00ff00;
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
            animation: matrix-drop ${2 + Math.random() * 3}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
            text-shadow: 0 0 5px #00ff00;
            pointer-events: none;
            z-index: 2;
        `;
        
        // Add random characters
        for (let j = 0; j < 20; j++) {
            const char = document.createElement('div');
            char.textContent = characters[Math.floor(Math.random() * characters.length)];
            char.style.cssText = `
                opacity: ${Math.random()};
                animation: char-flicker ${0.5 + Math.random()}s infinite;
            `;
            column.appendChild(char);
        }
        
        matrixSlide.appendChild(column);
    }
    
    // Add matrix drop animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-drop {
            to { transform: translateY(100vh); }
        }
        
        @keyframes char-flicker {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function randomGlitch() {
    const glitchElements = document.querySelectorAll('.glitch, .neon-text, .arcade-font');
    const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
    
    if (randomElement && Math.random() < 0.3) {
        randomElement.style.animation = 'glitch-intense 0.2s';
        setTimeout(() => {
            randomElement.style.animation = '';
        }, 200);
    }
}

function initializeCounters() {
    // Pre-load counter animation for statistics slide
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.textContent = '0';
    });
}

function addVHSTransitionEffect() {
    // Create the VHS transition element
    const vhsTransition = document.createElement('div');
    vhsTransition.className = 'vhs-transition';
    document.body.appendChild(vhsTransition);
}

// Add mouse move parallax effect
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    // Apply subtle parallax to background elements
    const gridBgs = document.querySelectorAll('.grid-bg');
    gridBgs.forEach(bg => {
        bg.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    });
    
    // Apply parallax to floating particles
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 10;
        particle.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
});

// Auto-advance presentation (optional)
let autoAdvance = false;
let autoAdvanceInterval;

function toggleAutoAdvance() {
    autoAdvance = !autoAdvance;
    
    if (autoAdvance) {
        autoAdvanceInterval = setInterval(() => {
            if (currentSlide < totalSlides) {
                nextSlide();
            } else {
                changeSlide(1); // Loop back to beginning
            }
        }, 8000);
    } else {
        clearInterval(autoAdvanceInterval);
    }
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length) {
        if (konamiCode.every((code, index) => code === konamiSequence[index])) {
            triggerEasterEgg();
            konamiCode = [];
        }
    }
});

function triggerEasterEgg() {
    // Create rainbow text effect
    const titles = document.querySelectorAll('.main-title, .slide-title');
    titles.forEach(title => {
        title.style.animation = 'rainbow-text 1s infinite';
    });
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-text {
            0% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
            16% { color: #ff8000; text-shadow: 0 0 10px #ff8000; }
            33% { color: #ffff00; text-shadow: 0 0 10px #ffff00; }
            50% { color: #00ff00; text-shadow: 0 0 10px #00ff00; }
            66% { color: #00ffff; text-shadow: 0 0 10px #00ffff; }
            83% { color: #0080ff; text-shadow: 0 0 10px #0080ff; }
            100% { color: #ff00ff; text-shadow: 0 0 10px #ff00ff; }
        }
    `;
    document.head.appendChild(style);
    
    // Reset after 3 seconds
    setTimeout(() => {
        titles.forEach(title => {
            title.style.animation = '';
        });
    }, 3000);
    
    console.log('🎮 Retro Easter Egg Activated! 🎮');
}

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if swipe is primarily horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > 50) { // Minimum swipe distance
            if (deltaX > 0) {
                previousSlide(); // Swipe right = previous slide
            } else {
                nextSlide(); // Swipe left = next slide
            }
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Add sound effects (optional - requires audio files)
function playRetroSound(type) {
    // This would require actual audio files
    // For now, we'll use the Web Audio API for simple beeps
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'next':
                oscillator.frequency.value = 800;
                break;
            case 'prev':
                oscillator.frequency.value = 400;
                break;
            default:
                oscillator.frequency.value = 600;
        }
        
        oscillator.type = 'square';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Enhanced navigation with sound
function nextSlideWithSound() {
    playRetroSound('next');
    nextSlide();
}

function previousSlideWithSound() {
    playRetroSound('prev');
    previousSlide();
}

// Update button onclick handlers
document.addEventListener('DOMContentLoaded', function() {
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    if (nextBtn) {
        nextBtn.onclick = nextSlideWithSound;
    }
    
    if (prevBtn) {
        prevBtn.onclick = previousSlideWithSound;
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized resize handler
const optimizedResize = debounce(function() {
    // Update particle positions on resize
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach(particle => {
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
    });
}, 250);

window.addEventListener('resize', optimizedResize);

// Preload slide animations
function preloadSlideAnimations() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.addEventListener('transitionend', function() {
            if (slide.classList.contains('active')) {
                triggerSlideAnimations(index + 1);
            }
        });
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadSlideAnimations);

// Export functions for potential external use
window.D3Presentation = {
    nextSlide,
    previousSlide,
    changeSlide,
    toggleAutoAdvance,
    toggleFullscreen
};
