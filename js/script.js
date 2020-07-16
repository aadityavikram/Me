const pytorchBar = document.querySelector('.bar-pytorch')
const kerasBar = document.querySelector('.bar-keras')
const opencvBar = document.querySelector('.bar-opencv')
const cvBar = document.querySelector('.bar-cv')
const pythonBar = document.querySelector('.bar-python')
const cppBar = document.querySelector('.bar-cpp')

var t1 = new TimelineLite()
t1.fromTo(pytorchBar, .75, {width: `calc(0% - 6px)`}, {width: `calc(90% - 6px)`, ease: Power4.easeOut})
  .fromTo(kerasBar, .75, {width: `calc(0% - 6px)`}, {width: `calc(80% - 6px)`, ease: Power4.easeOut})
  .fromTo(opencvBar, .75, {width: `calc(0% - 6px)`}, {width: `calc(65% - 6px)`, ease: Power4.easeOut})
  .fromTo(cvBar, .75, {width: `calc(0% - 6px)`}, {width: `calc(80% - 6px)`, ease: Power4.easeOut})
  .fromTo(pythonBar, .75, {width: `calc(0% - 6px)`}, {width: `calc(90% - 6px)`, ease: Power4.easeOut})
  .fromTo(cppBar, .75, {width: `calc(0% - 6px)`}, {width: `calc(80% - 6px)`, ease: Power4.easeOut})

.setTween(t1)

function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
}
