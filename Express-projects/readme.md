### Basic Setup Steps for Express server
1. Create a new directory for your project and navigate into it:
   ```bash
   mkdir express-project
   cd express-project
   ```

2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

3. Install Express:
```bash
npm install express
```

4. Run this in the bash to automatically start the server whenever you make changes to `server.js`:
```bash
npm install -g nodemon
```

5. Create a new file named `server.js` and add the following code to set up a basic Express server:
   ```javascript
   const express = require('express');
   const app = express();
   const port = 3000;

   app.get('/', (req, res) => {
     res.send('Hello, World!');
   });

   app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
   });
   ```
6. Add a start script to your `package.json` file:
   ```json
   "scripts": {
     "start": "nodemon server.js",
     "dev": "nodemon server.js"
   }
   ``` 

7. Start the server using nodemon:
   ```bash
   npm run dev
   ```