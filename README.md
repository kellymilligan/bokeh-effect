## Install and usage

Ensure you've got [node/npm](https://nodejs.org/en/) installed.

#### 1.
```
npm install
```

#### 2. 
```
npm run dev
```

---

#### To make available at your local network IP:
```
npm run host 192.168.X.XXX
```
Where the IP number is your local network IP. Other devices on the same network can then access at `http://192.168.X.XXX:8080` 

---

#### When ready for production:
```
npm run build
```
Then you can put the `/dist` directory where you need it

---