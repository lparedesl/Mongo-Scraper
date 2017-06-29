$(document).ready(function() {
    $("#scrape").click(function() {
        $.post("/scrape")
        .done(function(data) {
            $(".row").empty();
            data.forEach(function(article) {
                var classDisabled = null;
                var buttonText = "Save Article";
                if (article.saved) {
                    classDisabled = "disabled";
                    buttonText = "Saved";
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
                                <button class="btn btn-info float-left save-article ${classDisabled}" type="button" data-id="${article._id}">${buttonText}</button>
                            </div>
                        </div>
                    </div>
                `);
            });
            $("#total-articles").text(data.length);
            $('#scrape-done').modal();
        });
    });

    $(document).on("click", ".save-article", function() {
        var self = $(this);
        if (!self.hasClass("disabled")) {
            $.post("/save-article", {
                _id: self.data("id")
            })
            .done(function() {
                self.addClass("disabled");
                self.text("Saved");
            });
        }
    });

    $(".delete-article").click(function() {
        var self = $(this);
        $.post("/delete-article", {
            _id: self.data("id")
        })
        .done(function() {
            location.reload();
        });
    });

    $(".view-notes").click(function() {
        $("#article-notes form").attr("action", "/save-note/" + $(this).data("id"));
        $("#article-id").text($(this).data("id"));
        $("#article-notes button").attr("data-id", $(this).data("id"));
        $(".cards").empty();
        $.post("/get-notes/" + $(this).data("id"))
        .done(function(data) {
            console.log(data);
            $(".cards").empty();
            data.notes.forEach(function(note) {
                $(".cards").append(`
                    <div class="card">
                        <div class="card-block">
                            <p>${note.text}</p>
                            <a href="#" class="card-link delete-note" data-id="${note._id}">Remove</a>
                        </div>
                    </div>
                `);
            });
            $('#article-notes').modal();
        });
    });

    $(".save-note").click(function() {
        $.post("/save-note/" + $(this).data("id"), {
            text: $("#note-text").val().trim()
        })
        .done(function() {
            $("#note-text").val("");
            $('#article-notes').modal('hide');
        });
    });

    $(document).on("click", ".delete-note", function() {
        $.post("/delete-note", {
            id: $(this).data("id")
        })
        .done(function() {
            location.reload();
        });
    });
});