import './news.css';
import { Article } from '../../../types';
import { getElement } from '../../../utils/dom';

const MAX_NEWS_COUNT = 10;

class News {
    public draw(data: Readonly<Article>[]): void {
        const news = data.slice(0, MAX_NEWS_COUNT);

        const fragment = document.createDocumentFragment();
        const newsItemTemp = getElement<HTMLTemplateElement>(document, '#newsItemTemp');

        news.forEach((item, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

            if (idx % 2) getElement(newsClone, '.news__item').classList.add('alt');

            if (item.urlToImage) {
                getElement<HTMLElement>(newsClone, '.news__meta-photo').style.backgroundImage =
                    `url(${item.urlToImage})`;
            }
            getElement(newsClone, '.news__meta-author').textContent = item.author || item.source.name;
            getElement(newsClone, '.news__meta-date').textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            getElement(newsClone, '.news__description-title').textContent = item.title;
            getElement(newsClone, '.news__description-source').textContent = item.source.name;
            getElement(newsClone, '.news__description-content').textContent = item.description;
            getElement(newsClone, '.news__read-more a').setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const newsContainer = getElement(document, '.news');
        newsContainer.innerHTML = '';
        newsContainer.appendChild(fragment);
    }
}

export default News;
