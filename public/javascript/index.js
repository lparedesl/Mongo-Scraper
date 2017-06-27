$(document).ready(function() {
    $("#scrape").click(function() {
        $.post("/scrape")
        .done(function(data) {
            console.log(data);
            $(".row").empty();
            data.forEach(function(article) {
                var classDisabled = null;
                if (articles.saved) {
                    classDisabled = "disabled";
                }
                $(".row").append(`
                    <div class="col-md-4">
                        <div class="card" data-id="${article._id}">
                            <img class="card-img-top" src="${article.img}" alt="Card image cap">
                            <div class="card-block">
                                <h4 class="card-title">${article.title}</h4>
                                <p class="card-text">${article.desc}</p>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item author">${article.authors}</li>
                                <li class="list-group-item from">${article.from}</li>
                            </ul>
                            <div class="card-block">
                                <button class="btn btn-info float-left save-article ${classDisabled}" type="button" data-id="${article._id}">Save Article</button>
                            </div>
                        </div>
                    </div>
                `);
            });
            $('#scrape-done').modal();
        });
    });

    $(".save-article").click(function() {
        var self = $(this);
        if (!self.hasClass("disabled")) {
            $.post("/save-article", {
                _id: self.data("id")
            })
            .done(function(data) {
                self.addClass("disabled");
            });
        }
    });

    $(".delete-article").click(function() {
        var self = $(this);
        $.post("/delete-article", {
            _id: self.data("id")
        })
        .done(function(data) {
            location.reload();
        });
    });


    $("#view-notes").click(function() {
        $('#article-notes').modal();
    });
});