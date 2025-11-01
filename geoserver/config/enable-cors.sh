#!/bin/bash

# Wait for GeoServer to be fully started
echo "Waiting for GeoServer to start..."
while ! curl -s http://localhost:8080/geoserver/web/ > /dev/null; do
    sleep 2
done

echo "GeoServer is up! Configuring CORS..."

# Add CORS filter to web.xml if not already present
WEB_XML="/usr/local/tomcat/webapps/geoserver/WEB-INF/web.xml"

if ! grep -q "CorsFilter" "$WEB_XML"; then
    echo "Adding CORS filter to web.xml..."

    # Create backup
    cp "$WEB_XML" "${WEB_XML}.backup"

    # Add CORS filter before the first filter-mapping or servlet
    sed -i '/<web-app/a\
    <!-- CORS Filter -->\
    <filter>\
        <filter-name>CorsFilter</filter-name>\
        <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>\
        <init-param>\
            <param-name>cors.allowed.origins</param-name>\
            <param-value>*</param-value>\
        </init-param>\
        <init-param>\
            <param-name>cors.allowed.methods</param-name>\
            <param-value>GET,POST,HEAD,OPTIONS,PUT,DELETE</param-value>\
        </init-param>\
        <init-param>\
            <param-name>cors.allowed.headers</param-name>\
            <param-value>*</param-value>\
        </init-param>\
        <init-param>\
            <param-name>cors.exposed.headers</param-name>\
            <param-value>Access-Control-Allow-Origin,Access-Control-Allow-Credentials</param-value>\
        </init-param>\
        <init-param>\
            <param-name>cors.support.credentials</param-name>\
            <param-value>true</param-value>\
        </init-param>\
    </filter>\
    <filter-mapping>\
        <filter-name>CorsFilter</filter-name>\
        <url-pattern>/*</url-pattern>\
    </filter-mapping>' "$WEB_XML"

    echo "CORS filter added. Reloading GeoServer webapp..."
    curl -u admin:geoserver -X POST "http://localhost:8080/geoserver/rest/reload" -H "Content-Type: application/json"

    echo "CORS configuration complete!"
else
    echo "CORS filter already configured."
fi