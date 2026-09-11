document.addEventListener('DOMContentLoaded', function() {
    // Preloader - Fixed & Compatible Version
    const preloader = document.getElementById('preloader');
    const counter = preloader.querySelector('.counter');

    // Safety check
    if (!preloader || !counter) {
        console.warn('Preloader elements not found');
        return;
    }

    let count = 0;
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now(); // More universally compatible than performance.now()

    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        count = Math.floor(progress * 100);

        // Safely update the counter
        counter.innerHTML = `${count}<span>%</span>`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Preloader complete - fade out smoothly
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 300);
        }
    }

    // Start the animation immediately
    updateCounter();

    // Sticky Nav with Logo Swap
    const nav = document.getElementById('main-nav');
    const sections = document.querySelectorAll('section[id]');
    const logoLight = nav.querySelector('.logo-light');
    const logoDark = nav.querySelector('.logo-dark');

    const observerOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: '-80px 0px -60% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Logo swap based on section background
                if (sectionId === 'hero' || sectionId === 'stats' || sectionId === 'final-cta') {
                    // Dark sections: use light logo
                    nav.classList.remove('nav-dark');
                    logoLight.style.display = 'block';
                    logoDark.style.display = 'none';
                } else {
                    // Light sections: use dark logo
                    nav.classList.add('nav-dark');
                    logoLight.style.display = 'none';
                    logoDark.style.display = 'block';
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Nav scroll background change
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 80) {
            nav.classList.remove('nav-scrolled');
        } else {
            nav.classList.add('nav-scrolled');
        }
        lastScroll = currentScroll;
    });

    // Scrollytelling: How it works
    const howItWorksImage = document.querySelector('.how-it-works .scrollytelling-image img');
    const howItWorksSteps = document.querySelectorAll('.how-it-works .step');
    const howItWorksObserverOptions = {
        root: null,
        threshold: 0.5
    };

    const howItWorksObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scrollProgress = entry.boundingClientRect.y / window.innerHeight;
                let stepIndex = 0;

                if (scrollProgress < 0.33) {
                    stepIndex = 0;
                } else if (scrollProgress < 0.66) {
                    stepIndex = 1;
                } else {
                    stepIndex = 2;
                }

                howItWorksSteps.forEach((step, index) => {
                    step.classList.toggle('active', index === stepIndex);
                });

                // Change image based on step
                const images = [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60',
                    'https://images.unsplash.com/photo-1580913447569-86f040665b6c?auto=format&fit=crop&w=800&q=60',
                    'https://images.unsplash.com/photo-1564013799919-ab600027ff46?auto=format&fit=crop&w=800&q=60'
                ];
                howItWorksImage.src = images[stepIndex];
            }
        });
    }, howItWorksObserverOptions);

    const howItWorksSection = document.getElementById('how-it-works');
    const howItWorksSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                howItWorksObserver.observe(entry.target);
            } else {
                howItWorksObserver.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1 });

    howItWorksSectionObserver.observe(howItWorksSection);

    // Scrollytelling: Find your dream home
    const propertyCard = document.getElementById('property-card');
    const propertySteps = document.querySelectorAll('#property-card .step');
    const scheduleBtn = document.getElementById('schedule-viewing');

    const propertyObserverOptions = {
        root: null,
        threshold: 0.5
    };

    const propertyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scrollProgress = (entry.boundingClientRect.y + entry.boundingClientRect.height) / window.innerHeight;
                let stepIndex = 0;

                if (scrollProgress < 0.2) {
                    stepIndex = 0; // Photo
                } else if (scrollProgress < 0.4) {
                    stepIndex = 1; // Price
                } else if (scrollProgress < 0.6) {
                    stepIndex = 2; // Stats
                } else if (scrollProgress < 0.8) {
                    stepIndex = 3; // CTA Button
                } else {
                    stepIndex = 4; // Success (initially inactive)
                }

                propertySteps.forEach((step, index) => {
                    step.classList.toggle('active', index === stepIndex);
                });

                // If we reach the CTA button step, we can auto-click after a delay for demo
                if (stepIndex === 3 && !scheduleBtn.clicked) {
                    // Auto-click after 1.5s for demo purposes
                    setTimeout(() => {
                        if (!scheduleBtn.clicked) {
                            scheduleBtn.click();
                        }
                    }, 1500);
                }
            }
        });
    }, propertyObserverOptions);

    const findHomeSection = document.getElementById('find-home');
    const findHomeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                propertyObserver.observe(findHomeSection);
            } else {
                propertyObserver.unobserve(findHomeSection);
            }
        });
    }, { root: null, threshold: 0.1 });

    findHomeObserver.observe(findHomeSection);

    // Schedule viewing button click handler (simulated UI state machine)
    scheduleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        this.clicked = true;

        // Change button state to loading
        this.textContent = 'Scheduling...';
        this.disabled = true;
        this.style.background = '#666';

        // Simulate loading delay
        setTimeout(() => {
            // Hide all steps
            propertySteps.forEach(step => step.classList.remove('active'));
            // Show success step
            propertySteps[4].classList.add('active');
            // Change button to success state
            this.textContent = 'Viewing Sent ✓';
            this.style.background = 'var(--gold)';    // ✅ fixed
            this.style.color = 'var(--charcoal)';      // ✅ fixed
            this.style.cursor = 'default';
        }, 2000);
    });

    // Count-up animation for stats
    const statItems = document.querySelectorAll('#stats .stat-item');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItem = entry.target;
                const target = parseInt(statItem.getAttribute('data-target'));
                const start = 0;
                const duration = 2000; // 2s
                const startTime = Date.now();

                function updateCount(timestamp) {
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const current = Math.floor(progress * (target - start) + start);
                    statItem.querySelector('.stat-number').textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                }

                requestAnimationFrame(updateCount);
                // Unobserve after animation starts to prevent restarting
                statsObserver.unobserve(statItem);
            }
        });
    }, { root: null, threshold: 0.5 });

    statItems.forEach(item => statsObserver.observe(item));

    // Tab switcher for Our Cities
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding pane
            const tabId = btn.getAttribute('data-tab');
            const activePane = document.getElementById(`${tabId}-tab`);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });

    // Neighborhood pills click handler
    const neighborhoodPills = document.querySelectorAll('.pill-btn');
    const neighborhoodResult = document.getElementById('neighborhood-result');
    const resultTitle = document.getElementById('result-title');
    const resultDetails = document.getElementById('result-details');
    const notifyBtn = document.getElementById('notify-btn');

    neighborhoodPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            neighborhoodPills.forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            pill.classList.add('active');

            const neighborhood = pill.getAttribute('data-neighborhood');
            const priceText = pill.querySelector('.price-tag').textContent;

            // Show loading state
            resultTitle.textContent = `Searching listings in ${neighborhood}...`;
            resultDetails.textContent = '';
            notifyBtn.style.display = 'none';
            neighborhoodResult.style.display = 'block';

            // Simulate search delay
            setTimeout(() => {
                // Generate mock results based on neighborhood
                let homeCount, startingPrice;
                switch(neighborhood) {
                    case 'Banana Island':
                        homeCount = 12;
                        startingPrice = '₦550M+';
                        break;
                    case 'Ikoyi':
                        homeCount = 28;
                        startingPrice = '₦420M+';
                        break;
                    case 'Lekki Phase 1':
                        homeCount = 45;
                        startingPrice = '₦320M+';
                        break;
                    case 'Maitama':
                        homeCount = 18;
                        startingPrice = '₦480M+';
                        break;
                    case 'Asokoro':
                        homeCount = 22;
                        startingPrice = '₦380M+';
                        break;
                    case 'GRA Port Harcourt':
                        homeCount = 15;
                        startingPrice = '₦290M+';
                        break;
                    case 'Old GRA':
                        homeCount = 31;
                        startingPrice = '₦250M+';
                        break;
                    default:
                        homeCount = 0;
                        startingPrice = '₦0+';
                }

                resultTitle.textContent = `${neighborhood} Results`;
                resultDetails.textContent = `${homeCount} homes found, starting at ${startingPrice}`;
                notifyBtn.style.display = 'inline-block';
            }, 1500);
        });
    });

    notifyBtn.addEventListener('click', () => {
        alert('You will be notified when new listings matching your criteria become available.');
    });

    // Testimonial slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-nav .prev');
    const nextBtn = document.querySelector('.slider-nav .next');
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetSliderTimer();
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetSliderTimer();
    });

    let sliderTimer = setInterval(nextSlide, slideInterval);

    function resetSliderTimer() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(nextSlide, slideInterval);
    }

    // Pause slider on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(sliderTimer);
    });

    testimonialSlider.addEventListener('mouseleave', () => {
        sliderTimer = setInterval(nextSlide, slideInterval);
    });

    // Initialize first slide
    showSlide(0);

    // Smooth scrolling for anchor links (already handled by CSS, but we can add offset for fixed nav)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.getElementById('main-nav').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Mobile menu toggle (if we had one - but we don't in this design)
    // We'll keep it simple for now

    // Initialize AOS-like animations for elements (optional enhancement)
    // We'll add a simple fade-in-up for sections as they enter viewport
    const faders = document.querySelectorAll('.section');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Add appear class initially hidden
    document.documentElement.style.setProperty('--appear-delay', '0s');

    // Add CSS for appear animation (we'll inject it since we can't modify styles.css easily)
    const appearStyle = document.createElement('style');
    appearStyle.textContent = `
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }

    .section.appear {
        opacity: 1;
        transform: translateY(0);
    }

    /* Staggered appearance for child elements */
    .section.appear .section-title,
    .section.appear .section-subtitle,
    .section.appear .marquee,
    .section.appear .hero-content > * {
        transition-delay: 0.2s;
    }

    .section.appear .listing-card,
    .section.appear .testimonial-slide,
    .section.appear .pricing-card,
    .section.appear .neighborhood-pills > * {
        transition-delay: calc(0.2s + (var(--index, 0) * 0.1s));
    }

    .section.appear .stat-item {
        transition-delay: calc(0.2s + (var(--index, 0) * 0.15s));
    }
`;
    document.head.appendChild(appearStyle);

    // Add staggered index to elements for delay effect
    document.addEventListener('DOMContentLoaded', function() {
        // Add index to grid items
        const gridItems = document.querySelectorAll('.listings-grid > *, .pricing-cards > *, .neighborhood-pills > *, .stat-item, .testimonial-slide');
        gridItems.forEach((item, index) => {
            item.style.setProperty('--index', index);
        });

        // Add index to feature list items
        const featureItems = document.querySelectorAll('.tier-features li');
        featureItems.forEach((item, index) => {
            item.style.setProperty('--index', index);
        });
    });
});
