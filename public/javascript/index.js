$(document).ready(function () {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    // Once page is ready, run initPage
    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function (data) {
                if (data && data.length) {
                    renderArticles(data);
                } else {
                    renderEmpty();
                }
            });
    }

    ////////////////////////////////////////////////
    // APPENDS HTML CONTAINING ARTICLE DATA TO PAGE 
    ////////////////////////////////////////////////
    function renderArticles(articles) {
        var articlePanels = [];

        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    ////////////////////////////////////////////////
    // TAKES IN JSON OBJECT FOR ARTICLE
    ////////////////////////////////////////////////
    function createPanel(article) {
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-success save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    ////////////////////////////////////////////////
    // RENDERS HTML TO PAGE TO EXPLAIN WHY THERE ARE NO ARTICLES
    ////////////////////////////////////////////////
    function renderEmpty() {
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Oh no! Looks like we don't have any new articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What Would You Like To Do?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));

        articleContainer.append(emptyAlerlt);
    }

    ////////////////////////////////////////////////
    // FUNCTION TRIGGERS WHEN USER WANTS TO SAVE AN ARTICLE
    ////////////////////////////////////////////////
    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
            .then(function (data) {
                if (data.ok) {
                    initPage();
                }
            });
    }

    ////////////////////////////////////////////////
    // HANDLES USER CLICK ON ANY 'SCRAPE NEW ARTICLE' BUTTON
    ////////////////////////////////////////////////
    function handleArticleScrape() {
        $.get("/api/fetch")
            .then(function (data) {
                initPage();
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
            });
    }
});