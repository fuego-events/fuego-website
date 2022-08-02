import { Utilities } from '../scripts/Utilities.js';

window.addEventListener("load", async function () {
    const slideshowContainer = document.querySelector(".slideshow-container");
    const whoareweContainer = document.querySelector(".whoarewe-container");
    const eventsContainer = document.querySelector(".events-container");
    const merchandiseContainer = document.querySelector(".merchandise-container");
    const contactsContainer = document.querySelector(".contacts-container");

    const aWhoarewe = document.querySelector("a[href='#a-whoarewe']");
    const aEvents = document.querySelector("a[href='#a-events']");
    const aMerchandise = document.querySelector("a[href='#a-merchandise']");
    const aContacts = document.querySelector("a[href='#a-contacts']");

    const pairsContainersAs = [
        [aWhoarewe, aWhoarewe],
        [whoareweContainer, aWhoarewe],
        [aEvents, aEvents],
        [eventsContainer, aEvents],
        [aMerchandise, aMerchandise],
        [merchandiseContainer, aMerchandise],
        [aContacts, aContacts],
        [contactsContainer, aContacts],
    ];
    console.log(pairsContainersAs)

    window.addEventListener('scroll', function() {
        let first = true;
        let topbar_offset = document.querySelector(".topbar-container").offsetHeight;
        pairsContainersAs.forEach(pair => {
            let [container, a] = pair;
            
            let top = window.scrollY + topbar_offset + 20;
            
            let offset = container.offsetTop;
            let height = container.offsetHeight;

            if (top >= offset && top < offset + height && first) {
                a.classList.add('active');
                first = false;
            }else {
                a.classList.remove('active');
            }
        })

    });

    // -> Slideshow animation

    const wallpapersConfigs = await fetch("../resources/configs/slideshow-config.json").then((file) => file.json() );
    const wallpapers = wallpapersConfigs['images'];
    
    let items = [];
    wallpapers.forEach((image, index) => {
        items[index] = document.createElement("div");
        items[index].classList.add("slideshow-item");
        
        let isAnImage = image.endsWith('.jpg') || image.endsWith('.JPG');
        let isAVideo = image.endsWith('.mp4');
        
        if(isAnImage) { 
            items[index].style.backgroundImage = `url(${image})`;
            if(index === wallpapers.length - 1) items[index].classList.add('item-ontop');
        }
        else if(isAVideo) {
            items[index].setAttribute('video', '');

            let video = document.createElement('video');
            video.muted = true;
            video.loop = true;
            video.playsInline = true;

            let source = document.createElement('source');
            source.src = `${image}`;
            source.type = 'video/mp4';
            video.appendChild(source);

            items[index].appendChild(video);
            video.play();

        }

        
        items[index].style.zIndex = index;
        slideshowContainer.appendChild(items[index]);
        
        let logoText = document.createElement("div");
        logoText.classList.add("logo-wrapper");
        logoText.innerHTML = `
        <span>F</span>
        <span>U</span>
        <span class="letter-logo pulse">E</span>
        <span>G</span>
        <span>O</span>`;
        logoText.style.color = wallpapersConfigs['text-colors'][index % wallpapersConfigs['text-colors'].length];
        items[index].appendChild(logoText);
        
    });


    const [ANIMATION_DURATION, ANIMATION_DELAY] = [1 * 1000, 3 * 1000] 
    const [ANIMATION_KEYFRAME, ANIMATION_KEYFRAME_PROPERTIES] = Utilities.GetSlideshowAnimationKeyframe(ANIMATION_DURATION);
    
    let index = items.length - 1;
    let timeout_handler = () => {
        let previousIndex = index + 1;
        if(previousIndex >= items.length) previousIndex = 0;

        let nextIndex = index - 1;
        if(nextIndex < 0) nextIndex = items.length - 1;

        if (items[nextIndex].hasAttribute('video')) {
            items[nextIndex].querySelector('video').play();
        } else {
            items[nextIndex].classList.add('item-ontop')
        }
        
        
        let animation = items[index].animate(
            ANIMATION_KEYFRAME,
            ANIMATION_KEYFRAME_PROPERTIES
        );

        animation.onfinish = () => {

            if(items[index].hasAttribute('video')) items[index].querySelector('video').pause(); 
            else items[index].classList.remove('item-ontop');


            items[index].style.zIndex = 0;
            for (let i = 0; i < items.length; i++) {
                if (index === i) continue;
                items[i].style.zIndex = parseInt(items[i].style.zIndex) + 1;
            }
            index = nextIndex;

            window.setTimeout(timeout_handler, ANIMATION_DELAY);
        };
    };

    window.setTimeout(timeout_handler, ANIMATION_DELAY);

    // -> Events carousel

    const events = await fetch("../resources/configs/events-config.json").then((file) => file.json() );
    events.sort((a, b) => b['party-timestamp'] - a['party-timestamp']);

    const DURATA_EVENTO = 5 * 3600 * 1000;
    
    let eventsCarousel = document.querySelector(".events-carousel");
    events.forEach(event => {
        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");

        let eventDate = new Date(event['party-timestamp'] * 1000);
        let eventFinishedTicks = new Date(eventDate.getTime() + DURATA_EVENTO);

        
        const partyImageField = document.createElement("div");
        partyImageField.classList.add("party-image");
        partyImageField.style.backgroundImage = `url(${event['party-image-url']})`;

        const nomeEventoField = Utilities.GetFieldContainer("Nome evento", event['party-name']);
        
        let stringaData = Utilities.DateToString(eventDate);
        const dataEventoField = Utilities.GetFieldContainer("Data evento", stringaData);
        
        const luogoEventoField = Utilities.GetFieldContainer("Luogo evento", event['party-location']);
        const countdownField = Utilities.GetFieldContainer("Tempo mancante", "Evento terminato");

        eventCard.append(partyImageField, nomeEventoField, dataEventoField, luogoEventoField, countdownField);


        let eventoFinito = Date.now() > eventFinishedTicks;

        let toReplace = (eventoFinito) ? Utilities.GetFlipCardGroup("","FINITO") : Utilities.GetCountdownTimer(Utilities.DateDifference(eventDate, new Date()));

        countdownField.replaceChild(toReplace, countdownField.querySelector(".field-content")); 
        if(!eventoFinito) {
            let id = window.setInterval(() => {
                let ticks = Utilities.DateDifference(eventDate, new Date());
                if(ticks < 0) {
                    countdownField.replaceChild(Utilities.GetFlipCardGroup("","FINITO"), toReplace);
                    window.clearInterval(id);
                    return;
                };
                Utilities.UpdateCountdown(countdownField, ticks);
            }, 1000)
        }

        eventsCarousel.appendChild(eventCard);
    });

    // -> Shop carousel
    const products = await fetch("../resources/configs/merchandise-config.json").then((file) => file.json() );
    let productsCarousel = document.querySelector(".products-carousel");
    products.forEach(event => {
        let productCard = document.createElement("div");
        productCard.classList.add("event-card");
        
        const productImageField = document.createElement("div");
        productImageField.classList.add("party-image");
        productImageField.style.backgroundImage = `url(${event['product-image-url']})`;

        const nomeProdottoField = Utilities.GetFieldContainer("Nome prodotto", event['product-name']);
        
        const prezzoProdottoField = Utilities.GetFieldContainer("Prezzo prodotto", event['product-price']);

        productCard.append(productImageField, nomeProdottoField, prezzoProdottoField);

        productsCarousel.appendChild(productCard);
    });


});


