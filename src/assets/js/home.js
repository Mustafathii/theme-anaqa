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
     * Merchant types the end date as YYYY-MM-DD (Riyadh time); salla-count-down wants "MMM DD, YYYY HH:mm:ss".
     * The Twig `date` filter is localized, so the conversion happens here instead.
     */
    initFlashDiscount() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const pad = n => String(n).padStart(2, '0');

        app.all('[data-flash-ends]', timer => {
            const raw = (timer.dataset.flashEnds || '').trim();
            const end = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T23:59:59+03:00` : raw);
            const block = timer.closest('.anaqa-flash');

            if (isNaN(end.getTime())) {
                return app.log(`Flash discount: invalid end date "${raw}"`);
            }
            if (end <= new Date()) {
                return block && (block.hidden = true);
            }

            const countDown = document.createElement('salla-count-down');
            countDown.setAttribute('date', `${months[end.getMonth()]} ${pad(end.getDate())}, ${end.getFullYear()} ${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`);
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