import db from './models';
const fs = require('fs');
const got = require('got');
const jsdom = require('jsdom');
const xml2js = require('xml2js');

const { JSDOM } = jsdom;

const Work = db.work;
const WorksData = db.worksData;

async function start() {
  try {
    const vgmUrl =
      'https://space.site-ok.ua/index.php?option=com_jmap&view=sitemap&format=xml';

    got(vgmUrl)
      .then(async (response) => {
        xml2js.parseStringPromise(response.body).then(async (result) => {
          //console.dir(result.urlset.url);
          let order = 1;
          for (const item of result.urlset.url) {
            const url = item.loc.toString();
            if (url.indexOf('/portfolio/') !== -1) {
              const responseRu = await got(url);
              const domRu = new JSDOM(responseRu.body);
              const dataRu = await getData(domRu, url.slice(24), 'ru');

              if (dataRu) {
                const workData = await Work.create({
                  active: 1,
                  WorkTypeId: '51fb6c7a-9063-4736-9a48-528a9ed79d76',
                });

                console.log('RU', dataRu);
                await WorksData.create({
                  WorkId: workData.id,
                  order,
                  ...dataRu,
                });

                const linkEn = domRu.window.document
                  .querySelector("link[hreflang='en']")
                  .getAttribute('href');
                const responseEn = await got(`https://space.site-ok.ua${linkEn}`);
                const domEn = new JSDOM(responseEn.body);
                const dataEn = await getData(domEn, linkEn.slice(3), 'en');
                console.log('EN', dataEn);
                await WorksData.create({
                  WorkId: workData.id,
                  order,
                  ...dataEn,
                });

                const linkUk = domRu.window.document
                  .querySelector("link[hreflang='uk']")
                  .getAttribute('href');
                const responseUk = await got(`https://space.site-ok.ua${linkUk}`);
                const domUk = new JSDOM(responseUk.body);
                const dataUk = await getData(domUk, linkUk.slice(3), 'uk');
                console.log('UK', dataUk);
                await WorksData.create({
                  WorkId: workData.id,
                  order,
                  ...dataUk,
                });

                order++;
              }
            }
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    //console.log(`Connection has been established successfully.`);
  } catch (error) {
    console.log(`Unable to connect to the database: ${error}`);
  }
}

async function getData(dom, link, lang) {
  if (
    link === '/portfolio/speis' ||
    link === '/space-site/raboty-studii-eng' ||
    link === '/space-site/portfolio'
  ) {
    return null;
  }

  const data = {};

  data['description'] = '';
  data['prev_img'] = '';

  switch (lang) {
    case 'ru':
      data['LangId'] = '8148059f-8b39-4d9a-ad05-8aa9981e313e';
      data['url'] = link.slice(11);
      break;
    case 'en':
      data['LangId'] = 'e5c8d721-8ba0-428f-9788-4eb6fe7334f5';
      data['url'] = link.slice(12);
      break;
    case 'uk':
      data['LangId'] = 'baaef3e8-ed6a-4124-86b0-afe3788b7c07';
      data['url'] = link.slice(12);
      break;

    default:
      break;
  }

  const dataTitle = dom.window.document.querySelector('h1');
  if (dataTitle) {
    data['h1'] = dataTitle.textContent;
    data['name'] = dataTitle.textContent;
  }

  const dataMetaTitle = dom.window.document.querySelector("meta[name='title']");
  if (dataMetaTitle) {
    data['meta_title'] = dataMetaTitle.getAttribute('content').trim();
  }
  data['meta_desc'] = dom.window.document
    .querySelector("meta[name='description']")
    .getAttribute('content')
    .trim();

  const dataImg = dom.window.document.querySelector('.entry-content p img');
  if (dataImg) {
    data['img'] = dataImg.getAttribute('src');
  }

  return data;
}

start();
