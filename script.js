/**
 * LeadingEdge Vision - Interactive JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mobile Menu Toggle
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // ----------------------------------------------------
    // 2. Modal Pop-up Handlers
    // ----------------------------------------------------
    const modal = document.getElementById('enquiryModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const successCloseBtn = document.getElementById('successCloseBtn');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const enquiryForm = document.getElementById('enquiryForm');
    const modalSuccessMsg = document.getElementById('modalSuccessMsg');

    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Reset form states
            if (enquiryForm) enquiryForm.style.display = 'block';
            if (modalSuccessMsg) modalSuccessMsg.style.display = 'none';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside modal card
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Handle Form Submit
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success state inside modal
            enquiryForm.style.display = 'none';
            if (modalSuccessMsg) {
                modalSuccessMsg.style.display = 'block';
            }
            enquiryForm.reset();
        });
    }

    // ----------------------------------------------------
    // 3. Scroll Active Link Highlighting
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // ----------------------------------------------------
    // 4. Auto-scrolling Sectors Cards Carousel
    // ----------------------------------------------------
    const sectorsGrid = document.querySelector('.sectors-grid');
    const sectorsPrevBtn = document.getElementById('sectorsPrevBtn');
    const sectorsNextBtn = document.getElementById('sectorsNextBtn');
    const sectorsDotsContainer = document.getElementById('sectorsDots');

    if (sectorsGrid) {
        const cards = sectorsGrid.querySelectorAll('.sector-card');
        let autoScrollTimer = null;
        const scrollIntervalTime = 3500; // Auto scroll every 3.5 seconds

        // Build pagination dots dynamically based on number of cards
        if (sectorsDotsContainer && cards.length > 0) {
            sectorsDotsContainer.innerHTML = '';
            cards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('sector-dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to card ${index + 1}`);
                dot.addEventListener('click', () => {
                    scrollToCard(index);
                    resetAutoScroll();
                });
                sectorsDotsContainer.appendChild(dot);
            });
        }

        const dots = sectorsDotsContainer ? sectorsDotsContainer.querySelectorAll('.sector-dot') : [];

        function getCardScrollAmount() {
            if (cards.length === 0) return 300;
            const cardWidth = cards[0].offsetWidth;
            const style = window.getComputedStyle(sectorsGrid);
            const gap = parseFloat(style.gap) || 24;
            return cardWidth + gap;
        }

        function scrollToCard(index) {
            const scrollAmount = getCardScrollAmount();
            sectorsGrid.scrollTo({
                left: index * scrollAmount,
                behavior: 'smooth'
            });
            updateActiveDot(index);
        }

        function scrollNext() {
            const scrollAmount = getCardScrollAmount();
            const maxScroll = sectorsGrid.scrollWidth - sectorsGrid.clientWidth;
            
            if (sectorsGrid.scrollLeft >= maxScroll - 15) {
                // Smooth loop back to the first card
                sectorsGrid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                sectorsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }

        function scrollPrev() {
            const scrollAmount = getCardScrollAmount();
            
            if (sectorsGrid.scrollLeft <= 15) {
                // Loop to the end
                const maxScroll = sectorsGrid.scrollWidth - sectorsGrid.clientWidth;
                sectorsGrid.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                sectorsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        }

        function updateActiveDot(targetIndex) {
            if (!dots.length) return;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === targetIndex);
            });
        }

        let isScrollingDebounce = null;
        function syncActiveDotOnScroll() {
            if (isScrollingDebounce) clearTimeout(isScrollingDebounce);
            isScrollingDebounce = setTimeout(() => {
                if (!cards.length || !dots.length) return;
                const scrollAmount = getCardScrollAmount();
                if (scrollAmount <= 0) return;
                const currentIndex = Math.round(sectorsGrid.scrollLeft / scrollAmount);
                const clampedIndex = Math.max(0, Math.min(cards.length - 1, currentIndex));
                updateActiveDot(clampedIndex);
            }, 50);
        }

        // Event Listeners for Nav Buttons
        if (sectorsNextBtn) {
            sectorsNextBtn.addEventListener('click', () => {
                scrollNext();
                resetAutoScroll();
            });
        }

        if (sectorsPrevBtn) {
            sectorsPrevBtn.addEventListener('click', () => {
                scrollPrev();
                resetAutoScroll();
            });
        }

        // Update dot highlight on scroll
        sectorsGrid.addEventListener('scroll', syncActiveDotOnScroll, { passive: true });

        // Auto Scroll Timers
        function startAutoScroll() {
            stopAutoScroll();
            autoScrollTimer = setInterval(scrollNext, scrollIntervalTime);
        }

        function stopAutoScroll() {
            if (autoScrollTimer) {
                clearInterval(autoScrollTimer);
                autoScrollTimer = null;
            }
        }

        function resetAutoScroll() {
            stopAutoScroll();
            startAutoScroll();
        }

        // Pause on Mouse Hover & Touch Interaction
        sectorsGrid.addEventListener('mouseenter', stopAutoScroll);
        sectorsGrid.addEventListener('mouseleave', startAutoScroll);
        sectorsGrid.addEventListener('touchstart', stopAutoScroll, { passive: true });
        sectorsGrid.addEventListener('touchend', () => {
            setTimeout(startAutoScroll, 2000);
        });

        // Start Auto Scroll initially
        startAutoScroll();
    }
});
