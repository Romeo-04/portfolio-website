import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url, lastModified: new Date(), priority: 1 }];
}
