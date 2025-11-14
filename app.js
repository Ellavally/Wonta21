// -------------------------------
// NEWS PAGE WITH PAGINATION
// -------------------------------
app.get('/news', (req, res) => {

  // All news items
  const newsData = [
    {
      title: "Wonta RDA Launches Women Empowerment Program",
      date: "2025-02-10",
      image: "/images/news1.jpg",
      summary: "A major initiative supporting rural women with skills training and microfinance opportunities.",
      link: "#"
    },
    {
      title: "Rural Schools Receive New Learning Materials",
      date: "2025-01-22",
      image: "/images/news2.jpg",
      summary: "Over 1,500 students benefited from new books, uniforms, and classroom supplies.",
      link: "#"
    },
    {
      title: "Mobile Health Outreach Reaches 3,000+ Residents",
      date: "2025-01-05",
      image: "/images/news3.jpg",
      summary: "Free checkups, vaccinations, and health education were provided in remote communities.",
      link: "#"
    }
  ];

  // PAGINATION
  const page = parseInt(req.query.page) || 1;  // current page
  const itemsPerPage = 6;                      // items per page

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedNews = newsData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  res.render('news', {
    activePage: 'news',
    newsItems: paginatedNews,  // matches your EJS
    currentPage: page,
    totalPages: totalPages
  });
});
