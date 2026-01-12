# Game Store Backend

## Beskrivning
Det här API:et hanterar autentiseringar, genrer och spel. API:et ligger på Railway och byggs upp genom Dockerfile.

## Databas
Det är en MySQL databas som ligger på Railway. Den innehar sex normaliserade tabeller, vilket orsakar att ingen tabell har minst fem kolumner som innehåller data som ska visas i frontend. Dock när man hämtar spel så kommer det med flera relevanta kolumner.

### Users
<table>
    <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Password</th>
    </tr>
</table>

Users tabellen innehåller användarnamn och lösenord för användare som kan logga in i systemet.

### Genres
<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
    </tr>
</table>

Genres tabellen innehåller olika spelgenrer som kan kopplas till spelen via Game_Genres tabellen.

### Games
<table>
    <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Description</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Age_Rating_ID</th>
    </tr>
</table>

Games tabellen innehåller information om spelen som säljs i butiken, inklusive titel, beskrivning, pris, lagerstatus och en referens till åldersgränsen via Age_Rating_ID.

### Game_Genres
<table>
    <tr>
        <th>Game_ID</th>
        <th>Genre_ID</th>
    </tr>
</table>

Game_Genres tabellen är en kopplingstabell som kopplar ihop spel med deras respektive genrer via Game_ID och Genre_ID.

### Age_Ratings
<table>
    <tr>
        <th>ID</th>
        <th>Rating</th>
    </tr>
</table>

Age_Ratings tabellen innehåller åldersgränser för spelen, där varje spel har en åldersgräns kopplad via Age_Rating_ID i Games tabellen.

### Images
<table>
    <tr>
        <th>ID</th>
        <th>Game_ID</th>
        <th>Image_URL</th>
    </tr>
</table>

Images tabellen innehåller URL:er som pekar till bilder som är uppladdade på Cloudflare R2 Storage. Tabellens huvudsakliga syfte är att förhindra att bilder kan laddas upp flera gånger för samma spel.

## Ändpunkter

### Users
<table>
  <tr>
      <th>Metod</th>
      <th>Ändpunkt</th>
      <th>Body</th>
      <th>Headers</th>
      <th>Beskrivning</th>
  </tr>
    <tr>
        <td>POST</td>
        <td>/user/register</td>
        <td>
            <ul>
                <li>username: string</li>
                <li>password: string</li>
            </ul>
        </td>
        <td>Content-Type: application/json</td>
        <td>Registrerar en ny användare.</td>
  <tr>
  <tr>
      <td>POST</td>
      <td>/user/login</td>
      <td>
          <ul>
              <li>username: string</li>
              <li>password: string</li>
          </ul>
      </td>
      <td>Content-Type: application/json</td>
      <td>Loggar in en användare och sätter en cookie.</td>
  </tr>
    <tr>
        <td>POST</td>
        <td>/user/logout</td>
        <td>N/A</td>
        <td>
            <ul>
                <li>Content-Type: application/json</li>
            </ul>
        </td>
        <td>Loggar ut en användare och raderar cookien.</td>
    </tr>
    <tr>
    <td>POST</td>
    <td>/user/check</td>
    <td>N/A</td>
    <td>
        <ul>
            <li>Content-Type: application/json</li>
            <li>Cookie: session=...</li>
        </ul>
    </td>
    <td>Kontrollerar om en användare är inloggad baserat på cookien.</td>
    </tr>
</table>

### Genres
<table>
    <tr>
        <th>Metod</th>
        <th>Ändpunkt</th>
        <th>Body</th>
        <th>Headers</th>
        <th>Beskrivning</th>
    </tr>
        <tr>
            <td>GET</td>
            <td>/genre/genres</td>
            <td>N/A</td>
            <td>
             <ul>
                <li>Content-Type: application/json</li>
                <li>Cookie: session=...</li>
            </ul>
            </td>
            <td>Hämtar alla genrer.</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/genre/genre</td>
            <td>
                <ul>
                    <li>name: string</li>
                </ul>
            </td>
            <td>
            <ul>
                <li>Content-Type: application/json</li>
                <li>Cookie: session=...</li>
            </ul>
            </td>
            <td>Lägger till en ny genre.</td>
        </tr>
    <tr>
    <td>DELETE</td>
    <td>/genre/genres/:id</td>
    <td>N/A</td>
    <td>
     <ul>
        <li>Content-Type: application/json</li>
        <li>Cookie: session=...</li>
        </ul>
    </td>
    <td>Tar bort en genre baserat på dess ID.</td>
    </tr>
    <tr>
    <td>PUT</td>
    <td>/genre/genres/:id</td>
    <td>
        <ul>
            <li>name: string</li>
        </ul>
    </td>
    <td>
     <ul>
        <li>Content-Type: application/json</li>
        <li>Cookie: session=...</li>
        </ul>
    </td>
    <td>Uppdaterar en genres namn baserat på dess ID.</td>
    </tr>
</table>

### Games
<table>
    <tr>
        <th>Metod</th>
        <th>Ändpunkt</th>
        <th>Body</th>
        <th>Headers</th>
        <th>Beskrivning</th>
    </tr>
        <tr>
            <td>GET</td>
            <td>/game/games?order_by=order_type</td>
            <td>N/A</td>
            <td>
             <ul>
                <li>Content-Type: Formdata</li>
                <li>Cookie: session=...</li>
            </ul>
            </td>
            <td>Hämtar alla spel baserat på sorteringsordning.</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/game/game</td>
            <td>
                <ul>
                    <li>title: string</li>
                    <li>description: string</li>
                    <li>price: decimal</li>
                    <li>stock: int</li>
                    <li>age_rating_id: int</li>
                </ul>
            </td>
            <td>
            <ul>
                <li>Content-Type: Formdata</li>
                <li>Cookie: session=...</li>
            </ul>
            </td>
            <td>Lägger till ett nytt spel.</td>
        </tr>
    <tr>
    <td>DELETE</td>
    <td>/game/games/:id</td>
    <td>N/A</td>
    <td>
     <ul>
        <li>Content-Type: application/json</li>
        <li>Cookie: session=...</li>
        </ul>
    </td>
    <td>Tar bort ett spel baserat på dess ID.</td>
    </tr>
    <tr>
    <td>PUT</td>
    <td>/game/games/:id</td>
    <td>
        <ul>
            <li>title: string</li>
            <li>description: string</li>
            <li>price: decimal</li>
            <li>stock: int</li>
            <li>age_rating_id: int</li>
        </ul>
    </td>
    <td>
     <ul>
        <li>Content-Type: Formdata</li>
        <li>Cookie: session=...</li>
        </ul>
    </td>
    <td>Uppdaterar ett spels information baserat på dess ID.</td>   
    </tr>
</table>