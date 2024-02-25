#!/bin/bash

target_dir="/var/www/html/package.json"

if [ -f $target_dir ]; then
    echo "Serving Folder is not empty running PHP Artisan"
    composer install
    npm install
else
    echo "Serving Folder is empty creating laravel from scratch"
    cd /var/www/ && composer create-project laravel/laravel html
    cd /var/www/html && composer require inertiajs/inertia-laravel
    cd /var/www/html && composer require firebase/php-jwt
    php artisan inertia:middleware
    npm install @inertiajs/inertia-react @inertiajs/react @vitejs/plugin-react react react-dom vite react-image-crop react-bootstrap formik yup redux react-sweetalert2 react-spinners react-redux @types/react-dom
    npm i --save-dev sass laravel-vite-plugin @types/node
fi

cd /var/www/html && npm run dev & disown
cd /var/www/html && php artisan serve --host=0.0.0.0