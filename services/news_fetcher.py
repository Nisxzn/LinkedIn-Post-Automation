import requests
import xml.etree.ElementTree as ET

def fetch_ai_news(query="artificial intelligence"):
    try:
        # Use Google News RSS feed - no API key needed
        url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            print(f"Error fetching RSS: {response.status_code}")
            return []

        # Parse RSS XML
        # RSS has a lot of namespaces sometimes, but for titles/links it's standard.
        root = ET.fromstring(response.content)
        articles = []
        
        # RSS items are under channel/item
        # We look for all <item> tags
        for item in root.findall(".//item")[:5]:
            title_node = item.find("title")
            link_node = item.find("link")
            
            title = title_node.text if title_node is not None else "No Title"
            link = link_node.text if link_node is not None else "#"
            
            articles.append({
                "title": title,
                "url": link
            })
            
        return articles
    except Exception as e:
        print(f"Exception in fetch_ai_news RSS: {e}")
        return []