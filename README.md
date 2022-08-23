# - LINK AL SITO -
https://fuego-events.com

# - INDICAZIONI PER EFFETTUARE LE MODIFICHE -

## Come sono fatti i file di configurazione ?
Tutti i file di configurazione sono _.json_. I file _json_ prevedono i seguenti campi:

### Le stringhe
Le _stringhe_ contengono testo, ovvero caratteri. Ogni stringa è delimitata dai doppi apici (o virgolette alte) _"_.
```
"Esempio stringa... Posso inserire anche i numeri 1234 ecc."
```
### I numeri
I _numeri_ possono essere sia interi (es. 10) che reali (es. 10.1).

#### Le date
Per le date si utilizzano i numeri, in particolare si utilizzano il numero di secondi passati dal 1 Gennaio 1970.  
Per ottenere questo valore si deve utilizzare il seguente sito "https://www.epochconverter.com/".  
Il risultato dovrebbe essere un numero simile al seguente: 1657450108.

### Gli oggetti
Gli oggetti sono contenitori di campi.  
Ogni oggetto è delimitato dalle parentesi graffe _{}_
Ogni campo è identificato da un' _etichetta_, i _:_ ed il valore del campo.  
Il valore di un campo può essere un qualsiasi altro tipo di dato, persino un altro _oggetto_.
```
{
    "campoStringa": "Questo è testo",
    "campoNumeroIntero": 10,
    "campoNumeroReale": 10.1,
    "campoAltroOggetto": {
        "altroCampo": ...
    },
    "campoLista": [
        "elemento1",
        "elemento2"
    ]
}
```
Ogni campo è separato da una virgola (_,_) dal campo successivo (a meno che non sia l'ultimo).

### Le liste
Le liste sono contenitori di valori.  
Ogni lista è delimitata dalle parentesi quadrate _[]_.
```
[
    "elemento1",
    "elemento2",
    "elemento3"
]
```
Ogni valore è separato da una virgola (_,_) dal campo successivo (a meno che non sia l'ultimo).

## - Aggiungere un album -
Per aggiungere un album la procedura è un po' più complicata...
Innanzitutto bisogna spostarsi nella cartella _resources_, poi nella cartella _events-album_ e aggiungere una cartella il cui nome è significativo.
Il nome di ogni cartella è composto da tre parti:
- numero di serie (001 -)
- nome dell'evento (Chiringuito Kokale)
- data dell'evento nel formato dd-mm-yyyy (14-07-2022)
Ciò è essenziale per il corretto funzionamento del sito. 
Infatti i primi tre numeri e il trattino saranno estratti dal nome per decidere la posizione. Maggiore sarà il numero, prima l'album sarà posizionato.
Bisogna notare che è essenziale mettere i tre numeri (anche con gli zeri) ed il trattino.
Stesso discorso vale anche per le date, che devono essere inserite alla fine del nome e devono occupare quel preciso spazio (occupando 2 caratteri per il giorno, 2 caratteri per il mese e 4 caratteri per l'anno).

## - Aggiungere un evento -
Per aggiungere un qualsiasi evento è necessario recarsi nella cartella _resources_, poi nella cartella _configs_ e, infine, il file _events-config.json_.  
Una volta visualizzato cliccare sulla matita per modificare il documento.  
Il documento di configurazione degli eventi è una lista contenente numerosi oggetti.  
Ogni oggetto rappresenta un singolo evento.  
Ogni evento deve contenere i seguenti campi:
- "party-name": "testo", ovvero il nome dell'evento
- "party-timestamp": 1658437200, ovvero la data dell'inizio dell'evento
- "party-image-url": "../resources/events-thumbnails/event-02.jpeg", ovvero il percorso dell'immagine dell'evento
- "party-location": "Chiringuito Kokale - Bagno 63 Rimini (RN)", ovvero l'indirizzo dell'evento
- "party-url": null, ovvero il link per ottenere ulteriori informazioni sull'evento o per comprare i biglietti.   

Inserire la scritta _null_ (senza doppi apici) per indicare la *mancanza* di un link.  
Le immagini possono essere sia l'indirizzo di un'immagine che si trova online, sia l'indirizzo di un'immagine caricata.
Per caricare un'immagine, inserire il file dentro la cartella _Resources_ -> _events-thumbnails_
Per inserirla nel campo _party-image-url_ anteporre al nome del file il seguente testo "../resources/events-thumbnails/"  
```
es. "party-image-url": "../resources/events-thumbnails/immagine1.jpg"
```

Una volta terminate le modifiche scorrere in fondo alla pagina, inserire come testo sotto alla scritta _commit changes_ il seguente testo: Modifica eventi 3/7/2022 (La data sarà quella del giorno di modifica).  
Infine cliccare il pulsante verde con scritto _commit changes_.

## - Aggiungere un prodotto -
Per aggiungere un qualsiasi prodotto è necessario recarsi nella cartella _resources_, poi nella cartella _configs_ e, infine, il file _merchandise-config.json_.  
Una volta visualizzato cliccare sulla matita per modificare il documento.  
Il documento di configurazione dei prodotti è una lista contenente numerosi oggetti.  
Ogni oggetto rappresenta un singolo prodotto.  
Ogni prodotto deve contenere i seguenti campi:
- "product-name": "Maglietta FUEGO", ovvero il nome del prodotto
- "product-price": "25 €", ovvero il prezzo del prodotto
- "product-image-url": "https://img01.ztat.net/article/spp-media-p1/82e5e24466bb4e21a871cab2a16bea60/5ac9292a19c14873b90e830ef5829b76.jpg?imwidth=1800&filter=packshot", ovvero il percorso dell'immagine del prodotto

Le immagini possono essere sia l'indirizzo di un'immagine che si trova online, sia l'indirizzo di un'immagine caricata.
Per caricare un'immagine, inserire il file dentro la cartella _Resources_ -> _products-images_
Per inserirla nel campo _product-image-url_ anteporre al nome del file il seguente testo "../resources/products-images/"  
```
es. "product-image-url": "../resources/products-images/immagine1.jpg"
```

Una volta terminate le modifiche scorrere in fondo alla pagina, inserire come testo sotto alla scritta _commit changes_ il seguente testo: Modifica prodotti 3/7/2022 (La data sarà quella del giorno di modifica).  
Infine cliccare il pulsante verde con scritto _commit changes_.
