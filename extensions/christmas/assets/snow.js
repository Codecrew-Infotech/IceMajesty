window.onload = function () {
    console.log("IceMajesty loaded");
    var temp = document.getElementById("snow");

    if (!temp) {
        return;
    }

    var animationType = temp.getAttribute("data-type") || "snowfall";
    var animationCount = parseInt(temp.getAttribute("data-count"), 10) || 80;
    var animationSize = parseInt(temp.getAttribute("data-size"), 10) || 30;

    var emojiMap = {
        snowfall: ["❄️"],
        stars: ["⭐"],
        leaves: ["🍁"],
        hearts: ["❤️"],
        sale: ["🏷️"],
        christmasTree: ["🎄"],
        gift: ["🎁"],
        partyPoppers: ["🎉"],
        holi: ["●"],
        diyaLamp: ["🪔"],
    };

    var types = emojiMap[animationType] || ["❄️"];

    document.body.prepend(temp);
    var flakes = [];
    for (var i = 0; i < animationCount; i++) {
        var emoji = types[i % types.length];
        var style = "font-size: " + animationSize + "px;";

        flakes.push(
            '<i class="' + animationType + '" style="' + style + '">' + emoji + "</i>"
        );
    }
    temp.innerHTML = flakes.join("");
};