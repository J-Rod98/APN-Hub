// Research destinations are hints, never source evidence or publication grants.
// Linked ministries were found on the organization's own website; availability
// and each individual item still need live verification before use.
export type ContentPlace = {
  id: string;
  name: string;
  url: string;
  categories: ("sermon"|"podcast"|"music"|"news"|"event"|"resource")[];
  use: string;
  ownerSelected: boolean;
  evidenceUrl: string;
  channelUrls?: string[];
  note?: string;
};
export const SOURCE_LIBRARY_CHECKED = "2026-11-17";
export const CONTENT_PLACES: ContentPlace[] = [
  {id:"upci",name:"United Pentecostal Church International",url:"https://upci.org/",categories:["news","event","resource"],use:"Official announcements, ministry updates and organizer leads.",ownerSelected:true,evidenceUrl:"https://upci.org/",channelUrls:["https://upci.org/feed/"]},
  {id:"wpf",name:"Worldwide Pentecostal Fellowship (WPF)",url:"https://www.gowpf.org/",categories:["sermon","news","event","resource"],use:"Official fellowship updates, PEAK and Summit recordings and organizer pages.",ownerSelected:true,evidenceUrl:"https://www.gowpf.org/peak",channelUrls:["https://www.youtube.com/channel/UCIm9eCuJJI6CTheqyom9rRA"],note:"WPFYouth is linked through recordings embedded on WPF’s PEAK page. Summit and event pages remain research leads; old conference dates are not upcoming events."},
  {id:"fpcnlr",name:"First Pentecostal Church North Little Rock (FPCNLR)",url:"https://www.fpcnlr.com/",categories:["sermon","music","event"],use:"Original church recordings, worship leads and church-organized events.",ownerSelected:true,evidenceUrl:"https://www.fpcnlr.com/",channelUrls:["https://www.youtube.com/channel/UCX04--akoLEFLut61MHWzoA"],note:"The standing sermon rule covers titles identifying preaching or services. Standalone music and events need their own scope."},
  {id:"aljc",name:"Assemblies of the Lord Jesus Christ (ALJC)",url:"https://aljc.org/",categories:["news","event","resource"],use:"Official organizational announcements and links to its own ministries and organizers.",ownerSelected:true,evidenceUrl:"https://aljc.org/",note:"Research approved. Its main RSS feed contained only a 2023 WordPress placeholder at the last check. No automatic news rule is enabled from that feed. Reject unrelated user-submitted conferences, even on this domain."},
  {id:"ibc",name:"Indiana Bible College",url:"https://www.youtube.com/channel/UC9LqUFa30B-v7nNve5FQNhg",categories:["music","sermon"],use:"Original IBC worship recordings; separately research teaching and school announcements.",ownerSelected:true,evidenceUrl:"https://www.youtube.com/channel/UC9LqUFa30B-v7nNve5FQNhg",channelUrls:["https://www.youtube.com/channel/UC9LqUFa30B-v7nNve5FQNhg"]},
  {id:"poa",name:"Pentecostals of Alexandria (POA)",url:"https://www.youtube.com/channel/UC_RdUg3ZoasAQ-cDJf72RrA",categories:["music","sermon"],use:"Original worship videos and possible preaching leads, keeping category scopes distinct.",ownerSelected:true,evidenceUrl:"https://www.youtube.com/channel/UC_RdUg3ZoasAQ-cDJf72RrA",channelUrls:["https://www.youtube.com/channel/UC_RdUg3ZoasAQ-cDJf72RrA"]},
  {id:"hear-harvest",name:"Hear the Harvest · Iowa District",url:"https://open.spotify.com/show/6JDPvDbLUUVx9Mh0F7rh4l",categories:["podcast"],use:"Original show episodes and accurate provider metadata, without reconstructing unheard conversations.",ownerSelected:true,evidenceUrl:"https://open.spotify.com/show/6JDPvDbLUUVx9Mh0F7rh4l",channelUrls:["https://open.spotify.com/show/6JDPvDbLUUVx9Mh0F7rh4l"]},
  {id:"hope-corps",name:"Hope Corps",url:"https://www.hopecorps.net/",categories:["news","event","resource"],use:"Possible training, missions and service opportunities; verify details on current program pages.",ownerSelected:false,evidenceUrl:"https://www.gowpf.org/"},
  {id:"apostolic-bq",name:"Apostolic Bible Quizzing",url:"https://www.apostolicbq.com/",categories:["event","resource"],use:"Possible Bible quizzing schedules, study references and youth resources.",ownerSelected:false,evidenceUrl:"https://www.gowpf.org/"},
  {id:"together",name:"Together Magazine",url:"https://www.togethermagazineonline.com/",categories:["news","resource"],use:"Possible fellowship features and source-linked reporting leads. Do not copy magazine articles or images.",ownerSelected:false,evidenceUrl:"https://www.gowpf.org/"},
  {id:"aljc-students",name:"ALJC Student Ministries",url:"https://studentministries.org/",categories:["event","news","resource"],use:"Possible official youth events and ministry announcements; verify organizer, year and venue.",ownerSelected:false,evidenceUrl:"https://aljc.org/"},
  {id:"apostolic-witness",name:"The Apostolic Witness",url:"https://apostolicwitness.com/",categories:["news","resource"],use:"ALJC-linked publication for research and original attributed briefs, subject to dated article evidence.",ownerSelected:false,evidenceUrl:"https://aljc.org/",note:"The checked feed exposed only an entry named Last Issue; current article availability needs verification."},
];
export function researchPlaces(category?: string) {
  return CONTENT_PLACES.filter(p=>!category||p.categories.some(c=>c===category)).map(p=>({name:p.name,url:p.url,use:p.use,note:p.note,ownerSelected:p.ownerSelected}));
}
