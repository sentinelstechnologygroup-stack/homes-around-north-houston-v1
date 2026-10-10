export const BROKERAGE = {
  name: "Golden Cross Realty", broker: "Jonathan Currey",
  phone: "(936) 537-0568", phoneHref: "tel:+19365370568",
  email: "Broker@GoldenCrossRealty.com",
  iabs: "https://goldencrossrealty.net/documents/golden-cross-realty-iabs.pdf",
  consumerNotice: "https://goldencrossrealty.net/documents/trec-consumer-protection-notice.pdf",
};
export const TECHNOLOGY_DISCLOSURE = "This website is powered by Golden Marketing Services, a marketing and technology company. Golden Marketing Services provides the website, search tools, and technology infrastructure only. All real estate brokerage services referenced on this site are provided exclusively by Golden Cross Realty, with Jonathan Currey as the broker contact. Golden Marketing Services does not provide real estate brokerage services.";
export const HAR_SEARCH = "https://www.har.com/idx/mls/search?sitetype=aws&cid=605032&allmls=y&for_sale=1&mlsorgid=1";
export const HAR_MARKET_REPORTS = "https://www.har.com/content/department/newsroom?pid=640";
export function buildHarSearchUrl({ city = "", zip = "", neighborhood = "", minPrice = "", maxPrice = "" } = {}) {
  const params = new URLSearchParams({ sitetype: "aws", cid: "605032", allmls: "y", mlsorgid: "1", for_sale: "1" });
  if (city.trim()) params.set("city", city.trim());
  if (zip.trim()) params.set("zip_code", zip.trim());
  if (neighborhood.trim()) params.set("subdivisions", neighborhood.trim());
  if (minPrice) params.set("listing_price_min", minPrice);
  if (maxPrice) params.set("listing_price_max", maxPrice);
  return `https://www.har.com/idx/mls/listing?${params.toString()}`;
}
