(function (doc, win) {
  let docEl = doc.documentElement;
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  let recalc = function () {
    let clientWidth = docEl.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    if(clientWidth < 1000){
    	docEl.style.fontSize = 100 * (1000 / 1920) + 'px';
    } else {
    	// docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
    }
//		if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
//		    docEl.style.fontSize = 50 * (clientWidth / 375) + 'px';
//		}
    if(clientWidth<500){
    	docEl.style.fontSize = 50 * (clientWidth / 375) + 'px';
    }
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
