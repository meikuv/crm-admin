ARG RUNTIME_IMAGE
 
FROM ${RUNTIME_IMAGE}
 
COPY nginx_static/ /usr/share/nginx/html
