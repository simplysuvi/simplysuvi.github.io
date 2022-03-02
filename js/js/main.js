// Toggle the menu bar when it's clicked
function openNav() {
    document.getElementById("navbar").style.height = "100%";
}

function closeNav() {
    document.getElementById("navbar").style.height = "0%";
}

// Close the menu when the menu links are clicked
document.querySelector(".menu-links").addEventListener("click", function () {
    document.getElementById("navbar").style.height = "0%";
});

document.querySelector(".aboutMenu").addEventListener("click", function () {
    document.getElementById("navbar").style.height = "0%";
});

document.querySelector(".skillsMenu").addEventListener("click", function () {
    document.getElementById("navbar").style.height = "0%";
});

document.querySelector(".projectMenu").addEventListener("click", function () {
    document.getElementById("navbar").style.height = "0%";
});

document.querySelector(".educationMenu").addEventListener("click", function () {
    document.getElementById("navbar").style.height = "0%";
});

document.querySelector(".expMenu").addEventListener("click", function () {
    document.getElementById("navbar").style.height = "0%";
});

$(function () {
    $(document).scroll(function () {
        var $nav = $(".navbar");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
});
