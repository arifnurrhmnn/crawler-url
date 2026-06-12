import axios from "axios";
import * as cheerio from "cheerio";

const DOMAIN = "https://www.danamon.co.id";

const START_URLS = [
  `${DOMAIN}/id`,
  `${DOMAIN}/en`
];

function normalize(url) {
  return url
    .split("#")[0]
    .split("?")[0]
    .replace(/\/$/, "");
}

export default async function handler(req, res) {

  const visited = new Set();
  const queue = [...START_URLS];

  const MAX_URLS = 3000;

  while (queue.length > 0) {

    const current = queue.shift();

    if (visited.has(current))
      continue;

    visited.add(current);

    console.log(
      `[${visited.size}] ${current}`
    );

    if (visited.size >= MAX_URLS)
      break;

    try {

      const response =
        await axios.get(current, {
          timeout: 10000,
          headers: {
            "User-Agent":
              "Mozilla/5.0"
          }
        });

      const $ = cheerio.load(
        response.data
      );

      $("a[href]").each((i, el) => {

        let href =
          $(el).attr("href");

        if (!href)
          return;

        if (
          href.startsWith("mailto:")
        )
          return;

        if (
          href.startsWith("tel:")
        )
          return;

        const absolute =
          normalize(
            new URL(
              href,
              current
            ).toString()
          );

        if (
          !absolute.startsWith(
            DOMAIN
          )
        )
          return;

        if (
          absolute.includes(
            "/sitecore/"
          )
        )
          return;

        if (
          !visited.has(
            absolute
          )
        ) {
          queue.push(
            absolute
          );
        }

      });

    } catch (e) {
      console.log(
        "ERROR",
        current
      );
    }
  }

  res.status(200).json({
    total: visited.size,
    urls: [...visited].sort()
  });
}
