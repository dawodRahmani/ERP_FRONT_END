hey claude.
i want you to make the audit part for me.
all files needs to be done in ts and cleaned and typed.
data, logic and styles need to be separated.
use idb. 
the logic can be in the appropriate file,depending on what it is e.g. /hooks /services and others.
"dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@primereact/types": "^11.0.0-alpha.1",
    "@tailwindcss/vite": "^4.1.18",
    "@tanstack/react-query": "^5.90.12",
    "@tanstack/react-query-devtools": "^5.91.1",
    "axios": "^1.13.2",
    "dotenv": "^17.2.3",
    "idb": "^8.0.3",
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

these are the dependencies i use for the project, use them whenever required.
should use the static data and be ready for api integration.

make component based.
when you are working in a page, for each page, create a folder and save the main file there and components of that file in that folder in /components folder.
and also make a readme file in that folder explaining briefly what that page does and also all the api request, response formats with guessed endpoint.

create audit management for me.

this is an excel file containing some formats.
(Templates Audit.xlsx)

in Geenral tab we have the Hact Assessment format and Donor Project Audit format.
also we have External tab which is used when the company hires someone from outside to do the audit.
we have Audit Type which should be dynamic.
we have Internal tab which is used when the company itself is doing the audit which is done by an audit employee.
and then we have the Partner tab which when the company audit its partners.

