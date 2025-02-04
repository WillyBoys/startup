$('.message a').click(function () {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});

$(document).ready(function () {
    $('.login-form').login(function (event) {
        event.preventDefault(); // Prevent default form submission
        window.location.href = "chat.html"; // Redirect to chat.html
    });
});