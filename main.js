let current = 0;
const total = 4;
let available = true;
window.onclick = function() {
    if (!available) return;
    const wrapper = document.querySelector(".gallery .wrapper");
    const active = document.querySelector(".gallery .active");   
    const cards = document.querySelectorAll(".gallery .card");
    const move = cards[current].getBoundingClientRect().width + Number((getComputedStyle(wrapper).gap.replace(/[^\d]+/g,"")));
    wrapper.style.transform = `translateX(-${move * (current + 1)}px)`;
    active.style.opacity = "0"; 
    current++;
    
    active.classList.remove("active");
    cards[current].classList.add("active");
    let activeCopy = active.cloneNode(true);
        activeCopy.style.opacity = 1;
        
   
    active.className = "card tobe-removed"; 
    if (current % total == 0) {
            const removes = document.querySelectorAll(".tobe-removed");

            for (let i = 0;i < removes.length;i++) {
                removes[i].remove();
            }
            
            wrapper.style.transition = "0s";
            wrapper.style.transform = "translateX(0)";

            setTimeout(() => {
                wrapper.style.transition = "1s"
            },1000);
            current = 0;
    }

    wrapper.appendChild(activeCopy);
    available = false;
    setTimeout(() => available = true,1000);
}
