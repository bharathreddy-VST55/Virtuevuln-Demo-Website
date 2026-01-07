import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Isotope from 'isotope-layout';
import type { Product } from '../../interfaces/Product';
import {
  getProducts,
  getLatestProducts,
  putFile,
  getFile
} from '../../api/httpClient';
import Header from '../main/Header/Header';
import Testimonials from './Testimonials/Testimonials';
import ProductView from './ProductView';
import DateRangePicker from './DatePicker';
import Partners from './Partners/Partners';
import splitUriIntoParamsPPVulnerable from '../../utils/url';

interface Props {
  preview: boolean;
}
const path = import.meta.env.NODE_ENV === 'production' ? '/home/node/' : '';

const filters = [
  { label: 'All', value: '*' },
  { label: 'Healing', value: '.filter-Healing' },
  { label: 'Jewellery', value: '.filter-Jewellery' },
  { label: 'Gemstones', value: '.filter-Gemstones' }
];

const extractVideoUrlParam = (): string | null => {
  const { searchParams } = new URL(window.location.href);
  const videoSrc = searchParams.get('videosrc');
  return videoSrc;
};

export const Marketplace: FC<Props> = (props: Props) => {
  const [products, setProducts] = useState<Array<Product>>([]);
  const [sendFileResult, setSendFileResult] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<string>('*');
  const [loadedImageCount, setLoadedImageCount] = useState<number>(0);
  const isoRef = useRef<HTMLDivElement | null>(null);
  const [isotope, setIsotope] = useState<Isotope | null>(null);

  // Note: This function is vulnerable to Prototype Pollution
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUriParams: Record<string, any> = splitUriIntoParamsPPVulnerable(
    document.location.search
  );

  const [portfolioQueryFilter, setPortfolioQueryFilter] = useState(
    currentUriParams &&
      // eslint-disable-next-line no-prototype-builtins
      currentUriParams.hasOwnProperty('portfolio_query_filter')
      ? currentUriParams['portfolio_query_filter']
      : ''
  );

  useEffect(() => {
    if (products?.length && loadedImageCount >= products.length) {
      if (isotope) {
        isotope.reloadItems();
        isotope.arrange({});
      } else if (isoRef.current) {
        setIsotope(
          new Isotope(isoRef.current, { itemSelector: '.portfolio-item' })
        );
      }
    }
  }, [loadedImageCount, products]);

  useEffect(() => {
    isotope?.arrange({});
  }, [portfolioQueryFilter]);

  useEffect(() => {
    setLoadedImageCount(0);
  }, [products]);

  const sendFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File = (e.target.files as FileList)[0];
    putFile(`${path}${file.name}`, file).then((result) => {
      setSendFileResult(result);
      setFileName(file.name);
    });
  };

  const onGetFile = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    getFile(`${path}${fileName}`).then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  useEffect(() => {
    if (props.preview) {
      getLatestProducts().then((data) => setProducts(data));
    } else {
      getProducts(
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        new Date(new Date().setDate(new Date().getDate() + 1))
      ).then((data) => setProducts(data));
    }
  }, []);

  useEffect(() => {
    const videoElement = document.getElementById('testimonials-video');
    let videoSrc = extractVideoUrlParam();
    videoSrc =
      videoSrc ||
      'https://www.youtube-nocookie.com/embed/MPYlxeG-8_w?controls=0';
    if (videoElement) {
      videoElement.outerHTML = `<iframe width="560" height="315" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ${
        videoSrc && 'src="' + videoSrc
      }"></iframe>`;
    }
  }, []);

  const searchStringInProductNameOrDescription = (
    searchString: string,
    product: Product
  ) => {
    searchString = searchString.toLowerCase();
    return !searchString ||
      product.name.toLowerCase().includes(searchString) ||
      product.description.toLowerCase().includes(searchString)
      ? product
      : null;
  };

  /*
  If the 'prototypePollutionDomXss' key is present (which can stem from prototype pollution or just a regular URI parameter)
  then a <script> element is created with the key's cooresponding value as a source
  */
  let scriptElementProrotypePollutionDomXSS;
  if (currentUriParams.prototypePollutionDomXss) {
    scriptElementProrotypePollutionDomXSS = document.createElement('script');

    scriptElementProrotypePollutionDomXSS.id =
      'prototype-pollution-dom-xss-script';
    scriptElementProrotypePollutionDomXSS.src =
      currentUriParams.prototypePollutionDomXss;
    scriptElementProrotypePollutionDomXSS.async = true;

    document.body.appendChild(scriptElementProrotypePollutionDomXSS);
  }

  const handleDateChange = (dateFrom: Date, dateTo: Date) => {
    getProducts(dateFrom, dateTo).then((data) => setProducts(data));
  };

  const handleGroupFilterClick = (group: string) => {
    setGroupFilter(group);
    if (isotope) {
      isotope.arrange({
        filter: group
      });
    }
  };

  const handleImageLoad = useCallback(() => {
    setLoadedImageCount((prev) => prev + 1);
  }, [setLoadedImageCount]);

  return (
    <section>
      {props.preview || <Header onInnerPage={true} />}

      <section id="marketplace" className="portfolio">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Marketplace</h2>
          </div>
          <div className="section-title marketplace-gem-filter-container">
            <h3>Gem Filter</h3>
            <input
              className="form-control marketplace-gem-filter-input"
              id="portfolio-query-filter"
              placeholder="Filter for gems easily"
              defaultValue={portfolioQueryFilter || ''}
              onChange={(e) => setPortfolioQueryFilter(e ? e.target.value : '')}
            />
          </div>
          {props.preview || (
            <div className="row">
              <DateRangePicker onDatesChange={handleDateChange} />
              <div className="col-lg-12 d-flex justify-content-center pt-2">
                <ul id="portfolio-flters">
                  {filters.map((filter) => (
                    <li
                      key={filter.value}
                      className={
                        groupFilter === filter.value ? 'filter-active' : ''
                      }
                      onClick={() => handleGroupFilterClick(filter.value)}
                    >
                      {filter.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="row portfolio-container" ref={isoRef}>
            {products
              ?.map((product) =>
                searchStringInProductNameOrDescription(
                  portfolioQueryFilter,
                  product
                )
              )
              .filter((product): product is Product => !!product)
              .map((product) => (
                <ProductView
                  product={product}
                  key={product.id}
                  onImageLoad={handleImageLoad}
                />
              ))}
          </div>
        </div>
        {props.preview && (
          <div className="section-readmore">
            <a href="/marketplace">
              <span>See all products</span>
            </a>
          </div>
        )}
      </section>
      <Partners />
      <Testimonials preview={props.preview} />
      <section id="feedback" className="testimonials section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>feedback</h2>
            <span>Please, upload a feedback: </span>
            <label htmlFor="feedback-file-input" className="file-input-label">
              <img
                src={'assets/img/upload-file.svg'}
                alt=""
                className="upload-file-image"
              />
            </label>
            <input
              id="feedback-file-input"
              type="file"
              accept="file/*"
              style={{ display: 'none' }}
              onChange={sendFile}
            />
            {sendFileResult.length > 0 && (
              <>
                <div className="warning-text">{sendFileResult}</div>
                <div>
                  You can reach your file{' '}
                  <a href="#" onClick={onGetFile}>
                    here
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {props.preview || (
        <section id="video" className="testimonials section-bg">
          <div
            className="container d-flex justify-content-center"
            data-aos="fade-up"
          >
            <iframe
              width="560"
              height="315"
              id="testimonials-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </section>
      )}
    </section>
  );
};

export default Marketplace;
