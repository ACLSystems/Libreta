FROM nginx:latest

RUN echo "America/Mexico_City" > /etc/timezone
RUN rm /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata

RUN addgroup --gid 666 radiohead 
RUN adduser --uid 666 --gid 666 --shell /bin/bash --disabled-login --no-create-home --gecos "" dummy

COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R dummy:radiohead /etc/nginx

RUN chmod 750 -R /etc/nginx

RUN chown -R dummy:radiohead /var/log/nginx && chmod 750 /var/log/nginx
RUN chown -R dummy:radiohead /var/cache/nginx && chmod 750 /var/cache/nginx
RUN chown -R dummy:radiohead /usr/sbin/nginx && chmod 750 /usr/sbin/nginx
RUN chown -R dummy:radiohead /usr/lib/nginx && chmod 750 /usr/lib/nginx
RUN chown -R dummy:radiohead /usr/share/doc/nginx && chmod 750 /usr/share/doc/nginx
RUN chown -R dummy:radiohead /usr/share/nginx && chmod 750 /usr/share/nginx
RUN chown -R dummy:radiohead /etc/default/nginx && chmod 750 /etc/default/nginx
RUN chown -R dummy:radiohead /etc/init.d/nginx && chmod 750 /etc/init.d/nginx
RUN chown -R dummy:radiohead /etc/logrotate.d/nginx && chmod 750 /etc/logrotate.d/nginx
RUN chown -R dummy:radiohead /etc/nginx && chmod 750 /etc/nginx
RUN chown -R dummy:radiohead /run && chmod 750 /run
WORKDIR /usr/share/nginx/html

COPY dist/libreta/ .

USER dummy


