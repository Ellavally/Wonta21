const newsData = require('./data/newsData');

module.exports = (app) => {

  const PER_PAGE = 6; // Number of news items per page

  app.get('/news', (req, res) => {
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    const paginatedNews = newsData.slice(start, end);
    const totalPages = Math.ceil(newsData.length / PER_PAGE);

    res.render('news', {
      activePage: 'news',
      newsItems: paginatedNews,
      currentPage: page,
      totalPages: totalPages
    });
  });

};
