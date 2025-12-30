Entire Refactor.
migrate this file to typescript, cleaned and typed.
separate the logic, data (static), and style.
store the static data in /data folder.
store the logic related codes in appropriate folder. e.g. /hooks /services /schemas and others.
create a folder for this page and inside it save the main file and make a components folder and save the components there.
eliminate the use of idb (indexedDb) and store the static data in /data folder. 
also make a readme file there and inside it briefly describe what the page does and also describe all the formats of request and response and guessed api endpoint to be used for api integration later.
"dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@primereact/types": "^11.0.0-alpha.1",
    "@tailwindcss/vite": "^4.1.18",
    "@tanstack/react-query": "^5.90.12",
    "@tanstack/react-query-devtools": "^5.91.1",
    "axios": "^1.13.2",
    "dotenv": "^17.2.3",
    "lucide-react": "^0.561.0",
    "primeicons": "^7.0.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-hook-form": "^7.68.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.10.1",
    "sonner": "^2.0.7",
    "tailwindcss": "^4.1.18",
    "zod": "^4.2.1",
    "zustand": "^5.0.9"
  }

use this dependencies to refactor the code.
if they were required and not used, use them.
make it ready to integrate to the api later.