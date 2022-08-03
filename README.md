# LINK AL SITO:
https://fuego-events.com

# INDICAZIONI PER EFFETTUARE LE MODIFICHE

## COME SONO FATTI I DOCUMENTI DI CONFIGURAZIONE?
Tutti i file di configurazione sono _.json_.  
Ogni documento non è dissimile dal seguente:

```
{
    "nomeCampo": "valore",
    "altroNomeCampo": 0,
    "campoLista": [
        "elemento1",
        "elemento2"
    ]
}
```
Ma cosa significano questi simboli:

Le parentesi graffe '_{}_' indicano un _oggetto_, ovvero un contenitore che può contenere diversi campi.  
Ogni campo può essere una _stringa_, un numero, un altro _oggetto_ o una _lista_.

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

## AGGIUNGERE UN EVENTO:
Per aggiungere un qualsiasi evento è necessario recarsi nella cartella _resources_, poi nella cartella _configs_ e, infine, il file _events-config.json_.  
Una volta visualizzato cliccare sulla matita per modificare il documento.  
Il documento di configurazione degli eventi è una lista contenente numerosi oggetti.  
Ogni oggetto rappresenta un singolo evento.  
Ogni evento deve contenere i seguenti campi:
- "party-name": "testo", ovvero il nome dell'evento
- "party-timestamp": 1658437200, ovvero la data dell'inizio dell'evento
- "party-image-url": "../resources/events-images/event-02.jpeg", ovvero il percorso dell'immagine dell'evento
- "party-location": "Chiringuito Kokale - Bagno 63 Rimini (RN)", ovvero l'indirizzo dell'evento
- "party-url": null, ovvero il link per ottenere ulteriori informazioni sull'evento o per comprare i biglietti.   
Inserire la scritta _null_ (senza doppi apici) per indicare la mancanza di un link.  
Le immagini possono essere sia l'indirizzo di un'immagine che si trova online, sia l'indirizzo di un'immagine caricata.
Per caricare un'immagine, inserire il file dentro la cartella _Resources_ -> _events-images_
Per inserirla nel campo _party-image-url_ anteporre al nome del file il seguente testo "../resources/events-images/"  
```
es. "party-image-url": "../resources/events-images/immagine1.jpg"
```