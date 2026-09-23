/**
 * STEM Tour to Japan - Interactive JavaScript Logic
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
});
