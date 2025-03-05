window.onload = function () {
    var temp = document.getElementById("snow");
    document.body.prepend(temp);
    var flakes = [];
    var types = ["❄", "❅", "❆"];
    for (var i = 0, len = 80; i < len; i++) {
        flakes.push("<i>" + types[i % types.length] + "</i>");
    }
    document.getElementById("snow").innerHTML = flakes.join("");
};
