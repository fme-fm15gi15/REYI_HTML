# 用 Nginx 伺服器托管靜態檔案
FROM nginx:alpine

# 移除 Nginx 預設頁面
RUN rm -rf /usr/share/nginx/html/*

# 把專案所有靜態檔案複製進去
COPY . /usr/share/nginx/html

# Cloud Run 預設使用 8080 port
EXPOSE 8080

# 覆寫 Nginx 設定，監聽 8080
RUN printf 'server {\n\
    listen 8080;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
