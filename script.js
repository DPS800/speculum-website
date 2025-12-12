document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('heroVideo');
    const playOverlay = document.querySelector('.play-overlay');

    const pauseBtn = document.getElementById('pauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const chevron = document.querySelector('.scroll-chevron-container');
    const nextSection = document.querySelector('.hero').nextElementSibling;

    // Icons
    const iconPause = pauseBtn.querySelector('.icon-pause');
    const iconPlay = pauseBtn.querySelector('.icon-play');
    const iconVolHigh = volumeBtn.querySelector('.icon-vol-high');
    const iconVolMute = volumeBtn.querySelector('.icon-vol-mute');

    // Initial State: User wanted Volume ON (unmuted) on load.
    // Note: Most browsers will block Autoplay with Sound. 
    // We try to submit to the user's will, but if it fails, we catch it.
    heroVideo.muted = false;

    const playVideo = async () => {
        try {
            await heroVideo.play();
            playOverlay.style.opacity = '0';
            updatePauseIcon(true);
        } catch (err) {
            console.log("Autoplay with sound failed. Muting and retrying.", err);
            // Fallback: Mute and play
            heroVideo.muted = true;
            updateVolumeIcon(true); // Show Muted Icon
            try {
                await heroVideo.play();
                playOverlay.style.opacity = '0';
                updatePauseIcon(true);
            } catch (errMuted) {
                console.log("Autoplay completely failed. Waiting for user.");
                playOverlay.style.opacity = '1';
                updatePauseIcon(false);
            }
        }
    };

    // UI Updates
    function updatePauseIcon(isPlaying) {
        if (isPlaying) {
            iconPause.style.display = 'block';
            iconPlay.style.display = 'none';
        } else {
            iconPause.style.display = 'none';
            iconPlay.style.display = 'block';
        }
    }

    function updateVolumeIcon(isMuted) {
        if (isMuted) {
            iconVolHigh.style.display = 'none';
            iconVolMute.style.display = 'block';
        } else {
            iconVolHigh.style.display = 'block';
            iconVolMute.style.display = 'none';
        }
    }

    // Controls Logic
    playOverlay.addEventListener('click', () => {
        heroVideo.muted = false; // User interacted, so we can unmute
        updateVolumeIcon(false);
        heroVideo.play();
        playOverlay.style.opacity = '0';
        updatePauseIcon(true);
    });

    pauseBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
            heroVideo.play();
            playOverlay.style.opacity = '0';
            updatePauseIcon(true);
        } else {
            heroVideo.pause();
            updatePauseIcon(false);
        }
    });

    volumeBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        updateVolumeIcon(heroVideo.muted);
    });

    chevron.addEventListener('click', () => {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Fullscreen Logic
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const iconMaximize = fullscreenBtn.querySelector('.icon-maximize');
    const iconMinimize = fullscreenBtn.querySelector('.icon-minimize');

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            heroVideo.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function updateFullscreenIcon() {
        if (document.fullscreenElement) {
            iconMaximize.style.display = 'none';
            iconMinimize.style.display = 'block';
        } else {
            iconMaximize.style.display = 'block';
            iconMinimize.style.display = 'none';
        }
    }

    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);

    // Start
    playVideo();

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Controls Fade In
    gsap.from('.hero-controls', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
    });

    // SpecuFlux Branding
    gsap.from('.brand-logo-large', {
        scrollTrigger: {
            trigger: '#specuflux-branding',
            start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.brand-tagline', {
        scrollTrigger: {
            trigger: '#specuflux-branding',
            start: 'top 70%',
        },
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out'
    });

    // Features Grid
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Tools Section
    gsap.from('.tool-item', {
        scrollTrigger: {
            trigger: '.tools-section',
            start: 'top 80%',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    gsap.from('.tools-graphic', {
        scrollTrigger: {
            trigger: '.tools-section',
            start: 'top 80%',
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    });

    // SpecuLate Section
    gsap.from('#speculate-section .brand-logo-large, #speculate-section .brand-tagline', {
        scrollTrigger: {
            trigger: '#speculate-section',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Platform Cards
    gsap.from('.platform-card', {
        scrollTrigger: {
            trigger: '.platform-cards',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // FAQ Logic
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;

            // Toggle active class
            question.classList.toggle('active');

            // Toggle max-height for smooth slide
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }

            // Optional: Close others
            faqQuestions.forEach(otherQ => {
                if (otherQ !== question && otherQ.classList.contains('active')) {
                    otherQ.classList.remove('active');
                    otherQ.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });

    // FAQ Section Animation
    gsap.from('.faq-item', {
        scrollTrigger: {
            trigger: '.faq-container',
            start: 'top 90%',
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Events Grid
    gsap.from('.event-card', {
        scrollTrigger: {
            trigger: '.events-grid',
            start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Upcoming List
    gsap.from('.upcoming-item', {
        scrollTrigger: {
            trigger: '.upcoming-list',
            start: 'top 90%',
        },
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power1.out'
    });

    // --- Interactive Animations & Custom Cursor ---

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Move Cursor
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline trails slightly with GSAP
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: "power2.out" // smooth trail
        });
    });

    // Hover States for Cursor
    const hoverTargets = document.querySelectorAll('a, button, .feature-card, .event-card, .tool-item, .faq-question, input');

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
            // Slight magnetic pull for buttons could be added here if desired
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // Button Magnetism (Optional "Fancy" touch)
    const buttons = document.querySelectorAll('.btn, .signin-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.2, // Move button slightly towards mouse
                y: y * 0.2,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "elastic.out(1, 0.5)" });
        });
    });

    // Event Card Hover Animations (Fancy)
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        const img = card.querySelector('img');
        const content = card.querySelector('div'); // The text container

        card.addEventListener('mouseenter', () => {
            // Zoom image deeper
            gsap.to(img, {
                scale: 1.15,
                duration: 0.6,
                ease: "power2.out"
            });
            // Lift text content slightly
            gsap.to(content, {
                y: -8,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            });
            gsap.to(content, {
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Hero Logo "Magnetic Gaze" (Parallax)
    const heroLogo = document.querySelector('.hero-content .logo');
    if (heroLogo) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) * 0.02; // Subtle parallax
            const y = (e.clientY - window.innerHeight / 2) * 0.02;

            gsap.to(heroLogo, {
                x: x,
                y: y,
                duration: 1,
                ease: "power2.out"
            });
        });

        heroLogo.addEventListener('mouseenter', () => {
            gsap.to(heroLogo, { scale: 1.1, duration: 0.5, ease: "back.out(1.7)" });
        });
        heroLogo.addEventListener('mouseleave', () => {
            gsap.to(heroLogo, { scale: 1, duration: 0.5, ease: "power2.out" });
        });
    }

    // Feature Cards Hover (Lift & Wiggle)
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');

        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                borderColor: "rgba(255, 255, 255, 0.4)", // Brighten border
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(icon, {
                scale: 1.1,
                rotation: 5, // Slight playful tilt
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                borderColor: "#222", // Reset to original dark
                boxShadow: "none",
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Tool Items Hover (Slide & Highlight)
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        const icon = item.querySelector('.tool-icon');

        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                x: 15,
                backgroundColor: "#1a1a1a", // Subtle highlight from black
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(icon, {
                scale: 1.1,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                x: 0,
                backgroundColor: "transparent",
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(icon, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Platform Cards Hover (Lift & Tilt)
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        const icon = card.querySelector('.platform-icon');

        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                borderColor: "rgba(255, 255, 255, 0.4)", // Brighten border
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(icon, {
                scale: 1.1,
                rotation: 5,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                borderColor: "#222",
                boxShadow: "none",
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
});