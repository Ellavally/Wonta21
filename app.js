// -------------------------------
// NEWS PAGE WITH PAGINATION
// -------------------------------
app.get('/news', (req, res) => {

  // Your existing news list
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

  // PAGINATION LOGIC
  const page = parseInt(req.query.page) || 1;  // current page number
  const itemsPerPage = 6;                      // how many items per page

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedNews = newsData.slice(start, end);
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  // Render page
  res.render('news', {
    activePage: 'news',
    newsItems: paginatedNews,  // IMPORTANT → matches EJS
    currentPage: page,
    totalPages: totalPages
  });
});
