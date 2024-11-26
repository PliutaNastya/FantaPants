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
    character.style.backgroundImage = "url('./img/game/redhead.webp')";
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);
    let timeLeft = 30;
    let timerInterval;
    let moveInterval;
    let isMoving = true;
    let hits = 0;
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
    const resultMessage = document.createElement("div");
    resultMessage.style.position = "absolute";
    resultMessage.style.top = "60%";
    resultMessage.style.left = "50%";
    resultMessage.style.transform = "translateX(-50%)";
    resultMessage.style.fontSize = "24px";
    resultMessage.style.textAlign = "center";
    resultMessage.style.display = "none";
    container.appendChild(resultMessage);
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
    const exitButton = document.createElement("button");
    exitButton.textContent = "×";
    exitButton.style.position = "absolute";
    exitButton.style.top = "10%";
    exitButton.style.right = "10%";
    exitButton.style.padding = "10px 20px";
    exitButton.style.fontSize = "48px";
    exitButton.style.color = "#ff5722";
    exitButton.style.cursor = "pointer";
    exitButton.style.display = "none";
    container.appendChild(exitButton);
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
        if (!isMoving) return;
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
        resultMessage.textContent = `You hit the character ${hits} times!`;
        resultMessage.style.display = "block";
        setTimeout((() => {
            resultMessage.style.display = "none";
            gameOverMessage.style.display = "none";
            startButton.style.display = "block";
            exitButton.style.display = "none";
        }), 3e3);
    }
    function createSplash(x, y) {
        const rect = container.getBoundingClientRect();
        const offsetX = x - rect.left;
        const offsetY = y - rect.top;
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
            splash.remove();
        }), 1e3);
    }
    document.addEventListener("mousedown", (e => {
        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        createSplash(offsetX, offsetY);
    }));
    document.addEventListener("mousemove", (e => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
    }));
    document.addEventListener("mousedown", (e => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
        createSplash(e.pageX, e.pageY);
    }));
    container.addEventListener("touchstart", (e => {
        const touch = e.touches[0];
        const touchX = touch.pageX;
        const touchY = touch.pageY;
        const rect = container.getBoundingClientRect();
        const offsetX = touchX - rect.left;
        const offsetY = touchY - rect.top;
        cursor.style.left = `${touchX}px`;
        cursor.style.top = `${touchY}px`;
        createSplash(offsetX, offsetY);
    }));
    character.addEventListener("click", (() => {
        character.style.backgroundImage = "url('./img/game/redhead_sunscreen.webp')";
        isMoving = false;
        setTimeout((() => {
            character.style.backgroundImage = "url('./img/game/redhead.webp')";
            isMoving = true;
            moveCharacter();
        }), 1e3);
        hits++;
    }));
    function initGame() {
        timeLeft = 30;
        hits = 0;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        gameOverMessage.style.display = "none";
        resultMessage.style.display = "none";
        startButton.style.display = "none";
        character.style.display = "block";
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.height = "100vh";
        container.style.zIndex = "1000";
        moveCharacter();
        startTimer();
        moveInterval = setInterval(moveCharacter, 500);
        exitButton.style.display = "block";
    }
    exitButton.addEventListener("click", (() => {
        stopTimer();
        clearInterval(moveInterval);
        container.style.position = "";
        container.style.top = "";
        container.style.left = "";
        container.style.width = "";
        container.style.height = "";
        container.style.zIndex = "";
        startButton.style.display = "block";
        exitButton.style.display = "none";
        gameOverMessage.style.display = "none";
        character.style.display = "none";
    }));
    startButton.addEventListener("click", initGame);
    const data = [ {
        image: "img/famous/ron_weasley.webp",
        name: "Ron Weasley",
        hint: "Best friend of Harry Potter."
    }, {
        image: "img/famous/jessica_chastain.webp",
        name: "Jessica Chastain",
        hint: "Hollywood actress, starred in 'The Help'."
    }, {
        image: "img/famous/ariel.webp",
        name: "Ariel",
        hint: "The Little Mermaid."
    }, {
        image: "img/famous/ed_sheeran.webp",
        name: "Ed Sheeran",
        hint: "Famous singer of 'Shape of You'."
    }, {
        image: "img/famous/lucille_ball.webp",
        name: "Lucille Ball",
        hint: "Classic TV star from 'I Love Lucy'."
    }, {
        image: "img/famous/garfield.webp",
        name: "Garfield",
        hint: "Lazy orange cat who loves lasagna."
    }, {
        image: "img/famous/bonnie_wright.webp",
        name: "Bonnie Wright",
        hint: "Played Ginny Weasley in 'Harry Potter'."
    }, {
        image: "img/famous/merida.webp",
        name: "Merida",
        hint: "Scottish princess from Pixar's 'Brave'."
    }, {
        image: "img/famous/julianne_moore.webp",
        name: "Julianne Moore",
        hint: "Oscar-winning actress known for 'Still Alice'."
    }, {
        image: "img/famous/jessica_rabbit.webp",
        name: "Jessica Rabbit",
        hint: "From 'Who Framed Roger Rabbit?'."
    }, {
        image: "img/famous/conan_obrien.webp",
        name: "Conan O'Brien",
        hint: "Iconic late-night TV host and comedian."
    } ];
    let currentIndex = 0;
    let correctAnswers = 0;
    const imageElement = document.getElementById("fanta-image");
    const answerInput = document.getElementById("answer");
    const feedbackElement = document.getElementById("feedback");
    const hintElement = document.getElementById("hint");
    const progressElement = document.getElementById("progress-text");
    const submitButton = document.getElementById("submit-btn");
    const hintButton = document.getElementById("hint-btn");
    submitButton.addEventListener("click", checkAnswer);
    hintButton.addEventListener("click", showHint);
    function updateQuiz() {
        if (currentIndex < data.length) {
            imageElement.src = data[currentIndex].image;
            answerInput.value = "";
            feedbackElement.textContent = "";
            hintElement.textContent = "";
            progressElement.textContent = `${correctAnswers}/${data.length} Correct`;
        }
    }
    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        if (currentIndex < data.length) {
            const correctAnswer = data[currentIndex].name.toLowerCase();
            if (userAnswer === correctAnswer) {
                feedbackElement.textContent = "✅ Correct!";
                feedbackElement.classList.add("quiz__feedback--correct");
                feedbackElement.classList.remove("quiz__feedback--wrong");
                correctAnswers++;
            } else {
                feedbackElement.textContent = `❌ Wrong! Correct answer: ${data[currentIndex].name}`;
                feedbackElement.classList.add("quiz__feedback--wrong");
                feedbackElement.classList.remove("quiz__feedback--correct");
            }
            currentIndex++;
            if (currentIndex < data.length) setTimeout(updateQuiz, 2e3); else setTimeout(showFinalResult, 2e3);
        }
    }
    function showHint() {
        if (currentIndex < data.length) {
            hintElement.textContent = data[currentIndex].hint;
            hintElement.classList.add("quiz__hint--visible");
        }
    }
    function showFinalResult() {
        feedbackElement.textContent = `Quiz Over! You got ${correctAnswers}/${data.length} correct.`;
        feedbackElement.classList.remove("quiz__feedback--correct", "quiz__feedback--wrong");
        hintElement.textContent = "";
        submitButton.disabled = true;
        hintButton.disabled = true;
        answerInput.disabled = true;
        const finalMessage = document.getElementById("final-message");
        finalMessage.style.display = "block";
        const joinButton = document.getElementById("join-btn");
        joinButton.addEventListener("click", (() => {
            alert("Thanks for joining the Fizz!");
        }));
    }
    updateQuiz();
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
    document.addEventListener("DOMContentLoaded", (() => {
        const nextButtons = document.querySelectorAll(".next-btn");
        const readyButton = document.querySelector(".next-btn--ready");
        const easterEgg = document.querySelector(".easter-egg");
        nextButtons.forEach((button => {
            button.addEventListener("click", (() => {
                const nextStepIndex = button.getAttribute("data-next") - 1;
                const nextStep = document.querySelector(`.fizz-way__step--${nextStepIndex + 1}`);
                if (nextStep) nextStep.classList.add("active");
            }));
        }));
        readyButton.addEventListener("click", (() => {
            easterEgg.classList.remove("hidden");
            easterEgg.style.display = "block";
        }));
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
    document.getElementById("photo").addEventListener("change", (function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader;
            const storyPhoto = document.getElementById("story-photo");
            reader.onload = function(e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                storyPhoto.innerHTML = "";
                storyPhoto.appendChild(img);
                storyPhoto.style.display = "block";
            };
            reader.onerror = function() {
                alert("Failed to load the photo.");
            };
            reader.readAsDataURL(file);
        } else document.getElementById("story-photo").style.display = "none";
    }));
    window["FLS"] = true;
    headerScroll();
})();