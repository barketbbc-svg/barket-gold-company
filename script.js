// ============================================
// BILDSPEL (SLIDESHOW) - Endast på startsidan
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Kolla om vi är på startsidan (har slideshow)
    const slideshow = document.querySelector('.slideshow');
    
    if (slideshow) {
        initSlideshow();
    }
    
    // Initiera kontaktformulär om det finns
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        initContactForm(contactForm);
    }
});

/**
 * Initierar bildspelet med automatisk rotation
 */
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const titleElement = document.getElementById('slide-title');
    const subtitleElement = document.getElementById('slide-subtitle');
    
    // Bildspelsdata - titlar och undertexter för varje bild
    const slideData = [
        {
            title: 'Premium Guldtackor',
            subtitle: 'Investera i 24K rent guld av högsta kvalitet'
        },
        {
            title: 'Exklusiva Guldmynt',
            subtitle: 'Samlar- och investeringsmynt från hela världen'
        },
        {
            title: 'Handgjorda Smycken',
            subtitle: 'Unika lyxsmycken skapade av svenska guldsmeder'
        }
    ];
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideInterval = 5000; // 5 sekunder mellan varje bild
    
    /**
     * Byter till en specifik bild
     * @param {number} index - Index för bilden att visa
     */
    function goToSlide(index) {
        // Ta bort active från alla slides och indikatorer
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Lägg till active på aktuell slide och indikator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Animera textbytet
        if (titleElement && subtitleElement) {
            // Fade ut
            titleElement.style.opacity = '0';
            subtitleElement.style.opacity = '0';
            titleElement.style.transform = 'translateY(20px)';
            subtitleElement.style.transform = 'translateY(20px)';
            
            // Byt text och fade in efter kort fördröjning
            setTimeout(() => {
                titleElement.textContent = slideData[index].title;
                subtitleElement.textContent = slideData[index].subtitle;
                
                titleElement.style.opacity = '1';
                subtitleElement.style.opacity = '1';
                titleElement.style.transform = 'translateY(0)';
                subtitleElement.style.transform = 'translateY(0)';
            }, 300);
        }
        
        currentSlide = index;
    }
    
    /**
     * Går till nästa bild
     */
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }
    
    // Lägg till CSS-transition för textanimation
    if (titleElement && subtitleElement) {
        titleElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        subtitleElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    // Klickhändelser för indikatorer
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            // Återställ automatisk rotation
            clearInterval(autoPlay);
            autoPlay = setInterval(nextSlide, slideInterval);
        });
    });
    
    // Starta automatisk rotation
    let autoPlay = setInterval(nextSlide, slideInterval);
    
    // Pausa vid hover (valfritt - förbättrar användarupplevelsen)
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', () => {
            clearInterval(autoPlay);
        });
        
        hero.addEventListener('mouseleave', () => {
            autoPlay = setInterval(nextSlide, slideInterval);
        });
    }
}

// ============================================
// KONTAKTFORMULÄR
// ============================================

/**
 * Initierar kontaktformuläret
 * @param {HTMLFormElement} form - Formulärelementet
 */
function initContactForm(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Hämta formulärdata
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validera formuläret
        if (!validateForm(data)) {
            return;
        }
        
        // Simulera formulärinskickning (i verklig produktion skulle detta skickas till en server)
        console.log('Formulärdata:', data);
        
        // Visa bekräftelsemeddelande
        showConfirmation(form);
        
        // Återställ formuläret
        form.reset();
    });
}

/**
 * Validerar formulärdata
 * @param {Object} data - Formulärdata
 * @returns {boolean} - true om valid, false annars
 */
function validateForm(data) {
    // Kontrollera obligatoriska fält
    if (!data.name || data.name.trim() === '') {
        showError('Vänligen ange ditt namn.');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showError('Vänligen ange en giltig e-postadress.');
        return false;
    }
    
    if (!data.subject || data.subject === '') {
        showError('Vänligen välj ett ämne.');
        return false;
    }
    
    if (!data.message || data.message.trim() === '') {
        showError('Vänligen skriv ett meddelande.');
        return false;
    }
    
    return true;
}

/**
 * Kontrollerar om en e-postadress är giltig
 * @param {string} email - E-postadressen att validera
 * @returns {boolean} - true om giltig
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Visar ett felmeddelande
 * @param {string} message - Felmeddelandet
 */
function showError(message) {
    // Ta bort eventuellt tidigare felmeddelande
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Skapa felmeddelande-element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background-color: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Lägg till före formuläret
    const form = document.getElementById('contact-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Ta bort efter 5 sekunder
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Visar bekräftelsemeddelande efter inskickning
 * @param {HTMLFormElement} form - Formulärelementet
 */
function showConfirmation(form) {
    // Ta bort eventuellt tidigare meddelande
    const existingMessage = document.querySelector('.form-success');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Skapa bekräftelsemeddelande
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <strong>Tack för ditt meddelande!</strong><br>
        Vi återkommer till dig inom 24 timmar.
    `;
    successDiv.style.cssText = `
        background-color: #4CAF50;
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Lägg till före formuläret
    form.insertBefore(successDiv, form.firstChild);
    
    // Ta bort efter 8 sekunder
    setTimeout(() => {
        successDiv.remove();
    }, 8000);
}
