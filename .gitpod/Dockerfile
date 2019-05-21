FROM php:7.3-apache

RUN apt-get update && apt-get install -y cron git-core jq unzip vim zip \
  libjpeg-dev libpng-dev libpq-dev libsqlite3-dev libwebp-dev libzip-dev && \
  rm -rf /var/lib/apt/lists/* && \
  docker-php-ext-configure zip --with-libzip && \
  docker-php-ext-configure gd --with-png-dir --with-jpeg-dir --with-webp-dir && \
  docker-php-ext-install exif gd mysqli opcache pdo_pgsql pdo_mysql zip

RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
  } > /usr/local/etc/php/conf.d/docker-oc-opcache.ini

RUN { \
    echo 'log_errors=on'; \
    echo 'display_errors=off'; \
    echo 'upload_max_filesize=32M'; \
    echo 'post_max_size=32M'; \
    echo 'memory_limit=128M'; \
  } > /usr/local/etc/php/conf.d/docker-oc-php.ini

RUN pecl install xdebug

RUN { \
    echo "#zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" ; \
    echo 'xdebug.remote_enable=on'; \
    echo 'xdebug.remote_autostart=off'; \
    echo 'xdebug.remote_host=host.docker.internal'; \
  } > /usr/local/etc/php/conf.d/docker-xdebug-php.ini

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
  /usr/local/bin/composer global require hirak/prestissimo

RUN a2enmod rewrite

COPY config/docker /usr/src/octobercms-config-docker

ENV OCTOBERCMS_TAG develop
ENV OCTOBERCMS_DEVELOP_CHECKSUM e7ca6f6c6651cfb040f73c5a6dc3ea0633345e17
ENV OCTOBERCMS_DEVELOP_COMMIT a9e198c8b4e4eaee2438cd89d2e3d6e3e6e93bd5

RUN git clone https://github.com/octobercms/october.git -b $OCTOBERCMS_TAG . && \
  composer install --no-interaction --prefer-dist --no-scripts && \
  composer clearcache && \
  git status && git reset --hard HEAD && \
  echo 'APP_ENV=docker' > .env && \
  mv /usr/src/octobercms-config-docker config/docker && \
  echo 'config/docker' >> .git/info/exclude && \
  touch storage/database.sqlite && \
  chmod 666 storage/database.sqlite && \
  php artisan october:up && \
  php artisan plugin:install october.drivers && \
  chown -R www-data:www-data /var/www/html && \
  find . -type d \( -path './plugins' -or  -path './storage' -or  -path './themes' -or  -path './plugins/*' -or  -path './storage/*' -or  -path './themes/*' \) -exec chmod g+ws {} \;

RUN echo "* * * * * /usr/local/bin/php /var/www/html/artisan schedule:run > /proc/1/fd/1 2>/proc/1/fd/2" > /etc/cron.d/october-cron && \
  crontab /etc/cron.d/october-cron

RUN echo 'exec php artisan "$@"' > /usr/local/bin/artisan && \
  echo 'exec php artisan tinker' > /usr/local/bin/tinker && \
  echo '[ $# -eq 0 ] && exec php artisan october || exec php artisan october:"$@"' > /usr/local/bin/october && \
  sed -i '1s;^;#!/bin/bash\n[ "$PWD" != "/var/www/html" ] \&\& echo " - Helper must be run from /var/www/html" \&\& exit 1\n;' /usr/local/bin/artisan /usr/local/bin/tinker /usr/local/bin/october && \
  chmod +x /usr/local/bin/artisan /usr/local/bin/tinker /usr/local/bin/october

COPY docker-oc-entrypoint /usr/local/bin/

ENTRYPOINT ["docker-oc-entrypoint"]
CMD ["apache2-foreground"]
