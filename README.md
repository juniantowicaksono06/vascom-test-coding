## Tes Coding Vastcomm

Di tes ini saya menggunakan Express (API) dan Laravel (Web) dan saya juga menggunakan Docker

## Environment

Berikut adalah environment yang perlu di setup sebelum menjalankan tes saya

/.mysql_env
```bash
MYSQL_ROOT_PASSWORD=Abcd1234 # Password untuk setup MySQL
```

/api/.env
```bash
PORT=5000
DB_USER=root # For Database Username Authentication
DB_PASS=Abcd1234 # For Database Password Authentication
DB_HOST=mysql # For Database Password Authentication
DB_PORT=3306 # For Database Port
DB_NAME=my_app # Database name
JWT_SECRET_KEY=f85d1e1fba942dfbb47e84229d8ca938c80ad27095675210f70dadfe9e7d41de

MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER="" # Email yang akan digunakan untuk mengirim email
MAIL_PASS="" # Isi dengan password email


SECRET_KEY=cbc8fc860c02f60df11dfbaa13c8a73fd9ae320bbf3df12bfe3c37b19f507a0e # Secret key untuk enkripsi dan dekripsi
IV=v1NFBMEX9bG3Uc4m # IV untuk enkripsi dan dekripsi
```


/web/.env
```bash
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:Rs1tCd2W76ziMl3++7zz3dEwHvXSbsULqElr5S0wLXw=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"



VITE_HMR_HOST=192.168.100.2

VITE_API_BASE_URL=http://192.168.100.2:5002 # IP untuk Vite server


JWT_SECRET_KEY=f85d1e1fba942dfbb47e84229d8ca938c80ad27095675210f70dadfe9e7d41de
SECRET_KEY=cbc8fc860c02f60df11dfbaa13c8a73fd9ae320bbf3df12bfe3c37b19f507a0e
IV=v1NFBMEX9bG3Uc4m
```

## Run Aplikasi Web

Untuk menjalanakan web nya dapat menggunakan command

```bash
docker-compose up -d
```

Setelah itu bisa melakukan proses migration dengan cara

```bash
docker-compose exec express npx sequelize db:migrate
```

Lalu bisa lanjut melakukan seeder

```bash
docker-compose exec express npx sequelize db:seed:all
```

## API Dokumentasi

Untuk dokumentasi API nya bisa dilihat di link berikut
https://documenter.getpostman.com/view/13058066/2sA2rCUMYP