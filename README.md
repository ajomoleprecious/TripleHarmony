# TripleHarmony
Project van WPL gemaakt door: Precious Ajomole; Aziz Karimov; Mohammed El Yabraki, Rizwan Hussain

A Pokémon gaming website hosted on free hosting platform(s):

Render:
https://tripleharmony.onrender.com/pokemon-auth/

Koyeb:
https://pokemongame.koyeb.app/pokemon-auth/

## API Endpoints

### DELETE /pokemon-auth/unverify

Removes all unverified users from the database.

**Request:**
- Method: `DELETE`
- URL: `/pokemon-auth/unverify`
- Headers: None required
- Body: None

**Response:**
- Status: `200 OK`
- Content-Type: `application/json`

Success Response:
```json
{
  "message": "Successfully deleted {count} unverified user(s)",
  "deletedCount": 0
}
```

Error Response:
```json
{
  "error": "Failed to delete unverified users",
  "details": "Error message"
}
```
