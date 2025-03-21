export { Utilities };

class Utilities {
    
    static GetSlideshowAnimationKeyframe(duration = 1 * 1000) {
        const ANIMATION_KEYFRAME = [
            { clipPath: "circle(75%)" },
            { clipPath: "circle(0%)" },
        ];

        const ANIMATION_KEYFRAME_PROPERTIES = {
            duration: duration,
        };

        return [ANIMATION_KEYFRAME, ANIMATION_KEYFRAME_PROPERTIES];
    }

    

    static GetFieldContainer(label, content) {
        const container = document.createElement("div");
        container.classList.add("field-container");
        container.innerHTML = `
        <span class="field-label">${label}</span>
        <span class="field-content">${content}</span>
        `;
        return container;
    }

    // -> Popup

    static FlipFrontBackCard(card) {
        card.setAttribute("data-state", (card.getAttribute("data-state") === "flipped") ? "default" : "flipped");
    }

    static GetPopupBackground() {
        let backgroundPopup = document.createElement("div");
        backgroundPopup.classList.add('popup-background');
        return backgroundPopup;
    }

    static async SummonAlbumImagePopup(albumURL, forceindex) {
        const images = await fetch(albumURL).then(x => x.json());
        let currentIndex = forceindex;

        const backgroundPopup = Utilities.GetPopupBackground();
        const blurredBg = document.createElement("div");
        blurredBg.classList.add("blurred-background");
        backgroundPopup.appendChild(blurredBg);

        const photo = document.createElement("img");
        photo.classList.add("album-photo");
        backgroundPopup.appendChild(photo);

        const imageX = document.createElement("div");
        imageX.innerHTML = "&#10005;"
        imageX.classList.add('image-control', "control-1");
        backgroundPopup.appendChild(imageX);

        const imageDownload = document.createElement("a");
        imageDownload.download = "";
        imageDownload.innerHTML = '<span class="material-symbols-outlined">file_download</span>';
        imageDownload.classList.add('image-control', "control-2");
        backgroundPopup.appendChild(imageDownload);
        
        const prevButton = document.createElement("div");
        prevButton.innerHTML = '<span class="material-symbols-outlined">arrow_back</span>';
        prevButton.classList.add('image-control', "control-3");
        
        const nextButton = document.createElement("div");
        nextButton.innerHTML = '<span class="material-symbols-outlined">arrow_forward</span>';
        nextButton.classList.add('image-control', "control-4");
        
        const changeImage = function(step) {
            currentIndex += step;
            if(currentIndex < 0) currentIndex = 0 
            if(currentIndex >= images.length) currentIndex = images.length;

            if(currentIndex - 1 < 0) prevButton.classList.add("disabled"); else prevButton.classList.remove("disabled"); 
            if(currentIndex + 1 >= images.length) nextButton.classList.add("disabled"); else nextButton.classList.remove("disabled");
            
            photo.src = "./resources/wallpapers/loading.gif";
            imageDownload.classList.add("disabled");


            let imageToLoad = new Image();
            imageToLoad.onload = () => {
                photo.src = images[currentIndex]['download_url'];
                imageDownload.href = images[currentIndex]['download_url'].replace("https://raw.githubusercontent.com/fuego-events/fuego-website/main", ".");
                imageDownload.classList.remove("disabled");
            }
            imageToLoad.src = images[currentIndex]['download_url'];

            // photo.src = images[currentIndex]['download_url'];
            // imageDownload.href = images[currentIndex]['download_url'].replace("https://raw.githubusercontent.com/fuego-events/fuego-website/main", ".");

        };
        
        prevButton.addEventListener("click", function() {
            changeImage(-1);
        });

        nextButton.addEventListener("click", function() {
            changeImage(+1);
        });
        changeImage(0);


        backgroundPopup.appendChild(prevButton);
        backgroundPopup.appendChild(nextButton);

        // -> Make unclickable the background
        
        const prevScrollY = window.scrollY;
        const prevBodyOverflowY = document.body.style.overflowY;
        const prevContainerOverflowY = document.querySelector(".container").style.overflowY;
        
        
        document.body.style.overflowY = "hidden";
        document.querySelector(".container").style.overflowY = "hidden";
        document.querySelector("#menu-toggle").checked = false; 
        
        imageX.addEventListener("click", function() {
            document.body.removeChild(backgroundPopup);
            
            document.body.style.overflowY = prevBodyOverflowY;
            document.querySelector(".container").style.overflowY = prevContainerOverflowY;
            window.scrollTo({
                "left": 0,
                "top": prevScrollY,
                "behavior": "auto"
            });
        });
        
        
        document.body.appendChild(backgroundPopup);


    }

