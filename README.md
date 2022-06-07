# Ghibli-X-Giphy
### This project is a synchronous collaboration between the APIs of **Studio Ghibli's Filmography** along with GIF image browser, **Giphy**.

*(Allow some time for this GIF to load...)*

![demo](https://github.com/bisdeep/Ghibli-X-Giphy/blob/main/demo.gif?raw=true)

*(The **synchronous** nature with the 2nd API requests are more evident with the 2nd and 3rd title searches - the first search was actually made prior to recording this demo)*

GIF created with [LiceCap](http://www.cockos.com/licecap/).

---

For this project I wanted to make a personal connection between the concept of GIF images with my lifelong interests in animated Japanese film and old school anime, and thought Studio Ghibli would be an ideal franchise to work with, especially considering they have a public API with their entire filmography currently up-to-date. 

This project works with a string that stores the movie title from the film studio, and searches this title in the Studio Ghibli API, which will then return the matching title and description of that movie, displaying this information to the User. Afterwards, the Giphy API takes that same movie title and displays all relevant search results of GIF images to that title, *(which works for 21/22 of the movies – the only exception being the film “The Red Turtle”, which doesn’t return any relevant images for some obvious reasons).*
After the request to Studio Ghibli's API for the movie title is successful, the returned GIFS will be displayed synchronously below the title and descriptions. If the request for the movie title isn't successful, (i.e, the film title isn't recognized in the Studio Ghibli filmography), the Giphy request cannot not be made, and the user will be returned an 404.

The synchronous nature is clearly demonstrated in **line 53 of ./index.js**, where the HTTP GET request to the Giphy (second one) API is nested within the http GET request of the Studio Ghibli (first) API, guaranteeing that the Studio Ghibli API request occurs first:

![synchronous](https://github.com/bisdeep/Ghibli-X-Giphy/blob/main/synchronousguarantee.png?raw=true)

---

### The sequence of requests is illustrated here:

![sequence](https://raw.githubusercontent.com/bisdeep/Ghibli-X-Giphy/main/SequenceDiagram/Untitled.png)

---
### What can be improved:
- CSS styling to bring it to life from the current bare-bones state:
  - Custom pages styled specifically for the search page, results page and the 404.  
- Functionality to remove case sensitivity in searches - the titles in the Studio Ghibli API are case sensitive and must be searched exactly how the titles appear, else the titles will not be valid,
    - This can be implemented by converting the user's search term to lowercase (via .toLowerCase) and comparing it with the title field of the returned API object from the Studio Ghibli (first) API request, also converted to lowercase.
- Perhaps a dropdown with all movie titles stored as entries, but this is probably counter-intuitive with the search feature that is present.
---

### APIs used:

- [Studio Ghibli API](https://ghibliapi.herokuapp.com/#section/Studio-Ghibli-API) - Public API library of the Studio Ghibli filmography
- [Giphy API](https://developers.giphy.com/docs/api/) - Giphy library with several endpoints *(account creation is required to obtain an API key)*

### License

    Copyright [2022] [Github/Bisdeep - Deep Biswas]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
