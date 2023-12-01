const data = [
    {
        name: "AKLAN",
        description: ` Aklan, officially the Province of Aklan, is a province in the Western Visayas region of the Philippines. Its capital is Kalibo. The province is situated in the northwest portion of Panay Island, bordering Antique to the southwest, and Capiz to the southeast.`,
        backdrop: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png",
        feature: "Boracay",
        media: "https://lp-cms-production.imgix.net/2023-05/shutterstock_editorial_1741828760.jpg?auto=format&fit=crop&ar=1:1&q=75&w=1200"
    },
    {
        name: "AKLAN",
        description: ` Aklan, officially the Province of Aklan, is a province in the Western Visayas region of the Philippines. Its capital is Kalibo. The province is situated in the northwest portion of Panay Island, bordering Antique to the southwest, and Capiz to the southeast.`,
        backdrop: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png",
        feature: "Boracay",
        media: "https://lp-cms-production.imgix.net/2023-05/shutterstock_editorial_1741828760.jpg?auto=format&fit=crop&ar=1:1&q=75&w=1200"
    },
    {
        name: "AKLAN",
        description: ` Aklan, officially the Province of Aklan, is a province in the Western Visayas region of the Philippines. Its capital is Kalibo. The province is situated in the northwest portion of Panay Island, bordering Antique to the southwest, and Capiz to the southeast.`,
        backdrop: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png",
        feature: "Boracay",
        media: "https://lp-cms-production.imgix.net/2023-05/shutterstock_editorial_1741828760.jpg?auto=format&fit=crop&ar=1:1&q=75&w=1200"
    },
    {
        name: "AKLAN",
        description: ` Aklan, officially the Province of Aklan, is a province in the Western Visayas region of the Philippines. Its capital is Kalibo. The province is situated in the northwest portion of Panay Island, bordering Antique to the southwest, and Capiz to the southeast.`,
        backdrop: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png",
        feature: "Boracay",
        media: "https://lp-cms-production.imgix.net/2023-05/shutterstock_editorial_1741828760.jpg?auto=format&fit=crop&ar=1:1&q=75&w=1200"
    },

];

let index = 1;

let available = true;
function move(by) {
    if (!available) return;

    index += by;
    if (index < 0) index = data.length - 1;
    else if (index >= data.length) index = 0 ;

    const wrapper = document.querySelector(".gallery .wrapper");
    const active = document.querySelector(".gallery .active");   
    const cards = document.querySelectorAll(".gallery .card");   
    
    const activeIndex = Array.from(cards).indexOf(active);
    const distance = cards[activeIndex].getBoundingClientRect().width + Number(getComputedStyle(wrapper).gap.replace(/[^\d]/g,""));

    available = false;

    if (by < 0) {
        const firstElement = cards[0];
        const elementClone = firstElement.cloneNode(true);
        elementClone.classList.remove("active");
        wrapper.appendChild(elementClone);
        
        let newActive = active.nextElementSibling;
        active.style.opacity = 0;
        active.classList.remove("active");
        newActive.classList.add("active");

        setTimeout(() => {
            wrapper.style.transition = "1s";
            wrapper.style.transform = `translateX(-${distance}px)`;

            setTimeout(() => {
                firstElement.remove();
                wrapper.style.transition = "0s";
                wrapper.style.transform = `translate(0)`;
                available = true;
            },1000);
        },100);

    } else {
        wrapper.style.transform = `translate(-${distance}px)`;
        const lastElement = cards[cards.length - 1];
        const elementClone = lastElement.cloneNode(true);
        elementClone.style.opacity = 0;
        wrapper.prepend(elementClone);

        let newActive = active.previousElementSibling;
        active.classList.remove("active");
        newActive.classList.add("active");

        setTimeout(() => {
            wrapper.style.transition = "1s";
            elementClone.style.opacity = 1;
            wrapper.style.transform = `translateX(0)`;
            lastElement.remove();
            setTimeout(() => {
                wrapper.style.transition = "0s";
                available = true;
            },1000);
        },100);
    }

    displayData();
}

function displayData() {
    const title = document.querySelector(".texts h1");
    const description = document.querySelector(".texts p");
    
    const indicators = document.querySelectorAll(".line-indicator > div");
    const activeIndicator = document.querySelector(".line-indicator > div.active");
    
    swapActive(activeIndicator,indicators[data.length - (index + 1)]);
}

function swapActive(active,element) {
    if (!element) return;
    active.classList.remove("active");
    element.classList.add("active");
}
