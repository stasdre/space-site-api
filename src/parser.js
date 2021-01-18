import db from './models';
const fs = require('fs');
const got = require('got');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const ServiceCategoriesData = db.serviceCategoriesData;
const Service = db.service;
const ServicesData = db.servicesData;

async function start() {
  try {
    const vgmUrl =
      'https://space.site-ok.ua/%D0%B2%D0%B5%D0%B1-%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8-%D1%86%D0%B5%D0%BD%D0%B0';

    got(vgmUrl)
      .then(async (response) => {
        const dom = new JSDOM(response.body);
        const dataBlocks = dom.window.document.querySelectorAll('.uk-width-medium-1-4');
        for (const block of dataBlocks) {
          let blockLink = block.firstElementChild;
          let dataCategory = '';
          let blockTitle = '';
          while (blockLink) {
            if (blockLink.tagName === 'DIV') {
              const dataBlockTitle = blockLink.querySelector('.title6');
              if (dataBlockTitle.textContent) {
                blockTitle = dataBlockTitle.textContent.slice(0, -1);
              } else {
                blockTitle = dataBlockTitle
                  .querySelector('.title6')
                  .textContent.slice(0, -1);
              }

              dataCategory = await ServiceCategoriesData.findOne({
                where: {
                  name: blockTitle,
                },
              });
              console.log(blockTitle, dataCategory.ServiceCategoryId);
            }

            if (blockLink.tagName === 'P') {
              const service = blockLink.querySelector('a');
              if (service) {
                const link = service.getAttribute('href');
                if (link.indexOf('https') === -1) {
                  if (link !== '/brif' && link !== '/breef-ru') {
                    const serviceData = await Service.create({
                      active: 1,
                      ServiceCategoryId: dataCategory.ServiceCategoryId,
                    });
                    console.log(service.textContent, link);
                    const dataServiceRu = await getData('ru', link);
                    console.log(dataServiceRu);
                    if (dataServiceRu['en_link']) {
                      const dataServiceEn = await getData('en', dataServiceRu['en_link']);
                      await ServicesData.create({
                        ServiceId: serviceData.id,
                        LangId: 'e5c8d721-8ba0-428f-9788-4eb6fe7334f5',
                        ...dataServiceEn,
                      });
                      console.log(dataServiceEn);
                    }
                    if (dataServiceRu['uk_link']) {
                      const dataServiceUk = await getData('uk', dataServiceRu['uk_link']);
                      await ServicesData.create({
                        ServiceId: serviceData.id,
                        LangId: 'baaef3e8-ed6a-4124-86b0-afe3788b7c07',
                        ...dataServiceUk,
                      });
                      console.log(dataServiceUk);
                    }
                    delete dataServiceRu['en_link'];
                    delete dataServiceRu['uk_link'];
                    await ServicesData.create({
                      ServiceId: serviceData.id,
                      LangId: '8148059f-8b39-4d9a-ad05-8aa9981e313e',
                      ...dataServiceRu,
                    });
                  }
                }
              }
            }
            blockLink = blockLink.nextSibling;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //console.log(`Connection has been established successfully.`);
  } catch (error) {
    console.log(`Unable to connect to the database: ${error}`);
  }
}

async function getData(lang, link) {
  const data = {};
  const response = await got(
    `https://space.site-ok.ua${lang !== 'ru' ? `/${lang}` : ''}${link}`
  );
  const domService = new JSDOM(response.body);

  const breadCrumbsData = domService.window.document.querySelector('.breadcrumbs');
  if (breadCrumbsData) {
    const dataItemLast = breadCrumbsData.lastElementChild;
    if (dataItemLast) {
      data['name'] = dataItemLast.querySelector("span[itemprop='name']").textContent;
    }
  }

  data['url'] = link.slice(1);

  data['meta_title'] = domService.window.document
    .querySelector("meta[name='title']")
    .getAttribute('content')
    .trim();

  data['meta_desc'] = domService.window.document
    .querySelector("meta[name='description']")
    .getAttribute('content')
    .trim();

  data['h1'] = domService.window.document
    .querySelector('.page-header')
    .textContent.trim();

  const h2 = domService.window.document.querySelector('.sppb-addon-title');
  if (h2) {
    data['h2'] = h2.textContent.trim();
  }

  const video_name = domService.window.document.querySelector('.slider-block-text');
  if (video_name) {
    data['video_name'] = video_name.querySelector('span').textContent.trim();
  }

  const firstTab = domService.window.document.querySelector('.span7');
  if (firstTab) {
    data['desc'] = firstTab.innerHTML.trim();
  }

  const tabs = domService.window.document.querySelector('.nav-pills');
  if (tabs) {
    tabs.querySelectorAll('li');
    if (tabs.firstElementChild) {
      data['desc_hash'] = tabs.firstElementChild.querySelector('a').getAttribute('href');
    }
    if (tabs.lastElementChild) {
      data['price_hash'] = tabs.lastElementChild.querySelector('a').getAttribute('href');
    }
  }

  data['more_hash'] = '#datails_tab';

  const dataContent = domService.window.document.querySelector('.tab');
  if (dataContent) {
    let blockData = dataContent.nextSibling;
    let dataText = '';
    let isNededContent = false;
    while (blockData) {
      if (blockData.tagName === 'H2') {
        isNededContent = true;
      }
      if (blockData.tagName === 'DIV') {
        isNededContent = false;
      }
      if (isNededContent === true) {
        dataText += blockData.outerHTML;
      }

      blockData = blockData.nextSibling;
    }
    data['more'] = dataText;
  }

  if (lang === 'ru') {
    const linkEn = domService.window.document.querySelector("link[hreflang='en']");
    if (linkEn) {
      data['en_link'] = linkEn.getAttribute('href').slice(3);
    }
    const linkUk = domService.window.document.querySelector("link[hreflang='uk']");
    if (linkUk) {
      data['uk_link'] = linkUk.getAttribute('href').slice(3);
    }
  }

  return data;
}

start();
