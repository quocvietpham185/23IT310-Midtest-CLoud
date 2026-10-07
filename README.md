# Quan ly Sach - Mid-term DTDTM

Ung dung Web Quan ly Sach trien khai tren Cloud: Node.js/Express + Handlebars,
MongoDB Atlas (2 tai khoan Read/Write rieng biet), stateless session luu tren Atlas,
va deploy 24/7 tren mot nen tang PaaS (Render).

- MSSV: `23IT310` -> Database: `DB_23IT310`
- Tien to ma san pham bat buoc: 3 ky tu cuoi MSSV = `310`
- VAT = chu so cuoi MSSV (`0`) + 6 = `6%`

## 1. Setup MongoDB Atlas (ban tu lam, theo huong dan sau)

1. Dang nhap https://cloud.mongodb.com, tao (hoac dung lai) mot Cluster mien phi (M0).
2. Vao **Database** > **Browse Collections** > **Create Database**, dat ten database la
   `DB_23IT310` (collection tao tam `books`, se duoc app tu tao lai khi insert).
3. Vao **Database Access** > **Add New Database User**, tao **2 user doc lap**:
   - `read_23IT310`
     - Authentication Method: Password
     - Database User Privileges: **Custom Role** hoac built-in role **"Read"** scoped
       chi tren database `DB_23IT310` (Add Specific Privilege -> `read` -> database
       `DB_23IT310`). Khong cho quyen ghi.
   - `write_23IT310`
     - Authentication Method: Password
     - Database User Privileges: role **"readWrite"** scoped chi tren database
       `DB_23IT310`. (Tai khoan nay dung de them sach va luu session, nen can ca
       doc lan ghi.)
4. Vao **Network Access** > **Add IP Address**, cho phep `0.0.0.0/0` (hoac IP cua Render)
   de app tren Cloud ket noi duoc.
5. Vao **Database** > **Connect** > **Drivers**, lay connection string cho tung user,
   roi thay `<password>` va them ten database `DB_23IT310` vao cuoi, vi du:

   ```
   mongodb+srv://read_23IT310:<password>@<cluster>.mongodb.net/DB_23IT310?retryWrites=true&w=majority
   mongodb+srv://write_23IT310:<password>@<cluster>.mongodb.net/DB_23IT310?retryWrites=true&w=majority
   ```

## 2. Chay local

```bash
npm install
cp .env.example .env
# Sua .env: dien MONGO_URI_READ, MONGO_URI_WRITE, SESSION_SECRET, ADMIN_USERNAME/PASSWORD
npm start
```

Mo http://localhost:3000 -> tu dong chuyen huong toi `/books`.

- `/books` (GET): danh sach sach - dung tai khoan **read-only**.
- `/login`: dang nhap bang `ADMIN_USERNAME` / `ADMIN_PASSWORD` trong `.env`.
- `/books/add` (sau khi dang nhap): them sach moi - dung tai khoan **readWrite**.
  Ma san pham phai bat dau bang tien to (3 ky tu cuoi MSSV), he thong tu tinh
  VAT va gia sau thue truoc khi luu xuong Atlas.

## 3. Kien truc

```
config/env.js     -> doc bien moi truong, tinh toan CODE_PREFIX va VAT_RATE tu MSSV
config/db.js      -> 2 ket noi Mongoose doc lap (readConnection, writeConnection)
models/Book.js    -> cung 1 schema, dang ky tren ca 2 connection (BookRead, BookWrite)
routes/books.js   -> GET dung BookRead, POST /add dung BookWrite
routes/auth.js    -> /login, /logout - demo dang nhap de gate /books/add
middleware/auth.js-> requireLogin, kiem tra req.session.isLoggedIn
app.js            -> wiring: handlebars, static, session (connect-mongo), routes
```

Session khong luu trong RAM may chu: `express-session` + `connect-mongo` luu
truc tiep xuong collection `sessions` tren Atlas (qua tai khoan write), nen
nhieu instance server (auto-scaling) co the dung chung mot session store ma
khong bi mat phien dang nhap.

## 4. Git workflow

Lich su nhanh:

```
main
 ├── feature/database  (dual Atlas connections + Book CRUD routes)
 ├── feature/session   (stateless session store + login gate)
 └── 2 merge commit (--no-ff) gop ca hai nhanh ve main, giu nguyen lich su
```

Xem bang lenh:

```bash
git log --oneline --graph --all
```

## 5. Dua len GitHub

```bash
git remote add origin <URL repo tren GitHub>
git push -u origin main
```

## 6. Deploy len Render (PaaS, chay 24/7)

1. Tao Web Service moi tren https://render.com, lien ket voi repo GitHub.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Vao tab **Environment**, khai bao cac bien (KHONG ghi truc tiep vao code):
   - `MONGO_URI_READ`
   - `MONGO_URI_WRITE`
   - `SESSION_SECRET`
   - `MSSV` = `23IT310`
   - `FULL_NAME` = `Pham Quoc Viet`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   - `PORT` (Render tu cung cap, co the bo qua)
5. Deploy. Render se tu build/start va giu app chay 24/7.
