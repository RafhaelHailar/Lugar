
const data = [
    {
        name: "AKLAN",
        description: ` Aklan, officially the Province of Aklan, is a province in the Western Visayas region of the Philippines. Its capital is Kalibo. The province is situated in the northwest portion of Panay Island, bordering Antique to the southwest, and Capiz to the southeast.`,
        backdrop: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png",
        feature: "Boracay",
        media: "https://lp-cms-production.imgix.net/2023-05/shutterstock_editorial_1741828760.jpg?auto=format&fit=crop&ar=1:1&q=75&w=1200"
    },
    {
        name: "ILOCOS SUR",
        description: `Ilocos Sur, officially the Province of Ilocos Sur, is a province in the Philippines located in the Ilocos Region in Luzon. Located on the mouth of the Mestizo River is the capital of Vigan.`,
        backdrop: "https://upload.wikimedia.org/wikipedia/commons/0/09/Calle_Crisologo%2C_Vigan%2C_Philippines_-_One_of_The_New_7_Wonder_Cities_of_The_World.jpg",
        feature: "City of Vigan",
        media: "https://images.squarespace-cdn.com/content/v1/5adf25b575f9ee4695083a1a/1668027106821-AX9R3MJ2MH3Y1AQJ8TRJ/vigan-philippines.jpg"
    },
    {
        name: "BOHOL",
        description: `Bohol is a province of the Philippines, in the country’s Central Visayas region. It comprises Bohol Island and numerous smaller surrounding islands. Bohol is known for coral reefs and unusual geological formations, notably the Chocolate Hills. On the main island, near the town of Carmen, these 1,200 or so symmetrical mounds turn cocoa-brown in the dry season, contrasting with the surrounding jungle's greenery.`,
        backdrop: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Bohol_Hills%2C_Chocolate_Hills%2C_Philippines.jpg",
        feature: "Chocolate Hills",
        media: "https://www.backpackerbanter.com/blog/wp-content/uploads/2015/07/bohol-philippines-backpacker-chocolate-hills-tarsier-travel-1-of-6.jpg"
    },
    {
        name: "PALAWAN",
        description: `Palawan, officially the Province of Palawan, is an archipelagic province of the Philippines that is located in the region of Mimaropa. It is the largest province in the country in terms of total area of 14,649.73 km².`,
        backdrop: "https://www.discoveryhotels-resorts.com/files/2015/06/Coron-1024x683.jpg",
        feature: "Municipality of Coron",
        media: "https://upload.wikimedia.org/wikipedia/commons/1/16/Straight_out_of_a_dream.jpg"
    },

];

let index = 0;
let ready = false;
const mooks = {};

