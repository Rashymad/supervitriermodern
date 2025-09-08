document.addEventListener('DOMContentLoaded', function() {
    const teamMemberCards = document.querySelectorAll('.team-member-card');
    const lightbox = document.getElementById('team-lightbox');
    const lightboxImage = document.getElementById('lightbox-team-image');
    const lightboxName = document.getElementById('lightbox-team-name');
    const lightboxTitle = document.getElementById('lightbox-team-title');
    const lightboxClose = document.getElementById('lightbox-team-close');

    if (!lightbox || teamMemberCards.length === 0) return;

    teamMemberCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.name;
            const title = card.dataset.title;
            const imgSrc = card.dataset.imgSrc;

            lightboxImage.src = imgSrc;
            lightboxImage.alt = `Photo de ${name}`;
            lightboxName.textContent = name;
            lightboxTitle.textContent = title;

            lightbox.classList.remove('hidden');
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
            }, 10); // Small delay to allow transition
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.add('opacity-0');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300); // Match transition duration
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        // Close if the background is clicked, not the content inside
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
});