    static async SummonAlbumImageList(albumURL) {
        const prevScrollY = window.scrollY;
        const prevBodyOverflowY = document.body.style.overflowY;
        const prevContainerOverflowY = document.querySelector(".container").style.overflowY;
        window.scrollTo(0, 0);
        const images = await fetch(albumURL).then(x => x.json());
        let currentIndex = 0;

        let backgroundPopup = document.createElement("div");
        backgroundPopup.classList.add('popup-background');
        const blurredBg = document.createElement("div");
        blurredBg.classList.add("blurred-background");
        backgroundPopup.appendChild(blurredBg);

        const photo = document.createElement("div");

        for (let i = 0; i < images.length; i++) {
            const imageElement = document.createElement("img");
            imageElement.src = "./resources/wallpapers/loading.gif";
            imageElement.classList.add("album-photo");
            imageElement.setAttribute("loading", "lazy");
            //imageElement.addEventListener("click", () => document.body.removeChild(backgroundPopup));
            imageElement.addEventListener("click", () => Utilities.SummonAlbumImagePopup(albumURL, i));
            let imageToLoad = new Image();
            imageToLoad.onload = () => {
                imageElement.src = images[i]['download_url'];
            }
            imageToLoad.src = images[i]['download_url'];

            /*
            const imageDownload = document.createElement("a");
            imageDownload.download = images[i]['download_url'];
            imageDownload.innerHTML = '<span class="material-symbols-outlined">file_download</span>';
            imageDownload.classList.add('image-control', "control-download");
            photo.appendChild(imageDownload);
            */
            photo.appendChild(imageElement);
          }
        photo.classList.add("album-scrollview");
        backgroundPopup.appendChild(photo);

        const imageX = document.createElement("div");
        imageX.innerHTML = "&#10005;"
        imageX.classList.add('image-control', "control-1");
        backgroundPopup.appendChild(imageX);

        

        /*
        const prevButton = document.createElement("div");
        prevButton.innerHTML = '<span class="material-symbols-outlined">arrow_back</span>';
        prevButton.classList.add('image-control', "control-3");
        
        const nextButton = document.createElement("div");
        nextButton.innerHTML = '<span class="material-symbols-outlined">arrow_forward</span>';
        nextButton.classList.add('image-control', "control-4");
        */
        
        const changeImage = function(step) {
            currentIndex += step;
            if(currentIndex < 0) currentIndex = 0 
            if(currentIndex >= images.length) currentIndex = images.length;

            if(currentIndex - 1 < 0) prevButton.classList.add("disabled"); else prevButton.classList.remove("disabled"); 
            if(currentIndex + 1 >= images.length) nextButton.classList.add("disabled"); else nextButton.classList.remove("disabled");
            
            photo.src = "./resources/wallpapers/loading.gif";
            imageDownload.classList.add("disabled");


            let imageToLoad = new Image();
            imageToLoad.onload = () => {
                photo.src = images[currentIndex]['download_url'];
                imageDownload.href = images[currentIndex]['download_url'].replace("https://raw.githubusercontent.com/fuego-events/fuego-website/main", ".");
                imageDownload.classList.remove("disabled");
            }
            imageToLoad.src = images[currentIndex]['download_url'];

            // photo.src = images[currentIndex]['download_url'];
            // imageDownload.href = images[currentIndex]['download_url'].replace("https://raw.githubusercontent.com/fuego-events/fuego-website/main", ".");

        };
        /*
        prevButton.addEventListener("click", function() {
            changeImage(-1);
        });

        nextButton.addEventListener("click", function() {
            changeImage(+1);
        });
        changeImage(0);
        


        backgroundPopup.appendChild(prevButton);
        backgroundPopup.appendChild(nextButton);
        */

        // -> Make the background unclickable
        
        
        
        document.body.style.overflowY = "hidden";
        document.querySelector(".container").style.overflowY = "hidden";
        document.querySelector("#menu-toggle").checked = false; 
        
        imageX.addEventListener("click", function() {
            document.body.removeChild(backgroundPopup);
            
            document.body.style.overflowY = prevBodyOverflowY;
            document.querySelector(".container").style.overflowY = prevContainerOverflowY;
            window.scrollTo({
                "left": 0,
                "top": prevScrollY,
                "behavior": "auto"
            });
        });
        
        
        document.body.appendChild(backgroundPopup);


    }


