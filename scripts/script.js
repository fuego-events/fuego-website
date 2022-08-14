import { Utilities } from '../scripts/Utilities.js';

window.addEventListener("load", async function () {

    const websiteConfigs = await fetch("../resources/configs/website-config.json").then((file) => file.json() );

    // ----- SCROLL EVENT ----- 
    const aList = document.querySelectorAll('a.navigate-to');
    const pairs = [];
    aList.forEach(a => {
        pairs.push([a, a]);
        pairs.push([document.querySelector(a.getAttribute("data-container")), a]);
    });

    window.addEventListener('scroll', function() {
        let first = true;
        let topbar_offset = document.querySelector(".topbar-container").offsetHeight;
        pairs.forEach(pair => {
            let [container, a] = pair;
            
            let top = window.scrollY + topbar_offset + 20;
            
            let offset = container.offsetTop;
            let height = container.offsetHeight;

            if (top >= offset && top < offset + height && first) {
                a.classList.add('active');
                first = false;
            } else {
                a.classList.remove('active');
            }
        });

    });

    // ----- SLIDESHOW CAROUSEL -----

    const slideshowContainer = document.querySelector(".slideshow-container");
    const slideshowConfigs = await fetch("../resources/configs/slideshow-config.json").then((file) => file.json() );
    const items = [];
    
    let wallpapers = slideshowConfigs['images'].reverse();
    wallpapers = wallpapers.filter(resourceURL => (websiteConfigs['images-extensions'].findIndex(x => resourceURL.endsWith(x)) != -1) || (websiteConfigs['videos-extensions'].findIndex(x => resourceURL.endsWith(x)) != -1))

    wallpapers.forEach((resourceURL, index) => {
        let isAnImage = (websiteConfigs['images-extensions'].findIndex(x => resourceURL.endsWith(x)) != -1);
        let isAVideo = (websiteConfigs['videos-extensions'].findIndex(x => resourceURL.endsWith(x)) != -1)
        
        items[index] = document.createElement("div");
        items[index].classList.add("slideshow-item");
        

        if(isAnImage) { 
            items[index].style.backgroundImage = `url(${resourceURL})`;
            if(index === wallpapers.length - 1) items[index].classList.add('item-ontop');
        } else if(isAVideo) {
            items[index].setAttribute('video', '');

            const video = document.createElement('video');
            video.muted = true;
            video.loop = true;
            video.playsInline = true;

            const source = document.createElement('source');
            source.src = `${resourceURL}`;
            source.type = 'video/mp4';
            video.appendChild(source);

            items[index].appendChild(video);

            if(index === wallpapers.length - 1) items[index].querySelector("video").play();
        }

        items[index].style.zIndex = index;
        slideshowContainer.appendChild(items[index]);
        
        const logo = Utilities.GetFuegoLogo();
        logo.style.color = slideshowConfigs['text-colors'][index % slideshowConfigs['text-colors'].length];
        items[index].appendChild(logo);
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
            items[nextIndex].querySelector('video').currentTime = 0;
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

    // ----- EVENTS CAROUSEL -----

    const events = await fetch("../resources/configs/events-config.json").then((file) => file.json() );
    events.sort((a, b) => b['party-timestamp'] - a['party-timestamp']);

    const DURATA_EVENTO = 5 * 3600 * 1000;
    
    const eventsCarousel = document.querySelector(".events-container .carousel");
    events.forEach(event => {

        const aContainer = document.createElement("a");
        if(event['party-url'] != null) aContainer.href = event['party-url'];

        const eventCard = document.createElement("div");
        eventCard.classList.add("carousel-card");

        const eventDate = new Date(event['party-timestamp'] * 1000);
        let eventFinishedTicks = new Date(eventDate.getTime() + DURATA_EVENTO);
        
        const partyImageField = document.createElement("div");
        partyImageField.classList.add("card-image");
        partyImageField.style.backgroundImage = `url(${event['party-image-url']})`;

        const nomeEventoField = Utilities.GetFieldContainer("Nome evento", event['party-name']);
        
        let stringaData = Utilities.DateToString(eventDate);
        const dataEventoField = Utilities.GetFieldContainer("Data evento", stringaData);
        
        const luogoEventoField = Utilities.GetFieldContainer("Luogo evento", event['party-location']);
        const countdownField = Utilities.GetFieldContainer("Tempo mancante", "Evento terminato");

        eventCard.append(partyImageField, nomeEventoField, dataEventoField, luogoEventoField, countdownField);

        let toReplace;
        let toActive = false;
        // Attesa
        if(Date.now() < eventDate) {
            toReplace = Utilities.GetCountdownTimer(Utilities.DateDifference(eventDate, new Date()));
            toActive = true;
        }else if(Date.now() < eventFinishedTicks) {
            toReplace = Utilities.GetFlipCardGroup("", "IN CORSO"); 
        }else {
            toReplace = Utilities.GetFlipCardGroup("", "FINITO");
        }
        countdownField.replaceChild(toReplace, countdownField.querySelector(".field-content")); 
        if(toActive) {
            let id = window.setInterval(() => {
                let ticks = Utilities.DateDifference(eventDate, new Date());
                if(ticks < 0) {
                    countdownField.replaceChild(Utilities.GetFlipCardGroup("","IN CORSO"), toReplace);
                    window.clearInterval(id);
                    return;
                };
                Utilities.UpdateCountdown(countdownField, ticks);
            }, 1000)
        }

        aContainer.appendChild(eventCard);
        eventsCarousel.appendChild(aContainer);
    });

    // -> Shop carousel
    const products = await fetch("../resources/configs/merchandise-config.json").then((file) => file.json() );
    const productsCarousel = document.querySelector(".merchandise-container .carousel");
    const FLIP_DELAY = 2.5 * 1000;-
    products.forEach(product => {
        const aContainer = document.createElement("a");
        
        const productCard = document.createElement("div");
        productCard.classList.add("carousel-card");
        
        const productImageField = document.createElement("div");
        productImageField.classList.add("product-image-card");
        productImageField.innerHTML = `
        <div class="card_content">
            <div class="card_front"></div>
            <div class="card_back"></div>
        </div>`;
        productImageField.querySelector(".card_front").style.backgroundImage = `url(${product['product-front-image-url']})`;
        productImageField.querySelector(".card_back").style.backgroundImage = `url(${product['product-back-image-url']})`;

        const nomeProdottoField = Utilities.GetFieldContainer("Nome prodotto", product['product-name']);
        
        // const prezzoProdottoField = Utilities.GetFieldContainer("Prezzo prodotto", product['product-price'] + " €");
        // productCard.append(productImageField, nomeProdottoField, prezzoProdottoField);

        productCard.append(productImageField, nomeProdottoField);

        aContainer.appendChild(productCard);
        productsCarousel.appendChild(aContainer);

        productCard.addEventListener("click", () => Utilities.SummonProductImagePopup(product['product-name'], product['product-front-image-url'], product['product-back-image-url']));

        window.setInterval(function() {
            Utilities.FlipFrontBackCard(productImageField)
        }, FLIP_DELAY);

    });


    // -> albums carousel
    const ALBUM_URL = "https://api.github.com/repos/fuego-events/fuego-website/contents/resources/events-album";
    let albums = await fetch(ALBUM_URL).then(x => x.json());
    albums = albums.sort();
    albums.reverse();
    
    
    const albumCarousel = document.querySelector(".albums-container .carousel");
    albums.forEach(gitFile => {
        let fileName = gitFile["name"];

        const aContainer = document.createElement("a");

        const card = document.createElement("div");
        card.classList.add("carousel-card");

        let nomeEvento = fileName.substring(6, fileName.length - 11);
        const nomeEventoField = Utilities.GetFieldContainer("Nome evento", nomeEvento);
        
        let dataEvento = fileName.substring(fileName.length - 11)
        const dataEventoField = Utilities.GetFieldContainer("Data evento", dataEvento);

        const showAlbum = document.createElement("span");
        showAlbum.classList.add("carousel-button");

        showAlbum.innerHTML = `
        <span class="material-symbols-outlined">photo_library</span>
        <span class="description">MOSTRA FOTO</span>
        `;

        card.append(nomeEventoField, dataEventoField, showAlbum);
        
        card.addEventListener("click", () => Utilities.SummonAlbumImagePopup(gitFile["_links"]["self"]));


        aContainer.appendChild(card);
        albumCarousel.appendChild(aContainer);

    })

});


