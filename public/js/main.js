/* global $ */

/* Open the sidenav */
function openNav() {
    document.getElementById("mySidenav").style.width = "100vw";
}

/* Close/hide the sidenav */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

var searchInput = document.getElementById("searchinput");

function toggleSearchDisplay() {

    if (searchInput) {
        if (searchInput.style.display === 'none' || searchInput.style.display === '') {
            searchInput.style.display = 'block';
        }
        else {
            searchInput.style.display = 'none';
        }
    }
}

function filterTableContentByTitle() {

    var filter, table, tr, td, i;
    filter = searchInput.value.toUpperCase();
    table = document.querySelector(".table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows except first one and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            }
            else {
                tr[i].style.display = "none";
            }
        }
    }
    
}

$('.delete-post').on('click', function(e) {
    $target = $(e.target);
    var id = $target.attr('data-id');
    $.ajax({
        type: 'DELETE',
        url: '/posts/delete/' + id,
        success: function(response) {
            console.log(response);
            $target.closest('tr').remove();
            $('#flashes').html('<div class = "alert alert-success">' + response.message + '</div>');
        },
        error: function(err) {
            console.log(err);
        }
    });
});
