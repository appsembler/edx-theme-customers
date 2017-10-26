$(document).ready(function(){

	// site mobile nav toggle
	$('#site-menu-toggle').on('click', function() {
		$(this).toggleClass('a--toggled');
		$('#slide-menu').toggleClass('a--active');
	});

	// user nav toggle
	$('#user-menu-toggle').on('click', function() {
		$(this).toggleClass('a--toggled');
		$('#user-avatar-menu').toggleClass('a--active');
	});

	// courseware nav toggling
	$('.a--course-content__nav__mobile-toggle').on('click', function() {
		$('.a--course-content__nav__mobile-toggle').slideToggle();
		$('#course-nav-wrapper').slideToggle();
	});

	// execute css on-load animations
	$('.a--animated').addClass("a--do-animate");

	function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

	$(window).scroll(function () {
	   $('.a--animate-on-scroll.a--out-animation').each(function () {
	      if (isScrolledIntoView(this) === true) {
	          $(this).addClass('a--in-view');
	      } else {
					$(this).removeClass('a--in-view');
				}
	   });
	});

	$(window).scroll(function () {
	   $('.a--animate-on-scroll.a--no-out-animation').each(function () {
	      if (isScrolledIntoView(this) === true) {
	          $(this).addClass('a--in-view');
	      }
	   });
	});

	$('.a--reveal-on-load').each(function() {
		$(this).addClass('a--revealed');
	});

	$('.a--expanding-section').on('click', function() {
	 $('.a--expanding-section').each((function(index, el) {
		 $(this).removeClass('a--expanded');
			 }));
	 $(this).toggleClass('a--expanded');
 	});

	$("#discovery-expand-button").click(function() {
    $(this).toggleClass("activated");
    $("#discovery-expanding-area").slideToggle();
	})

	// YouTube control
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});


// TouTube pausing in modals

function getFrameID(id){
	var elem = document.getElementById(id);
	if (elem) {
			if(/^iframe$/i.test(elem.tagName)) return id; //Frame, OK
			// else: Look for frame
			var elems = elem.getElementsByTagName("iframe");
			if (!elems.length) return null; //No iframe found, FAILURE
			for (var i=0; i<elems.length; i++) {
				 if (/^https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com(\/|$)/i.test(elems[i].src)) break;
			}
			elem = elems[i]; //The only, or the best iFrame
			if (elem.id) return elem.id; //Existing ID, return it
			// else: Create a new ID
			do { //Keep postfixing `-frame` until the ID is unique
					id += "-frame";
			} while (document.getElementById(id));
			elem.id = id;
			return id;
	}
	// If no element, return null.
	return null;
}

var youTubePlayers = {};

function onYouTubePlayerAPIReady() {
	$(".youtube-modal-iframe[id]").each(function() {
		var identifier = this.id;
		var frameID = getFrameID(identifier);
		if (frameID) {
			youTubePlayers[frameID] = new YT.Player(frameID, {
				events: {
					"onReady": createYTEvent(frameID, identifier)
				}
			});
		}
	});
}


function createYTEvent(frameID, identifier) {
	return function (event) {
		buttonId = "a--video-modal-close-" + frameID;
		var pauseButton = document.getElementById(buttonId);
		pauseButton.addEventListener("click", function() {
			youTubePlayers[frameID].pauseVideo();
		})
	}
}


function toggleCoursewareNavChevrons() {
	var childrenTotalWidth = 0;
	$('#courseware-top-nav-list li').each(function(){
    childrenTotalWidth += $(this).width();
	});
	if ($('#courseware-top-nav-container').width() < childrenTotalWidth) {
		$('#courseware-top-nav-chevron').addClass("visible");
	}
}


