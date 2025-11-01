#!/usr/bin/env python3
import xml.etree.ElementTree as ET
import sys

# Parse the web.xml file
web_xml_path = "/opt/apache-tomcat-9.0.82/webapps/geoserver/WEB-INF/web.xml"

try:
    tree = ET.parse(web_xml_path)
    root = tree.getroot()

    # Check if CorsFilter already exists
    ns = {'ns': 'http://xmlns.jcp.org/xml/ns/javaee'}
    existing_filter = root.find('.//ns:filter[ns:filter-name="CorsFilter"]', ns)

    if existing_filter is not None:
        print("CORS filter already exists")
        sys.exit(0)

    # Create CORS filter element
    cors_filter = ET.Element('filter')

    filter_name = ET.SubElement(cors_filter, 'filter-name')
    filter_name.text = 'CorsFilter'

    filter_class = ET.SubElement(cors_filter, 'filter-class')
    filter_class.text = 'org.apache.catalina.filters.CorsFilter'

    # Add init params
    params = [
        ('cors.allowed.origins', '*'),
        ('cors.allowed.methods', 'GET,POST,HEAD,OPTIONS,PUT,DELETE'),
        ('cors.allowed.headers', '*'),
        ('cors.exposed.headers', 'Access-Control-Allow-Origin,Access-Control-Allow-Credentials'),
        ('cors.support.credentials', 'true'),
        ('cors.preflight.maxage', '3600')
    ]

    for param_name, param_value in params:
        init_param = ET.SubElement(cors_filter, 'init-param')
        pname = ET.SubElement(init_param, 'param-name')
        pname.text = param_name
        pvalue = ET.SubElement(init_param, 'param-value')
        pvalue.text = param_value

    # Insert filter at the beginning
    root.insert(0, cors_filter)

    # Create filter-mapping
    cors_mapping = ET.Element('filter-mapping')
    mapping_name = ET.SubElement(cors_mapping, 'filter-name')
    mapping_name.text = 'CorsFilter'
    url_pattern = ET.SubElement(cors_mapping, 'url-pattern')
    url_pattern.text = '/*'

    # Insert filter-mapping after all filters
    filter_count = len(root.findall('.//filter', ns)) if ns else len(root.findall('.//filter'))
    root.insert(filter_count, cors_mapping)

    # Write back
    tree.write(web_xml_path, encoding='utf-8', xml_declaration=True)
    print("CORS filter added successfully!")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)