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
    timerDisplay.textContent = `Time: ${timeLeft}`;
    container.appendChild(timerDisplay);
    const gameOverMessage = document.createElement("div");
    gameOverMessage.style.position = "absolute";
    gameOverMessage.style.top = "50%";
    gameOverMessage.style.left = "50%";
    gameOverMessage.style.transform = "translate(-50%, -50%)";
    gameOverMessage.style.fontSize = "36px";
    gameOverMessage.style.textAlign = "center";
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
    startButton.style.textAlign = "center";
    startButton.style.fontSize = "36px";
    startButton.style.cursor = "pointer";
    startButton.style.display = "block";
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
        const x = Math.random() * (container.offsetWidth - 80);
        const y = Math.random() * (container.offsetHeight - 80);
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
    function createSplash(x, y) {
        const rect = container.getBoundingClientRect();
        const offsetX = x - rect.left;
        const offsetY = y - rect.top;
        console.log(`Splash created at: (${offsetX}, ${offsetY})`);
        const splash = document.createElement("div");
        splash.style.position = "absolute";
        splash.style.width = "70px";
        splash.style.height = "70px";
        splash.style.backgroundImage = "url('./img/game/splash.webp')";
        splash.style.backgroundSize = "contain";
        splash.style.backgroundRepeat = "no-repeat";
        splash.style.borderRadius = "50%";
        splash.style.pointerEvents = "none";
        splash.style.left = `${offsetX - 25}px`;
        splash.style.top = `${offsetY - 25}px`;
        splash.style.zIndex = "9999";
        container.appendChild(splash);
        setTimeout((() => {
            console.log("Splash removed");
            splash.remove();
        }), 1e3);
    }
    document.addEventListener("mousedown", (e => {
        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        console.log(`Mouse down at: (${e.clientX}, ${e.clientY})`);
        console.log(`Relative to container: (${offsetX}, ${offsetY})`);
        createSplash(offsetX, offsetY);
    }));
    function catchCharacter(e) {
        if (e.type === "mousedown" && e.button !== 0) return;
        createSplash(e.pageX, e.pageY);
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
        createSplash(touchX, touchY);
    }));
    character.addEventListener("click", (() => {
        timeLeft += 2;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        moveCharacter();
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
    const slides = [ {
        image: "img/famous/prince_harry.webp",
        leftText: "Royalty with a rebellious twist",
        leftAuthor: "Prince Harry",
        rightQuote: "You, of course, know that it’s hard being a redhead."
    }, {
        image: "img/famous/lucille_ball.webp",
        leftText: "Icon of comedy and style.",
        leftAuthor: "Lucille Ball",
        rightQuote: "Once in his life, every man is entitled to fall madly in love with a gorgeous redhead."
    }, {
        image: "img/famous/ed_sheeran.webp",
        leftText: "Singing his way through life with fiery locks",
        leftAuthor: "Ed Sheeran",
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
    document.getElementById("story-form");
    const generateButton = document.getElementById("generate-story");
    const storyPreview = document.getElementById("story-preview");
    const storyText = document.getElementById("story-text");
    const storyPhoto = document.getElementById("story-photo");
    generateButton.addEventListener("click", (() => {
        const answer1 = document.getElementById("question1").value.trim();
        const answer2 = document.getElementById("question2").value.trim();
        const answer3 = document.getElementById("question3").value.trim();
        const photo = document.getElementById("photo").files[0];
        if (!answer1 || !answer2 || !answer3) {
            alert("Please fill out all fields before generating your story!");
            return;
        }
        const story = `\n\t\tWhen I first realized I was a FantaPant, it happened when ${answer1}.\n\t\tPeople used to say, "${answer2}," but now I understand that being a FantaPant is not just about words, it's a way of life.\n\t\tI feel ${answer3} every day and take pride in my uniqueness!\n\t`;
        storyText.textContent = story;
        if (photo) {
            const reader = new FileReader;
            reader.onload = event => {
                storyPhoto.innerHTML = `<img src="${event.target.result}" alt="FantaPant Photo" style="max-width: 100%; border-radius: 8px;">`;
            };
            reader.readAsDataURL(photo);
        } else storyPhoto.innerHTML = "";
        storyPreview.style.display = "block";
    }));
    document.getElementById("donateButton").addEventListener("click", (function(event) {
        event.preventDefault();
        const image = document.getElementById("timmy");
        if (image) image.src = "./img/sponsor_us/happy_timmy.webp";
        const caption = document.getElementById("caption");
        if (caption) caption.textContent = "Thanks to your support, Timmy is now safe with sunscreen!";
        setTimeout((() => {
            window.open("https://example.com/fantapants", "_blank");
        }), 2e3);
    }));
    window["FLS"] = true;
    headerScroll();
})();