let available = true;
function move(by,button) {
    if (!available) return;

    /* BUTTON ANIMATION */
    // 300 milli second animation
    button.classList.add("clicked");
    setTimeout(() => button.classList.remove("clicked"),300);

    index += by;
    if (index < 0) index = data.length - 1;
    else if (index >= data.length) index = 0 ;

    const wrapper = $(".gallery .wrapper");
    const active = $(".gallery .active");   
    const cards = $(".gallery .card",true);   
    
    const activeIndex = Array.from(cards).indexOf(active);

    //how far we are going to move the container,
    // it is calculated by the active card width + the card containers gap,
    // we use getComputedStyle to get the gap value that we set in our css,
    // then use some regex to remove the px (because we only one the numbers).
    const distance = cards[activeIndex].getBoundingClientRect().width + Number(getComputedStyle(wrapper).gap.replace(/[^\d]/g,""));

    available = false;

    // we move the cards to the left if we received a position number, otherwise to the right.
    /*
     *  Moving the cards like carousel is done by first creating the copy from either the two edge,
     *  where we are going move.
     *  for example, we are going to move right, we copy the rightest card and put it at the very left,
     *  so that when moving to the right we make an illusion that there is a card in the leftest left,
     *  that is hiding and are ready to replace it once move. 
     *  We then removed the card where we made that copy from and make the moving animation,
     *  you will see that we really dont make the container move long for every move that we made,
     *  we simply  moved by a particular value by once, then return to its original position.
     *
    */
    if (by > 0) {
        const firstElement = cards[0];
        const elementClone = firstElement.cloneNode(true);
        elementClone.classList.remove("active");
        $_$(wrapper,elementClone);

        let newActive = active.nextElementSibling;
        active.style.opacity = 0;
        swapActive(active,newActive);

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
        
        $_$(wrapper,elementClone,false);

        let newActive = active.previousElementSibling;
        swapActive(active,newActive);

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
    const indicators = $(".line-indicator > div",true);
    const activeIndicator = $(".line-indicator > div.active");
    
    swapActive(activeIndicator,indicators[index]);

    const {name,description,backdrop} = data[index];
    mooks.title.update(name);
    mooks.description.update(description);
    mooks.numberIndicator.update(String(index + 1).padStart(2,"0"));
    
    // next title
    (() => {
        let nextIndex = index + 1;
        nextIndex = nextIndex % data.length;// limiting the next index to the length of data so whenever next index === data.length , next index will be back to 0
        const {name} = data[nextIndex];
        mooks.nameIndicator.update(name);
    })(); 
    changeBackdrop();
} 

function changeBackdrop(backdrop) {
    // get the img in backdrop container that is visible(the previous backdrop img) then reduce its opacity,
    // then get the next backdrop img and show it in half opacity, then after the animations of filler ends,
    // remove the previous back drop img and make the next backdrop image to be more visible.
    const prevBackDropImg = $(`.backdrop img:not(.hide)`,false,
    {
        opacity: "0.5"
    });

    const nextBackDropImg = $(`.backdrop img:nth-of-type(${index + 1})`,false,{
        opacity: "0.5"
    });
    nextBackDropImg.classList.remove("hide");
    
        
    const filler = $(".backdrop .filler",false,
    {
        opacity: "1"
    });

    setTimeout(() => {
        filler.style.opacity = "0";
        setTimeout(() => {
           prevBackDropImg.classList.add("hide"); 
           nextBackDropImg.style.opacity = "1";
        });
    },500);
    

}

function swapActive(active,element) {
    if (!element) return;
    active.classList.remove("active");
    element.classList.add("active");
}

window.addEventListener("load", function() {
    ready = true;
    const loader = $("#loader");
    loader.style.opacity = 0;
    //after 2seconds of fading remove its display;
    setTimeout(() => loader.style.display = "none",2000);
});


// what I learn today(dec. 3, 2023), the domcontentloaded runs when the HTML content finish loading, while the load runs when the HTML document and its resources such as img, video and etc.
window.addEventListener("DOMContentLoaded",function() {
    const title = $(".texts h1");
    const description = $(".texts p");
    const numberIndicator = $(".number-indicator");
    const nameIndicator = $(".name-indicator");

    mooks.title = mookPan(title);
    mooks.description = mookPan(description);
    mooks.numberIndicator = mookPan(numberIndicator);
    mooks.nameIndicator = mookPan(nameIndicator);

    const wrapper = $(".gallery .wrapper");
    let cardHTMLs = ``; 
    for (let i = 0;i < data.length;i++) {
        let {feature,media} = data[i];
        let cardHTML = `
           <div class="card ${i === 0 && "active"}">
                <div>${feature}</div>
                <div class="starred">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <div class="card-body">
                    <button class="white-btn"><i class="fa-solid fa-bookmark"></i></button>
                    <img width="100%" height="100%" src="${media}" /> 
                </div>
           </div>
        `;
        cardHTMLs += cardHTML;
    }
    wrapper.innerHTML = cardHTMLs;

    // loader generating wings
    const loader = $("#loader");
    const totalWings = 8;
    const wingsContainer = $("#loader .logo-container");
    for (let i = 1;i <= totalWings;i++) {
        let div = $_("div",{
            class: "wings",
            style: `--i:${i}`
        });

        let img = $_("img", {
            src: "./assets/Wings.png"
        });

        $_$(div,img)
        ._(wingsContainer,div);

     }
     showWings();
    
    //add images to our backdrop
    const backdrop = $(".main .backdrop");
    
    for (let i = 0;i < data.length;i++) {
        const img = $_("img", {
            src: data[i].backdrop,
            class: `${i > 0 ? "hide" : ""}`
        });

        $_$(backdrop,img);
    }

});

function showWings() {
    const loaderWings = $("#loader .wings img",true);
    const duration = 2000; // 2s each wings
    const totalDuration = duration * 4; // duration * total wings - duration for starting before the last wing start animating
    for (let i = 0;i < loaderWings.length;i++) {
        const img = loaderWings[i];
        setTimeout(() => {
          img.classList.add("show");  
        },1000 * i);
    }
    
    setTimeout(() => hideWings(),totalDuration);
}

function hideWings() {
    const loaderWings = $("#loader .wings img",true);
    const duration = 2000; // 2s each wings
    const totalDuration = duration * 4; // duration * total wings
    for (let i = 0;i < loaderWings.length;i++) {
        const img = loaderWings[i];
        setTimeout(() => {
          img.classList.remove("show");  
        },1000 * i);
    }
    
    setTimeout(() => showWings(),totalDuration);
}


// mook pan some random name that came up in my mind
/*
  What it does is that it makes an element that type of animation like in the clocks,
  where text goes up and another text shows up in screen, replacing the older text,
  Like this one
  [ . ] [ * ] [ . ]
  It sets the given elements overflow to hidden to do the animation and its height to fixed on,
  its initial height
  Then create an element that will act as an holder for the prev text and the new text,
  then get the element value and asign it to another container, after that remove the element value,
  then put that value container to the container that we create, (the value container will be the prev text),
  then put the value container to the container for the texts
  after that put the container to the element


*/
/*
 *  @params {HTMLElement} element
 *  @return {Object} 
 *  Object = {
 *      element: @params element,
 *      update: function
 *  }
*/
function mookPan(element) {
   const elementHeight = element.getBoundingClientRect().height;
   element.style.overflow = "hidden";
   element.style.height = elementHeight + "px";
    
   const container = $_("div",{},
   {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
   });
    
   const valueContainer = $_("span");
   valueContainer.innerHTML = element.innerHTML;
   element.innerHTML = "";

   $_$(container,valueContainer)
   ._(element,container);

   return {
    element: container,
    update(value) {
        let element = this.element;
        
        const next = $_("span");
        next.innerHTML = value;
        
        $_$(element,next);
        
        const elementHeight = next.getBoundingClientRect().height;
        element.parentElement.style.height = elementHeight + "px";

        element.style.transition = "1s";
        const prev = element.querySelector("span");
        const prevHeight = prev.getBoundingClientRect().height;
        element.style.transform = `translateY(-${prevHeight}px)`;
        
        setTimeout(() => {
            prev.remove();
            element.style.transition = "0s";
            element.style.transform = "translateY(0)";
         },1000);
    }
  }
}

// I am too lazy to write querySelector / querySelector all everytime so this one will do
window.$ = function (selector,collection = false,styles) {
        let element_s;
        if (collection) element_s =  document.querySelectorAll(selector);
        else element_s = document.querySelector(selector);
        
        if (!element_s) throw new Error("Element not found! maybe mispelled or wrong selector name?");
        
        for (s in styles) element_s.style[s] = styles[s];
        
        return element_s;
};

// for creating an element
window.$_ = function (tagName,attr,styles) {
    const element = document.createElement(tagName);
    
    for (let a in attr) element.setAttribute(a,attr[a]);
    for (let s in styles) element.style[s] = styles[s];
    
    return element;
}

//for adding child
window.$_$ = function (parent,child,end = true) {
    if (end) parent.appendChild(child);
    else parent.prepend(child);
    return { 
        _: $_$
    }
}

//for styling
window.$$ = function (element,styles) {
    for (let s in styles) {
        element.styles[s] = styles[s];
    }
}

//for animating 
window.anim = function (action,time) {
    
}

/*
 anim(
    {
        targets: [target1,target2],
        styles: [
            {

            },
            {

            }
        ],
        time: seconds,
        callback: {
            targets: 
            styles: [
                {

                }
            ].
            time: seconds
        }
    }
 )
*/
