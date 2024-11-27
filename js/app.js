(() => {
    "use strict";
    const modules_flsModules = {};
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
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
        const splash = document.createElement("div");
        splash.style.position = "absolute";
        splash.style.width = "70px";
        splash.style.height = "70px";
        splash.style.backgroundImage = "url('./img/game/splash.webp')";
        splash.style.backgroundSize = "contain";
        splash.style.backgroundRepeat = "no-repeat";
        splash.style.borderRadius = "50%";
        splash.style.pointerEvents = "none";
        splash.style.left = `${x - 35}px`;
        splash.style.top = `${y - 35}px`;
        splash.style.zIndex = "9999";
        document.body.appendChild(splash);
        setTimeout((() => {
            splash.remove();
        }), 1e3);
    }
    document.addEventListener("mousedown", (e => {
        const x = e.pageX;
        const y = e.pageY;
        createSplash(x, y);
    }));
    document.addEventListener("mousemove", (e => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
    }));
    document.addEventListener("touchstart", (e => {
        const touch = e.touches[0];
        const touchX = touch.pageX;
        const touchY = touch.pageY;
        createSplash(touchX, touchY);
        cursor.style.left = `${touchX}px`;
        cursor.style.top = `${touchY}px`;
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
            window.open("https://app.turbos.finance/#/trade?input=0x2::sui::SUI&output=0xb230169ffa466ea8b52bd11c2490d03a4aa7db42ec7d11743d88e366faf357a1::fantapants::FANTAPANTS", "_blank");
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
    function checkConnectionSpeed() {
        const start = Date.now();
        let img = new Image;
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8fV9AAAAC0lEQVR42mP8/wcAAwAB/4CwA6oNfS4AAAAASUVORK5CYII=";
        img.onload = function() {
            const end = Date.now();
            const loadTime = end - start;
            if (loadTime > 200) document.getElementById("preloader").style.display = "flex"; else {
                document.getElementById("preloader").style.display = "none";
                document.querySelector(".content").style.display = "block";
            }
        };
        img.onerror = function() {
            document.getElementById("preloader").style.display = "flex";
        };
    }
    document.getElementById("preloader").style.display = "flex";
    setTimeout((() => {
        checkConnectionSpeed();
    }), 500);
    window.addEventListener("load", (() => {
        setTimeout((() => {
            document.getElementById("preloader").style.display = "none";
            document.querySelector(".wrapper").style.display = "block";
        }), 1e3);
    }));
    window["FLS"] = true;
    pageNavigation();
    headerScroll();
})();