/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-flexbox-flexboxlegacy-flexboxtweener-flexwrap-svgasimg !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,s,a;for(var l in _)if(_.hasOwnProperty(l)){if(e=[],n=_[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),w.push((o?"":"no-")+a.join("-"))}}function i(e){var n=b.className,t=Modernizr._config.classPrefix||"";if(S&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),S?b.className.baseVal=n:b.className=n)}function s(e,n){if("object"==typeof e)for(var t in e)C(e,t)&&s(t,e[t]);else{e=e.toLowerCase();var r=e.split("."),o=Modernizr[r[0]];if(2==r.length&&(o=o[r[1]]),"undefined"!=typeof o)return Modernizr;n="function"==typeof n?n():n,1==r.length?Modernizr[r[0]]=n:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=n),i([(n&&0!=n?"":"no-")+r.join("-")]),Modernizr._trigger(e,n)}return Modernizr}function a(e,n){return!!~(""+e).indexOf(n)}function l(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):S?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function f(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function u(e,n){return function(){return e.apply(n,arguments)}}function d(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,"function")?u(o,t||n):o);return!1}function c(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function p(){var e=n.body;return e||(e=l(S?"svg":"body"),e.fake=!0),e}function h(e,t,r,o){var i,s,a,f,u="modernizr",d=l("div"),c=p();if(parseInt(r,10))for(;r--;)a=l("div"),a.id=o?o[r]:u+(r+1),d.appendChild(a);return i=l("style"),i.type="text/css",i.id="s"+u,(c.fake?c:d).appendChild(i),c.appendChild(d),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),d.id=u,c.fake&&(c.style.background="",c.style.overflow="hidden",f=b.style.overflow,b.style.overflow="hidden",b.appendChild(c)),s=t(d,e),c.fake?(c.parentNode.removeChild(c),b.style.overflow=f,b.offsetHeight):d.parentNode.removeChild(d),!!s}function m(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+c(n[o])+":"+r+")");return i=i.join(" or "),h("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return t}function g(e,n,o,i){function s(){d&&(delete z.style,delete z.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var u=m(e,o);if(!r(u,"undefined"))return u}for(var d,c,p,h,g,v=["modernizr","tspan"];!z.style;)d=!0,z.modElem=l(v.shift()),z.style=z.modElem.style;for(p=e.length,c=0;p>c;c++)if(h=e[c],g=z.style[h],a(h,"-")&&(h=f(h)),z.style[h]!==t){if(i||r(o,"undefined"))return s(),"pfx"==n?h:!0;try{z.style[h]=o}catch(y){}if(z.style[h]!=g)return s(),"pfx"==n?h:!0}return s(),!1}function v(e,n,t,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+P.join(s+" ")+s).split(" ");return r(n,"string")||r(n,"undefined")?g(a,n,o,i):(a=(e+" "+E.join(s+" ")+s).split(" "),d(a,n,t))}function y(e,n,r){return v(e,t,t,n,r)}var w=[],_=[],x={_version:"3.2.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){_.push({name:e,fn:n,options:t})},addAsyncTest:function(e){_.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=x,Modernizr=new Modernizr;var C,b=n.documentElement,S="svg"===b.nodeName.toLowerCase();!function(){var e={}.hasOwnProperty;C=r(e,"undefined")||r(e.call,"undefined")?function(e,n){return n in e&&r(e.constructor.prototype[n],"undefined")}:function(n,t){return e.call(n,t)}}(),x._l={},x.on=function(e,n){this._l[e]||(this._l[e]=[]),this._l[e].push(n),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},x._trigger=function(e,n){if(this._l[e]){var t=this._l[e];setTimeout(function(){var e,r;for(e=0;e<t.length;e++)(r=t[e])(n)},0),delete this._l[e]}},Modernizr._q.push(function(){x.addTest=s}),Modernizr.addTest("svgasimg",n.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"));var T="Moz O ms Webkit",P=x._config.usePrefixes?T.split(" "):[];x._cssomPrefixes=P;var E=x._config.usePrefixes?T.toLowerCase().split(" "):[];x._domPrefixes=E;var j={elem:l("modernizr")};Modernizr._q.push(function(){delete j.elem});var z={style:j.elem.style};Modernizr._q.unshift(function(){delete z.style}),x.testAllProps=v,x.testAllProps=y,Modernizr.addTest("flexbox",y("flexBasis","1px",!0)),Modernizr.addTest("flexboxlegacy",y("boxDirection","reverse",!0)),Modernizr.addTest("flexboxtweener",y("flexAlign","end",!0)),Modernizr.addTest("flexwrap",y("flexWrap","wrap",!0)),o(),i(w),delete x.addTest,delete x.addAsyncTest;for(var N=0;N<Modernizr._q.length;N++)Modernizr._q[N]();e.Modernizr=Modernizr}(window,document);
