import media from "../content/approved-media.json";
import news from "../content/approved-news.json";
export type ApprovedMedia={authorizationMode?:"source_policy";id:string;kind:"sermon"|"podcast"|"music";title:string;description:string;sourceUrl:string;creator:string|null;sourcePublishedAt:string|null;embedAllowed:boolean;publishedAt:string;approvalHash:string};
export type ApprovedNews={authorizationMode?:"source_policy";internalLinks?:{label:string;path:string}[];slug:string;title:string;description:string;intro:string;sections:{heading:string;paragraphs:string[];bullets:string[]}[];references:{label:string;href:string}[];sourcePublishedAt:string|null;publishedAt:string;approvalHash:string};
export const discoveredMedia=media as ApprovedMedia[];
export const newsArticles=news as ApprovedNews[];
export const musicVideos=discoveredMedia.filter(m=>m.kind==="music");