    static SummonProductImagePopup(imageName, imageFront, imageBack) {
        const backgroundPopup = Utilities.GetPopupBackground();
        const blurredBg = document.createElement("div");
        blurredBg.classList.add("blurred-background");
        backgroundPopup.appendChild(blurredBg);


        const card_container = document.createElement("div");
        card_container.classList.add("card");
        card_container.innerHTML = `
        <div class="card_content">
            <div class="card_front">
                <span class="card-title">${imageName}</span>
                <span class="card-subtitle">FRONTE</span>
            </div>
            <div class="card_back">
                <span class="card-title">${imageName}</span>
                <span class="card-subtitle">RETRO</span>
            </div>
        </div>`;
        card_container.querySelector(".card_front").style.backgroundImage = `url(${imageFront})`;
        card_container.querySelector(".card_back").style.backgroundImage = `url(${imageBack})`; 
        backgroundPopup.appendChild(card_container);

        const imageX = document.createElement("div");
        imageX.innerHTML = "&#10005;"
        imageX.classList.add('image-control', "control-1")
        backgroundPopup.appendChild(imageX);

        const imageFlip = document.createElement("div");
        imageFlip.innerHTML = "&#10534;"
        imageFlip.classList.add('image-control', "control-2")
        backgroundPopup.appendChild(imageFlip);
        
        // -> Make unclickable the background
        
        const prevScrollY = window.scrollY;
        const prevBodyOverflowY = document.body.style.overflowY;
        const prevContainerOverflowY = document.querySelector(".container").style.overflowY;
        
        
        document.body.style.overflowY = "hidden";
        document.querySelector(".container").style.overflowY = "hidden";
        document.querySelector("#menu-toggle").checked = false; 
        
        imageFlip.addEventListener("click", function() {
            Utilities.FlipFrontBackCard(card_container);
        })
        
        imageX.addEventListener("click", function() {
            document.body.removeChild(backgroundPopup);
            
            document.body.style.overflowY = prevBodyOverflowY;
            document.querySelector(".container").style.overflowY = prevContainerOverflowY;
            window.scrollTo({
                "left": 0,
                "top": prevScrollY,
                "behavior": "auto"
            });
        });
        
        
        document.body.appendChild(backgroundPopup);
    }


    // -> Countdown

    static GIORNI_SETTIMANA = ["Domenica","Lunedì", "Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];

    static MESI_ANNO = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]

    static DateDifference = (a, b) => a.getTime() - b.getTime();

