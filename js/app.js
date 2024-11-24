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
    const secretButton = document.getElementById("embarrass-button");
    const phrase = document.getElementById("phrase");
    const phrases = [ "Gingers unite!", "You’ve unlocked the Way of the Fizz!", "SPF 100 is your best friend.", "Stay orange, stay strong!", "Fizz is life!", "Redheads don’t need sunscreen—they need a fire extinguisher.", "A redhead’s temper is as short as their time in the sun.", "Freckles: nature’s connect-the-dots game.", "Redheads are just solar-powered rage machines.", "Every redhead is 50% human, 50% SPF cream.", "Gingers don’t blush; they just shift shades.", "Redheads: stealing souls since forever.", "Red hair, don’t care—except about shade.", "Born with fire on their heads and ice in their comebacks.", "A redhead’s natural predator? The UV index." ];
    secretButton.addEventListener("click", (() => {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        phrase.textContent = randomPhrase;
    }));
    window["FLS"] = true;
    headerScroll();
})();