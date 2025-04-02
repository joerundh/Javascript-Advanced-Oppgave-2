const sections = [
    document.getElementById("lists"),
    document.getElementById("add-book")
];

function goToSection(index) {
    sections.forEach(section => section.style.display = "none");
    sections[index].style.display = "inline-block";
}