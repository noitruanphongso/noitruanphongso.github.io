document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {

            navigation.classList.toggle("active");

            const isOpen = navigation.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.innerHTML = isOpen ? "&times;" : "&#9776;";
        });

        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.innerHTML = "&#9776;";
            });

        });

    }

});
// =========================================
// SCROLL REVEAL EFFECT
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(
        ".intro, .value-card, .feature, .about-section, .closing-message"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("reveal-visible");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach(function (element) {
            element.classList.add("reveal");
            observer.observe(element);
        });

    }

});
