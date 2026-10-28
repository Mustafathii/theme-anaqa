# Selas (سيلاس)

A Salla Twilight theme for fashion & beauty stores. It is based on Salla's open-source [Theme Raed](https://github.com/SallaApp/theme-raed) (MIT).

## Develop
```bash
pnpm install
salla login            # once, in your own terminal
salla theme preview    # live preview on a demo store
```
Build only: `pnpm production` (output goes to `public/`).

## Custom home sections
| Section | Twig | Notes |
|---|---|---|
| Editorial Hero | `src/views/components/home/editorial-hero.twig` | Desktop and mobile images, eyebrow, title, CTA |
| Category Stories | `src/views/components/home/category-stories.twig` | Instagram-style category rings |
| Flash Discount | `src/views/components/home/flash-discount.twig` | Required by Salla review. Shows the store's offers with a countdown and hides itself after the end date (`home.js → initFlashDiscount`) |
| Shop the Look | `src/views/components/home/shop-the-look.twig` | Portrait look image plus up to 4 products |

Styles: `src/assets/styles/04-components/anaqa-home.scss`. Strings: `src/locales/{ar,en}.json → blocks.home.*`.

## Before publishing
Fill the `TODO` values in `twilight.json` (repository, author_email, support_url) and `package.json` (author).

## Review notes: remaining `|raw`
Salla's technical review searches for `|raw`. Ten of Raed's 17 uses were removed (`b61a80d`, `4389288`). The 7 below stay because Salla sends these values as HTML, and escaping them would show tags as text:

| File | Value | Why it must render HTML |
|---|---|---|
| `pages/product/single.twig` (×2) | `product.description` | Rich-text product description from the dashboard editor |
| `pages/blog/single.twig` | `article.body` | Rich-text blog article |
| `pages/page-single.twig` | `page.content` | Rich-text content page |
| `pages/cart.twig` | free-shipping message | Contains `|money` output, which is HTML (SAR symbol) |
| `pages/thank-you.twig` | `order.instructions` | Payment instructions (for example bank transfer) with formatting |
| `pages/customer/orders/single.twig` | `order.refund_message` | Platform-generated refund notice |

None of these accept free HTML from a theme setting or component, which is the other thing the review checks.
