document.addEventListener('DOMContentLoaded', async function() {
    // Initializing animations and interactions
    // Check if the screen width is less than or equal to 768 pixels
    if (window.innerWidth <= 768) {
        // Code to disable or not initialise animations
        console.log('Animations disabled for mobile');
        return; // Exit the function early
    }
    // Check if we are on one of the info pages
    if (!document.body.classList.contains('info-page')) {
        const navbarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                document.getElementById("navbar").classList.toggle("navbar-visible", !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        navbarObserver.observe(document.querySelector('header'));
    } else {
        // If on an info page, ensure the navbar is always visible
        document.getElementById("navbar").classList.add("navbar-visible");
    }

    const arrowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            document.getElementById("arrow-container").classList.toggle("arrow-hidden", !entry.isIntersecting);
        });
    }, { threshold: 0.9 });
    arrowObserver.observe(document.querySelector('header'));

    var controller = new ScrollMagic.Controller();

    function positionContainers() {
        const introSection = document.querySelector('#intro');
        const emojiContainer = document.getElementById('emoji-container');
        const imageContainer = document.getElementById('image-animation-container');

        const containerTopPosition = introSection.offsetTop + introSection.offsetHeight - 300;
        emojiContainer.style.top = `${containerTopPosition}px`;
        imageContainer.style.top = `${containerTopPosition}px`;
    }

    function createEmojis() {
        const container = document.getElementById('emoji-container');
        container.innerHTML = '';
        const emojis = ['💰', '⏰', '💸', '💰', '⏳'];
        for (let i = 0; i < 100; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'emoji';
            container.appendChild(emoji);

            emoji.style.left = `${Math.random() * 100}%`;
            emoji.style.bottom = `${-250 - Math.random() * 500}px`;

            emoji.dataset.speed = Math.random() * 0.5 + 0.5;

            setTimeout(() => emoji.style.opacity = 1, 100 * i);
        }
    }

 async function refreshTokenIfNeeded() {
    let token = localStorage.getItem('userToken');
    if (!token || tokenExpiringSoon(token)) {
        const response = await fetch('https://paddle-cockroach-bouncrrr.onrender.com/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('userToken', data.newToken);
            return data.newToken;
        } else {
            console.error('Token refresh failed');
            window.bouncrrrAuth.handleLogout();
            return null;
        }
    }
    return token;
}

    async function secureFetch(url, options = {}) {
    let token = await refreshTokenIfNeeded();
    options.headers = {...options.headers, 'Authorization': `Bearer ${token}`};
    return fetch(url, options).then(response => {
        if (!response.ok && response.status === 401) {
            window.bouncrrrAuth.handleLogout();
            throw new Error('Session expired');
        }
        return response.json();
    });
}

    function createRepeatedImages() {
        const container = document.getElementById('image-animation-container');
        container.innerHTML = '';
        const imageSrc = 'https://raw.githubusercontent.com/bouncrrr/bouncrrr.github.io/main/Bouncing%20Window.png';
        for (let i = 0; i < 50; i++) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.className = 'repeated-image';
            container.appendChild(img);

            img.style.left = `${Math.random() * 100}%`;
            img.style.bottom = `${-250 - Math.random() * 500}px`;

            img.dataset.speed = Math.random() * 0.5 + 0.5;

            setTimeout(() => img.style.opacity = 1, 100 * i);
        }
    }

    function updatePositions(progress, selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        const speed = parseFloat(element.dataset.speed);
        const translateY = (progress * speed * 3000 + 500) * -1;
        element.style.transform = `translateY(${translateY}px)`;

        let opacity;
        if (progress < 0.1) {
            opacity = progress / 0.1;
            element.style.visibility = 'visible';
        } else if (progress > 0.9) {
            opacity = (1 - progress) / 0.1;
            setTimeout(() => { element.style.visibility = 'hidden'; }, 2000); // Delay hiding to ensure they fade out completely
        } else {
            opacity = 1;
            element.style.visibility = 'visible';
        }

        element.style.opacity = opacity;
    });
}

    positionContainers();
    createEmojis();
    createRepeatedImages();

    var emojiScene = new ScrollMagic.Scene({
        triggerElement: "#animation-trigger",
        duration: 1100
    })
    .on('progress', function(e) {
        updatePositions(e.progress, '.emoji');
    })
    .addTo(controller);

    var imageScene = new ScrollMagic.Scene({
        triggerElement: "#image-animation-trigger",
        duration: 1100
    })
    .on('progress', function(e) {
        updatePositions(e.progress, '.repeated-image');
    })
    .addTo(controller);

// imageScene.addIndicators({name: "Image Animation"});

    

});
