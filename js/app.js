(() => {
    "use strict";
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const script_button = document.querySelector(".button");
    if (script_button) {
        function activateGlowEffect() {
            const delay = Math.random() * 7 + 5;
            script_button.classList.add("attention");
            setTimeout((() => {
                script_button.classList.remove("attention");
                setTimeout(activateGlowEffect, delay * 1e3);
            }), 1500);
        }
        activateGlowEffect();
    }
    function script_menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (e.target.closest(".icon-menu")) document.documentElement.classList.toggle("menu-open");
            if (e.target.closest(".menu") && document.documentElement.classList.contains("menu-open")) document.documentElement.classList.remove("menu-open");
        }));
    }
    script_menuInit();
    document.querySelectorAll(".did-you-know__fact-card").forEach((card => {
        card.addEventListener("click", (() => {
            const cardInner = card.querySelector(".did-you-know__card-inner");
            cardInner.style.transform = cardInner.style.transform === "rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
        }));
    }));
    const container = document.getElementById("game-container");
    const character = document.getElementById("character");
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);
    let timeLeft = 20;
    let timerInterval;
    let moveInterval;
    const timerDisplay = document.createElement("div");
    timerDisplay.style.position = "absolute";
    timerDisplay.style.top = "5%";
    timerDisplay.style.right = "10%";
    timerDisplay.style.fontSize = "24px";
    timerDisplay.style.color = "#fff";
    timerDisplay.style.fontFamily = "Arial, sans-serif";
    timerDisplay.textContent = `Time: ${timeLeft}`;
    container.appendChild(timerDisplay);
    const gameOverMessage = document.createElement("div");
    gameOverMessage.style.position = "absolute";
    gameOverMessage.style.top = "50%";
    gameOverMessage.style.left = "50%";
    gameOverMessage.style.transform = "translate(-50%, -50%)";
    gameOverMessage.style.fontSize = "36px";
    gameOverMessage.style.color = "#fff";
    gameOverMessage.style.fontFamily = "Arial, sans-serif";
    gameOverMessage.style.display = "none";
    gameOverMessage.textContent = "Game Over";
    container.appendChild(gameOverMessage);
    const startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.style.position = "absolute";
    startButton.style.top = "50%";
    startButton.style.left = "50%";
    startButton.style.transform = "translate(-50%, -50%)";
    startButton.style.padding = "10px 20px";
    startButton.style.fontSize = "18px";
    startButton.style.cursor = "pointer";
    startButton.style.display = "none";
    container.appendChild(startButton);
    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) endGame();
    }
    function startTimer() {
        timerInterval = setInterval(updateTimer, 1e3);
    }
    function stopTimer() {
        clearInterval(timerInterval);
    }
    function moveCharacter() {
        const x = Math.random() * (window.innerWidth - 80);
        const y = Math.random() * (window.innerHeight - 80);
        character.style.left = `${x}px`;
        character.style.top = `${y}px`;
    }
    function endGame() {
        stopTimer();
        clearInterval(moveInterval);
        character.style.display = "none";
        gameOverMessage.style.display = "block";
        setTimeout((() => {
            gameOverMessage.style.display = "none";
            startButton.style.display = "block";
        }), 1e3);
    }
    function resetCharacter() {
        character.style.backgroundImage = "url('../img/game/redhead.png')";
        moveCharacter();
    }
    function catchCharacter(e) {
        if (e.type === "mousedown" && e.button !== 0) return;
        const cursorRect = cursor.getBoundingClientRect();
        const charRect = character.getBoundingClientRect();
        if (cursorRect.right > charRect.left && cursorRect.left < charRect.right && cursorRect.bottom > charRect.top && cursorRect.top < charRect.bottom) {
            character.style.backgroundImage = "url('../img/game/redhead_sunscreen.png')";
            timeLeft += 2;
            timerDisplay.textContent = `Time: ${timeLeft}`;
            setTimeout(resetCharacter, 500);
        }
    }
    document.addEventListener("mousemove", (e => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
    }));
    document.addEventListener("mousedown", (e => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
        catchCharacter(e);
    }));
    container.addEventListener("touchstart", (e => {
        const touch = e.touches[0];
        const touchX = touch.pageX;
        const touchY = touch.pageY;
        cursor.style.left = `${touchX}px`;
        cursor.style.top = `${touchY}px`;
        catchCharacter(e);
    }));
    function initGame() {
        timeLeft = 20;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        gameOverMessage.style.display = "none";
        startButton.style.display = "none";
        character.style.display = "block";
        moveCharacter();
        startTimer();
        moveInterval = setInterval(moveCharacter, 500);
    }
    startButton.addEventListener("click", initGame);
    startButton.style.display = "block";
    const slides = [ {
        image: "img/famous/prince_harry.webp",
        leftText: "Royalty with a rebellious twist",
        leftAuthor: "- Prince Harry",
        rightQuote: "You, of course, know that it’s hard being a redhead."
    }, {
        image: "img/famous/lucille_ball.webp",
        leftText: "Icon of comedy and style.",
        leftAuthor: "- Lucille Ball",
        rightQuote: "Once in his life, every man is entitled to fall madly in love with a gorgeous redhead."
    }, {
        image: "img/famous/ed_sheeran.webp",
        leftText: "Singing his way through life with fiery locks",
        leftAuthor: "- Ed Sheeran",
        rightQuote: "Being ginger is just a sign that you’re awesome."
    } ];
    let currentSlide = 0;
    const mainImage = document.getElementById("main-image");
    const leftText = document.getElementById("left-text");
    const leftAuthor = document.getElementById("left-author");
    const rightQuote = document.getElementById("right-quote");
    function updateSlide(index) {
        const slide = slides[index];
        mainImage.src = slide.image;
        leftText.textContent = slide.leftText;
        leftAuthor.textContent = slide.leftAuthor;
        rightQuote.textContent = slide.rightQuote;
    }
    document.getElementById("prev").addEventListener("click", (() => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide(currentSlide);
    }));
    document.getElementById("next").addEventListener("click", (() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide(currentSlide);
    }));
    updateSlide(currentSlide);
    window["FLS"] = true;
    headerScroll();
})();