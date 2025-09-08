// Gallery functionality for SUPER VITRIER website
document.addEventListener('DOMContentLoaded', function() {
    // Gallery data
    const galleryImages = [
        {
            src: '../image/upload/facade.jpg',
            titleKey: 'gallery_page.item1.title',
            categoryKey: 'gallery_page.categories.facades',
            tags: ['facades', 'commercial']
            
        },
        {
            src: '../image/upload/1Aliminuim.jpg',
            titleKey: 'gallery_page.item2.title',
            categoryKey: 'gallery_page.categories.windows',
            tags: ['windows', 'residential']
        },
        {
            src: '../image/upload/glassdoor.jpg',
            titleKey: 'gallery_page.item3.title',
            categoryKey: 'gallery_page.categories.doors',
            tags: ['doors', 'commercial']
        },
        {
            src: '../image/upload/building.jpg',
            titleKey: 'gallery_page.item4.title',
            categoryKey: 'gallery_page.categories.facades',
            tags: ['facades', 'commercial']
        },
        {
            type: 'video',
            poster: '../image/upload/custom.jpg',
            sources: [
                { src: '../videos/custom.mp4', type: 'video/mp4' }
            ],
            titleKey: 'gallery_page.item5.title',
            categoryKey: 'gallery_page.categories.custom',
            tags: ['custom', 'residential']
        },
        {
            src: '../image/upload/residential 3.jpg',
            titleKey: 'gallery_page.item6.title',
            categoryKey: 'gallery_page.categories.windows',
            tags: ['windows', 'residential']
        },
        {
            src: '../image/upload/2Aliminuim.jpg.jpg',
            titleKey: 'gallery_page.item7.title',
            categoryKey: 'gallery_page.categories.windows',
            tags: ['windows', 'residential']
        },
        {
            src: '../image/upload/Glass and aluminuim.jpg',
            titleKey: 'gallery_page.item8.title',
            categoryKey: 'gallery_page.categories.doors',
            tags: ['doors', 'commercial']
        },
        {
            src: '../image/upload/residential1.jpg',
            titleKey: 'gallery_page.item9.title',
            categoryKey: 'gallery_page.categories.windows',
            tags: ['windows', 'residential']
        }
    ];

    let currentImageIndex = 0;
    let filteredImages = [...galleryImages];

    // DOM elements
    const galleryGrid = document.getElementById('gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxVideo = document.getElementById('lightbox-video');

    // Initialize gallery
    function initGallery() {
        renderGallery();
        setupFilterButtons();
        setupLightbox();
    }

    // Render gallery images
    function renderGallery() {
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        filteredImages.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300';
            galleryItem.setAttribute('data-index', index);

            const isVideo = image.type === 'video';

            const mediaHtml = isVideo ? `
                <video loop muted playsinline class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" poster="${image.poster}">
                    ${image.sources.map(source => `<source src="${source.src}" type="${source.type}">`).join('')}
                    Your browser does not support the video tag.
                </video>
            ` : `
                <picture>
                    <source srcset="${image.src}" type="image/webp">
                    <img src="${image.src}" 
                         alt="${getTranslation(image.titleKey, currentLanguage)}" 
                         class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                         loading="lazy"
                         width="600" 
                         height="400">
                </picture>
            `;

            const overlayIcon = isVideo ? `
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
            ` : `
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                </svg>
            `;

            galleryItem.innerHTML = `
                <div class="aspect-w-16 aspect-h-12 relative">
                    ${mediaHtml}
                    <div class="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 class="font-semibold text-lg">${getTranslation(image.titleKey, currentLanguage)}</h3>
                        <p class="text-sm text-gray-200 capitalize">${getTranslation(image.categoryKey, currentLanguage)}</p>
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            ${overlayIcon}
                        </div>
                    </div>
                </div>
            `;

            galleryItem.addEventListener('click', () => openLightbox(index));
            galleryGrid.appendChild(galleryItem);

            if (isVideo) {
                const video = galleryItem.querySelector('video');
                if (video) {
                    galleryItem.addEventListener('mouseenter', () => {
                        // The play() method returns a Promise which can be rejected if autoplay is disabled.
                        video.play().catch(e => console.error("Video hover play failed:", e));
                    });
                    galleryItem.addEventListener('mouseleave', () => {
                        video.pause();
                    });
                }
            }
        });

        // Add animation delay to items
        const items = galleryGrid.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-fade-in');
        });
    }

    // Setup filter buttons
    function setupFilterButtons() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-blue-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                button.classList.remove('bg-gray-200', 'text-gray-700');
                button.classList.add('active', 'bg-blue-600', 'text-white');

                // Filter images
                if (filter === 'all') {
                    filteredImages = [...galleryImages];
                } else {
                    filteredImages = galleryImages.filter(image => 
                        image.tags.includes(filter)
                    );
                }

                // Re-render gallery with animation
                galleryGrid.style.opacity = '0';
                setTimeout(() => {
                    renderGallery();
                    galleryGrid.style.opacity = '1';
                }, 150);
            });
        });
    }

    // Setup lightbox functionality
    function setupLightbox() {
        if (!lightbox) return;

        // Close lightbox
        lightboxClose?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navigation
        lightboxPrev?.addEventListener('click', showPreviousImage);
        lightboxNext?.addEventListener('click', showNextImage);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('hidden')) {
                switch (e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        showPreviousImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });
    }

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const image = filteredImages[index];

        if (lightboxTitle && lightboxCategory) {
            lightboxTitle.textContent = getTranslation(image.titleKey, currentLanguage);
            lightboxCategory.textContent = getTranslation(image.categoryKey, currentLanguage);
        }

        if (image.type === 'video') {
            lightboxImage?.classList.add('hidden');
            lightboxVideo?.classList.remove('hidden');
            lightboxVideo.innerHTML = image.sources.map(s => `<source src="${s.src}" type="${s.type}">`).join('');
            lightboxVideo.poster = image.poster;
            lightboxVideo.load();
            lightboxVideo.play().catch(e => console.error("Video play failed:", e));
        } else {
            lightboxVideo?.classList.add('hidden');
            lightboxImage?.classList.remove('hidden');
            lightboxImage.src = image.src;
            lightboxImage.alt = getTranslation(image.titleKey, currentLanguage);
        }

        lightbox?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Add fade-in animation
        setTimeout(() => {
            lightbox?.classList.add('opacity-100');
        }, 10);
    }

    // Close lightbox
    function closeLightbox() {
        lightbox?.classList.add('hidden');
        lightbox?.classList.remove('opacity-100');
        document.body.style.overflow = '';
        if (lightboxVideo && !lightboxVideo.paused) {
            lightboxVideo.pause();
            lightboxVideo.src = ''; // Unload the video
        }
    }

    // Show previous image
    function showPreviousImage() {
        currentImageIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
        updateLightboxImage();
    }

    // Show next image
    function showNextImage() {
        currentImageIndex = currentImageIndex === filteredImages.length - 1 ? 0 : currentImageIndex + 1;
        updateLightboxImage();
    }

    // Update lightbox image
    function updateLightboxImage() {
        const image = filteredImages[currentImageIndex];
        
        if (lightboxImage && lightboxTitle && lightboxCategory && lightboxVideo) {
            // Add fade effect
            lightboxImage.style.opacity = '0';
            lightboxVideo.style.opacity = '0';
            if (lightboxVideo && !lightboxVideo.paused) {
                lightboxVideo.pause();
            }

            setTimeout(() => {
                lightboxTitle.textContent = getTranslation(image.titleKey, currentLanguage);
                lightboxCategory.textContent = getTranslation(image.categoryKey, currentLanguage);

                if (image.type === 'video') {
                    lightboxImage.classList.add('hidden');
                    lightboxVideo.classList.remove('hidden');
                    lightboxVideo.innerHTML = image.sources.map(s => `<source src="${s.src}" type="${s.type}">`).join('');
                    lightboxVideo.poster = image.poster;
                    lightboxVideo.load();
                    lightboxVideo.play().catch(e => console.error("Video play failed:", e));
                } else {
                    lightboxVideo.classList.add('hidden');
                    lightboxImage.classList.remove('hidden');
                    lightboxImage.src = image.src;
                    lightboxImage.alt = getTranslation(image.titleKey, currentLanguage);
                }
                
                lightboxImage.style.opacity = '1';
                lightboxVideo.style.opacity = '1';
            }, 150);
        }
    }

    // Initialize gallery when DOM is loaded
    initGallery();
});