
## Features

- Settings [FontSize | PageSize | Timestamp]
- Personal Chat API with colors / commands / messages.
- Possible hex color, exemple: ```{ff0000}text```




## Installation

Go to ```frontend``` folder and use this command:

```bash
npm install
```

After installation you can go to the index.js file and make the following changes:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App_Rage from './rage/Chat';
import App_Alt from './altv/Chat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App_Rage /> /* -- PUT RAGE or ALT: Exemple: <App_Alt /> -- */
  </React.StrictMode>
);

```

At the end you can use the command for start / build project:
```bash
npm run start
npm run build
```


## FAQ

#### It's altv version?

It is structured and arranged for the altv version as well as for the RAGE.MP version.

#### Do I have to keep the credits?

There is no need to keep the credits, it is your choice if you respect the work of this project.


## Support

For support, email adrian.tandara05@gmail.com or add on discord ``` Adrian_#6651```.

