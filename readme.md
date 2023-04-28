
# Nothing Phone

A brief description of what this project does and who it's for


## Bakgrund
Som en uppgift i kursen API-utveckling, Medieinstitutet 2023, skulle vi ta fram en applikation för att färglägga online. 
 Kriterier var att färgläggningen skulle ske i realtid mellan samtliga inloggade i applikationen, minst 4 st, och att varje användare får en färg och målar med den färgen. Färgning skall ske i ett rutnät med minst 15 kolumner och 15 rader, och bild skall kunna sparas och öppnas igen. Det skulle också finnas en chat så att de 4 användare som färgar även kan chatta med varandra. 

## Demo


## Teknik
Klient: VITE, JavaScript, Sass 

Server: Express, Mongoose, SOCKET.io, Nodemon, Cors, dotenv 

## Detaljer
En användare loggar in, blir tilldelad en random färg, och kan börja chatta direkt med alla som är inloggade.  

Användarnamnet skickas till Server och ett userObjekt skapas, som sedan skickas tillbaka till klienten och sparas i sessionStorage, resan när användaren lämnar. 
 Dynamisk textfärg i chatten beroende på den random färg användaren tilldelats. 

För att spela så skapar användaren ett rum. Här kan du måla med alla andra inloggade med den färgen du blivit tilldelad, och där antal användare i rummet går att bestämma på serversidan. 
 Vi ville att hela projektet skulle vara skalbar, från hårdkokade användare till att vi enkelt skulle kunna begära rum till bestämda antal likväl för öppet för alla. 

I detta läget i appen kan du även spara din bild som du även kan kika på genom att gå ut ur rummet och kolla Saved Images i Headern. 

För att spela spel med andra på tid kan du skapa ett rum, och därefter SPELA. 
 du får se en referensbild, där denna genereras av antalet användare och färger i rummet, och där du/ni sen på den tid som anges ska färga grid enligt referensen. När tiden är slut meddelas användaren/användarna ett score och du kan därefter gå ur rummet, och sen se din plats på vår highscore.  

Pågående projekt, Se ISSUES för buggar. 

## Starta Projektet
Server: 

Om du har nodemon globalt: 

```bash 

nodemon start 

``` 

 Annars kan du ta hem nodemon via npm lokalt: 

```bash 
 npm install --save-dev nodemon 

``` 

Och köra igång det via: 

```bash 

npx nodemon 

``` 

Du behöver en MongoDbserver som körs. 

Skapa en.env fil och fyll i dina uppgifter för  

```bash 

PORT =  
CLIENT_URI =  

DATABASE_URI = 

``` 

 
 

För att kicka igång projektet i klienten behöver du köra scriptet: 
 ```bash 

npm run dev 

``` 

 
