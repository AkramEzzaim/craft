# Crochet demo content review

The five new crochet tutorials are original editorial demos and remain `status: "draft"`. They appear in local development for testing and stay hidden from production pages, search, and `sitemap.xml` until a human reviews them. The existing strawberry coaster draft has the same status.

| Pattern | Image | Review focus |
| --- | --- | --- |
| Easy Crochet Flower | `public/images/patterns/easy-crochet-flower.png` | Count five petals and confirm the two-stitch repeat. |
| Beginner Granny Square | `public/images/patterns/beginner-granny-square.png` | Verify corner and side spaces after each round. |
| Simple Crochet Heart | `public/images/patterns/simple-crochet-heart.png` | Confirm the shape, stitch terminology, and final size. |
| Easy Crochet Coaster | `public/images/patterns/easy-crochet-coaster.png` | Check round counts, flatness, and cup stability. |
| Beginner Crochet Tote Bag | `public/images/patterns/beginner-crochet-tote-bag.png` | Make a sample to verify yarn use, measurements, seams, and strap strength. |

These five local images were generated for this project. They are illustrative, not photographs of finished items made from the exact written instructions. Compare each image with a tested sample and replace it if it misrepresents the final pattern. Keep descriptive `imageAlt` text aligned with any replacement.

Before publishing any tutorial:

1. Make the item from the written instructions, checking stitch counts, materials, gauge, dimensions, and safety notes.
2. Correct the article and photo where the sample differs.
3. Check the article title, metadata, internal related links, and the `GET FREE PATTERN` modal on mobile and desktop.
4. Change the reviewed file's `status` to `published`, then run `npm run check:content` and `npm run build`.
5. Confirm the published URL appears in `sitemap.xml`. The signup API will accept it in production only after publication.

The signup modal receives the current article's slug and title from the article page. The browser sends those values plus the current URL and UTM parameters to `/api/subscribe`. The server looks up the slug and uses the trusted Markdown title when forwarding to `N8N_LEAD_WEBHOOK_URL`.
