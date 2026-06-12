import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);

  async function start() {
    setLoading(true);

    const res = await fetch("/api/crawl");
    const data = await res.json();

    setUrls(data.urls || []);
    setLoading(false);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Danamon Sitemap Crawler</h1>

      <button onClick={start}>
        Start Crawl
      </button>

      {loading && <p>Crawling...</p>}

      <p>Total URL: {urls.length}</p>

      <textarea
        style={{
          width: "100%",
          height: "500px"
        }}
        value={urls.join("\n")}
        readOnly
      />
    </div>
  );
}
