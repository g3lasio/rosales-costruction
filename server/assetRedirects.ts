import type { Express } from "express";

// The previous development environment served site photography from
// /manus-storage/* through a proxy that does not exist on Railway. The
// files now live in client/public/images, so any cached HTML, social
// preview, or bookmarked URL that still points at an old key is sent to
// the permanent location instead of failing.
export const legacyAssetRedirects: Record<string, string> = {
  "124_Diseno-sin-titulo-3-e1729819973975_461b5f1f.png": "/images/rosales-logo.png",
  "244_Pavers-e1763091483640_ac92b920.jpg": "/images/paver-driveway-hero.webp",
  "236_10-1_d74f095c.jpg": "/images/synthetic-turf-garden.webp",
  "385_Granite-Stone-Walls-768x514-1_2616c85c.jpg": "/images/granite-retaining-wall.webp",
  "200_d0b50ef0-cd50-4617-8d15-3768c781c6c7_1b0a175f.webp": "/images/concrete-patio-process.webp",
  "245_Cinder-Block-Retaining-Walls_328b98c6.png": "/images/block-retaining-wall.webp",
  "209_4bf2e5d0-ae9a-422e-a2d3-79264ce55430_8ea60a68.webp": "/images/flagstone-patio.webp",
  "211_7579fa85-a37e-4d88-99fb-a8337440db8a_b7ce47b9.webp": "/images/outdoor-kitchen-masonry.webp",
  "239_8-2_91ff976f.jpg": "/images/wood-deck-steps.webp",
  "240_2-2_34a7691b.jpg": "/images/wood-fence.webp",
  "238_1-2_a7794375.jpg": "/images/landscape-path-planting.webp",
  "235_f4ab67a5-5ce3-4c97-a93a-043d7a9f7b9e_b565dc87.jpg": "/images/drainage-trench.webp",
  "202_WhatsApp-Image-2023-09-25-at-3.45.51-PM-1_7279c823.webp": "/images/garden-walkway.webp",
  "rosales-front-approach-before_9874bcc0.webp": "/images/front-approach-before.webp",
  "rosales-front-approach-after_26077194.webp": "/images/front-approach-after.webp",
};

export function registerLegacyAssetRedirects(app: Express) {
  app.get("/manus-storage/:key", (req, res, next) => {
    const destination = legacyAssetRedirects[req.params.key];
    if (destination) return res.redirect(301, destination);
    next();
  });
}
