import "lite-youtube-embed";
import BasePage from "./base-page";
import Lightbox from "fslightbox";
window.fslightbox = Lightbox;

class Home extends BasePage {
    onReady() {
        this.initFeaturedTabs();
        this.initFlashDiscount();
    }

    /**
     * used in views/components/home/flash-discount.twig
     * Merchant types the end date as YYYY-MM-DD. salla-count-down reads that format as Riyadh time and, with
     * end-of-day, counts to 23:59:59 (its docs claim "MMM DD, YYYY HH:mm:ss", but the component rejects it).
     * Here we only hide the section once that moment has passed.
     */
    initFlashDiscount() {
        app.all('[data-flash-ends]', timer => {
            const raw = (timer.dataset.flashEnds || '').trim();
            const end = new Date(`${raw}T23:59:59+03:00`);
            const block = timer.closest('.anaqa-flash');

            if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || isNaN(end.getTime())) {
                return app.log(`Flash discount: invalid end date "${raw}"`);
            }
            if (end <= new Date()) {
                return block && (block.hidden = true);
            }

            const countDown = document.createElement('salla-count-down');
            countDown.setAttribute('date', raw);
            countDown.setAttribute('end-of-day', 'true');
            countDown.setAttribute('boxed', 'true');
            countDown.setAttribute('labeled', 'true');
            countDown.setAttribute('size', 'sm');
            countDown.setAttribute('end-text', timer.dataset.endText || '');
            timer.appendChild(countDown);
        });
    }

    /**
     * used in views/components/home/featured-products-style*.twig
     */
    initFeaturedTabs() {
        app.all('.tab-trigger', el => {
            el.addEventListener('click', ({ currentTarget: btn }) => {
                let id = btn.dataset.componentId;
                // btn.setAttribute('fill', 'solid');
                app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'is-active opacity-0 translate-y-3', 'inactive', tab => tab.id == btn.dataset.target)
                    .toggleClassIf(`#${id} .tab-trigger`, 'is-active', 'inactive', tabBtn => tabBtn == btn);

                // fadeIn active tabe
                setTimeout(() => app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'opacity-100 translate-y-0', 'opacity-0 translate-y-3', tab => tab.id == btn.dataset.target), 100);
            })
        });
        document.querySelectorAll('.s-block-tabs').forEach(block => block.classList.add('tabs-initialized'));
    }
}

Home.initiateWhenReady(['index']);