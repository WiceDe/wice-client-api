function customArticle(article) {
  const customArticleFormat = {
    rowid: article.rowid,
    last_update: article.last_update,
    number: article.number,
    description: article.description,
    sales_price: article.sales_price,
    purchase_price: article.purchase_price,
    in_stock: article.in_stock,
    unit: article.unit,
  };
  return customArticleFormat;
}

module.exports = { customArticle };
