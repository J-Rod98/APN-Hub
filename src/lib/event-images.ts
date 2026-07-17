import type { AppEvent } from "./types";

type EventImage = Pick<
  AppEvent,
  "image_url" | "image_alt" | "image_credit" | "image_credit_url"
>;

// These images remain hosted by the original ministries. Event-specific art is
// preferred; category images are only used when the organizer has not supplied
// an event image for the public catalog.
export const eventImage = {
  juniorBibleQuiz: {
    image_url:
      "https://lifechristianchurch.org/wp-content/uploads/2025/08/Bible-Quizzing-Team-Lansing-MI-1.jpg",
    image_alt:
      "Young Apostolic Pentecostal Bible quizzers at the North American Junior Bible Quiz Tournament.",
    image_credit: "Photo courtesy of Life Christian Church",
    image_credit_url:
      "https://lifechristianchurch.org/2025/08/14/jr-bible-quizzing-team-in-lansing-mi-wins-national-championship/",
  },
  formed2026: {
    image_url:
      "https://d2q846bclm63a8.cloudfront.net/media/uploads/pagebuilder/788328/jAF2Hh6BjPC5DuE2wLMV2a.jpeg.jpeg",
    image_alt: "Formed 2026 online conference artwork.",
    image_credit: "Graphic courtesy of Formed 2026",
    image_credit_url: "https://formed.upci.org/",
  },
  generalConference2026: {
    image_url:
      "https://www.upcigc.net/wp-content/uploads/2026/07/GC-2026-Social-Media-V1IG-Post-Horizontal.png",
    image_alt: "UPCI General Conference 2026 artwork.",
    image_credit: "Graphic courtesy of UPCI General Conference",
    image_credit_url: "https://www.upcigc.net/",
  },
  conference: {
    image_url: "https://upci.org/wp-content/uploads/2022/04/UPCI_Home_Slider4.jpg",
    image_alt: "Apostolic worship leaders at a UPCI gathering.",
    image_credit: "Photo courtesy of UPCI",
    image_credit_url: "https://upci.org/",
  },
  revival: {
    image_url: "https://upci.org/wp-content/uploads/2022/08/SOC-Rally.png",
    image_alt: "Young people praying at a UPCI Save Our Children rally.",
    image_credit: "Photo courtesy of UPCI Children's Ministries",
    image_credit_url: "https://upci.org/soc-rally-report/",
  },
  youthRally: {
    image_url: "https://upci.org/wp-content/uploads/2023/07/NAYC-Photos.png",
    image_alt: "Students praying together at North American Youth Congress.",
    image_credit: "Photo courtesy of UPCI Youth Ministries",
    image_credit_url: "https://upci.org/events/",
  },
} satisfies Record<string, EventImage>;

const categoryFallbackImage: Record<string, EventImage> = {
  "Bible Study": eventImage.juniorBibleQuiz,
  Conference: eventImage.conference,
  Revival: eventImage.revival,
  "Youth Rally": eventImage.youthRally,
};

export function resolveEventImage(event: AppEvent): EventImage {
  if (event.image_url) {
    return {
      image_url: event.image_url,
      image_alt: event.image_alt,
      image_credit: event.image_credit ?? null,
      image_credit_url: event.image_credit_url ?? null,
    };
  }

  return categoryFallbackImage[event.category ?? ""] ?? {
    image_url: null,
    image_alt: null,
    image_credit: null,
    image_credit_url: null,
  };
}
