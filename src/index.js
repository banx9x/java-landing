import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "particles.js";
require("@fancyapps/fancybox");
import "@fancyapps/fancybox/dist/jquery.fancybox.min.css";
import "@fortawesome/fontawesome-free/js/all.min.js";
import "countup.js";
import "./style.css";
import { CountUp } from "countup.js";
import "slick-carousel";
import "slick-carousel/slick/slick.css";

particlesJS.load("header", "assets/particlesjs-config.json");

const observer = (() => {
    const list = {};

    return {
        add(event, callback) {
            if (!list[event]) {
                list[event] = [];
            }

            list[event].push(callback);
        },

        notify(event, data) {
            if (!list[event]) {
                return false;
            }

            list[event].forEach((f) => {
                f(data);
            });
        },

        remove(event, callback) {
            if (!list[event]) {
                return false;
            }

            list[event] = list[event].filter((f) => f != callback);
        },
    };
})();

function isShowing(element, offset) {
    return (
        window.pageYOffset + window.innerHeight >
        element.offsetTop + (offset || 0)
    );
}

function isScrolling() {
    return (
        document.body.scrollTop > 0 || document.documentElement.scrollTop > 0
    );
}

let isToggle = false;

observer.add(
    "scroll",
    (() => {
        const d = document.getElementById("data");
        const s = new CountUp("student", 300);
        const p = new CountUp("project", 200);
        const l = new CountUp("lesson", 90);
        const v = new CountUp("vote", 5);

        const count = () => {
            if (isShowing(d)) {
                s.start();
                p.start();
                l.start();
                v.start();
                observer.remove(count);
            }
        };

        return count;
    })()
);

observer.add(
    "scroll",
    (() => {
        const n = document.getElementById("navbar");

        return () => {
            if (isScrolling() && !n.classList.contains("is-fix")) {
                n.classList.add("is-fix");
            } else {
                if (!isToggle && !isScrolling()) {
                    n.classList.remove("is-fix");
                }
            }
        };
    })()
);

observer.add(
    "toggle",
    (() => {
        const n = document.getElementById("navbar");

        return () => {
            if (!isToggle) {
                isToggle = true;
                n.classList.contains("is-fix") || n.classList.add("is-fix");
            } else {
                isToggle = false;
                !isScrolling() && n.classList.remove("is-fix");
            }
        };
    })()
);

window.onscroll = () => observer.notify("scroll");

document
    .getElementById("toggle")
    .addEventListener("click", () => observer.notify("toggle"));

$(".fee-slider").slick({
    arrows: false,
    centerMode: true,
    centerPadding: "15px",
    initialSlide: 1,
    mobileFirst: true,
    focusOnSelect: true,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                centerPadding: "60px",
            },
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 3,
                centerPadding: "0px",
            },
        },
    ],
});

$("#teacher-modal").on("show.bs.modal", function (e) {
    const a = $(e.relatedTarget);
    const img = a.data("img");
    const name = a.data("name");
    const info = a.data("info");
    const quote = a.data("quote");

    const modal = $(this);

    modal.find(".teacher-img img").attr("src", img);
    modal.find(".teacher-name").text(name);
    modal.find(".teacher-detail").text(info);
    modal.find(".teacher-quote").text('"' + quote + '"');
});

$(".review-slider").slick({
    arrows: false,
    centerMode: true,
    centerPadding: "15px",
    infinite: false,
    initialSlide: 1,
    mobileFirst: true,
    focusOnSelect: true,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                centerPadding: "90px",
            },
        },
        {
            breakpoint: 992,
            settings: {
                centerPadding: "210px",
            },
        },
    ],
});

document.getElementById("btn-register").addEventListener(
    "click",
    (function (e) {
        const name = document.getElementById("name");
        const phone = document.getElementById("phone");
        const email = document.getElementById("email");
        const note = document.getElementById("note");

        function checkValid() {
            let valid = true;
            if (name.value.trim() == "") {
                name.classList.remove("is-valid");
                name.classList.add("is-invalid");

                valid = false;
            } else {
                name.classList.remove("is-invalid");
                name.classList.add("is-valid");
            }

            if (phone.value.trim() == "") {
                phone.classList.remove("is-valid");
                phone.classList.add("is-invalid");

                valid = false;
            } else {
                phone.classList.remove("is-invalid");
                phone.classList.add("is-valid");
            }

            if (email.value.trim() == "") {
                email.classList.remove("is-valid");
                email.classList.add("is-invalid");

                valid = false;
            } else {
                email.classList.remove("is-invalid");
                email.classList.add("is-valid");
            }

            return valid;
        }

        return function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (checkValid()) {
                const btn = $(this);

                let nameVal = name.value;
                let phoneVal = phone.value;
                let emailVal = email.value;
                let noteVal = note.value;

                let req = {
                    FullName: nameVal,
                    Email: emailVal,
                    Phone: phoneVal,
                    Info: noteVal,
                    Link: window.location.href,
                    ItemId: "vpb",
                    Type: 1,
                };

                let myJSON = JSON.stringify(req);

                $.ajax({
                    url: "/submit-advisory",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: myJSON,
                    dataType: "json",
                    success: function (data) {
                        name.value = phone.value = email.value = note.value =
                            "";
                        name.classList.remove("is-valid");
                        phone.classList.remove("is-valid");
                        email.classList.remove("is-valid");
                        $(".alert").text(data).alert();
                    },
                    error: function (result) {
                        $(".alert").text(result.responseJSON.message).alert();
                    },
                });

                btn.attr("disabled", false);
            }
        };
    })()
);