    static TicksToCountdownString = (ticks, forceDayMode = false) => {
        if(ticks <= 0) return (forceDayMode) ? "G000000" : "H000000"; 

        let days = Math.floor(ticks / (1000 * 60 * 60 * 24));
        let hours = Math.floor((ticks % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((ticks % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((ticks % (1000 * 60)) / 1000);
        
        // -> Pattern
        // G | > 0 D = D D D | H H | M M
        // H | <= 0 D = H H | M M | S S  
        let toReturn = "";
        if(days > 0 || forceDayMode) toReturn += "G" + ((days > 9) ? "9+" : (days.toString().padStart(2, '0')));
        else toReturn += "H";

        toReturn += hours.toString().padStart(2, 0);
        toReturn += minutes.toString().padStart(2, 0);
        
        if(days <= 0 && !forceDayMode) toReturn += seconds.toString().padStart(2, 0);
        
        return toReturn;
    }

    static DateToString = (d) => `${Utilities.GIORNI_SETTIMANA[d.getDay()]} ${d.getDate()} ${Utilities.MESI_ANNO[d.getMonth()]} ${d.getFullYear()} - ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

    static GetCountdownTimer(ticksCountdown) {
        const container = document.createElement("div");
        container.classList.add("countdown-timer");
        
        let countdownString = Utilities.TicksToCountdownString(ticksCountdown);
        let labels = (countdownString[0] === 'G') ? ["d", "h", "m"] : ["h", "m", "s"];
        container.setAttribute("data-mode", countdownString[0])
        
        let first = Utilities.GetFlipCardGroup(labels[0], countdownString.substring(1, 3));
        let second = Utilities.GetFlipCardGroup(labels[1], countdownString.substring(3, 5));
        let third = Utilities.GetFlipCardGroup(labels[2], countdownString.substring(5, 7));
        
        container.appendChild(first);
        container.appendChild(second);
        container.appendChild(third);

        return container;
    }

    static GetFlipCardGroup(label, chars = []) {
        const container = document.createElement("div");
        container.classList.add("flips-container");
        container.innerHTML = `
        <div class="segment"></div>
        <div class="segment-label">${label}</div>`;
        const segmentContainer = container.querySelector(".segment");
        
        for(let i = 0; i < chars.length; i++) {
            let flipCard = document.createElement("div");
            flipCard.classList.add("flip-card");
            flipCard.innerHTML = `
            <div class="top">${chars[i]}</div>
            <div class="bottom">${chars[i]}</div>
            `;
            segmentContainer.appendChild(flipCard);
        }
        return container;
    }

    static UpdateCountdown(countdownContainer, ticks) {
        let flips = countdownContainer.querySelectorAll(".flip-card");
        let newString = Utilities.TicksToCountdownString(ticks, countdownContainer.getAttribute('data-mode') === 'G');
        for(let i = 0; i < flips.length; i++) {
            Utilities.FlipTheCard(flips[i], newString[i + 1]);
        }
    }


    static FlipTheCard(flipCard, newValue) {
        const topHalf = flipCard.querySelector(".top");
        const oldValue = topHalf.innerText;
        if (newValue === oldValue) return;

        const bottomHalf = flipCard.querySelector(".bottom");
        const topFlip = document.createElement("div");
        topFlip.classList.add("top-flip");
        const bottomFlip = document.createElement("div");
        bottomFlip.classList.add("bottom-flip");

        top.innerText = oldValue;
        bottomHalf.innerText = oldValue;
        topFlip.innerText = oldValue;
        bottomFlip.innerText = newValue;

        topFlip.addEventListener("animationstart", e => {
            topHalf.innerText = newValue;
        });
        topFlip.addEventListener("animationend", e => {
            flipCard.removeChild(topFlip);
        });
        bottomFlip.addEventListener("animationend", e => {
            bottomHalf.innerText = newValue;
            flipCard.removeChild(bottomFlip);
        });
        flipCard.appendChild(topFlip);
        flipCard.appendChild(bottomFlip);
    }

    static GetFuegoLogo() {
        const logoWrapper = document.createElement("div");
        logoWrapper.classList.add("logo-wrapper");
        logoWrapper.innerHTML = `
        <span>F</span>
        <span>U</span>
        <span class="logo pulse">E</span>
        <span>G</span>
        <span>O</span>`;
        return logoWrapper;
    }

}