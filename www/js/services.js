// TODO: --|---- directive
angular.module("telugu_stotralu.services", [])
// TODO: --|-------- zoomTap
.directive("zoomTap", function($compile, $ionicGesture) {
	return {
		link: function($scope, $element, $attrs) {
			var zoom = minZoom = 10;
			var maxZoom = 50;
			$element.attr("style", "width:" + (zoom * 10) + "%");
			var handlePinch = function(e){
				if (e.gesture.scale <= 1) {
					zoom--;
				}else{
					zoom++;
				}
				if (zoom >= maxZoom) {
					zoom = maxZoom;
				}
				if (zoom <= minZoom) {
					zoom = minZoom;
				}
				$element.attr("style", "width:" + (zoom * 10) + "%");
			};
			var handleDoubleTap = function(e){
				zoom++;
				if (zoom == maxZoom) {
					zoom = minZoom;
				}
				$element.attr("style", "width:" + (zoom * 10) + "%");
			};
			var pinchGesture = $ionicGesture.on("pinch", handlePinch, $element);
			var doubletapGesture = $ionicGesture.on("doubletap", handleDoubleTap, $element);
			$scope.$on("$destroy", function() {
				$ionicGesture.off(pinchGesture, "pinch", $element);
				$ionicGesture.off(doubletapGesture, "doubletap", $element);
			});
		}
	};
})
// TODO: --|-------- zoom-view
.directive("zoomView", function($compile,$ionicModal, $ionicPlatform){
	return {
			link: function link($scope, $element, $attrs){
				
				$element.attr("ng-click", "showZoomView()");
				$element.removeAttr("zoom-view");
				$compile($element)($scope);
				$ionicPlatform.ready(function(){
					var zoomViewTemplate = "";
					zoomViewTemplate += "<ion-modal-view class=\"zoom-view\">";
					zoomViewTemplate += "<ion-header-bar class=\"bar bar-header light bar-balanced-900\">";
					zoomViewTemplate += "<div class=\"header-item title\"></div>";
					zoomViewTemplate += "<div class=\"buttons buttons-right header-item\"><span class=\"right-buttons\"><button ng-click=\"closeZoomView()\" class=\"button button-icon ion-close button-clear button-dark\"></button></span></div>";
					zoomViewTemplate += "</ion-header-bar>";
					zoomViewTemplate += "<ion-content>";
					zoomViewTemplate += "<ion-scroll zooming=\"true\" direction=\"xy\" style=\"width:100%;height:100%;position:absolute;top:0;bottom:0;left:0;right:0;\">";
					zoomViewTemplate += "<img ng-src=\"{{ngSrc}}\" style=\"width:100%!important;display:block;width:100%;height:auto;max-width:400px;max-height:700px;margin:auto;padding:10px;\"/>";
					zoomViewTemplate += "</ion-scroll>";
					zoomViewTemplate += "</ion-content>";
					zoomViewTemplate += "</ion-modal-view>";
					$scope.zoomViewModal = $ionicModal.fromTemplate(zoomViewTemplate,{
						scope: $scope,
						animation: "slide-in-up"
					});
					
					$scope.showZoomView = function(){
						$scope.zoomViewModal.show();
						$scope.ngSrc = $attrs.zoomSrc;
					};
					$scope.closeZoomView= function(){
						$scope.zoomViewModal.hide();
					};
				});
		}
	};
})
.directive("headerShrink", function($document){
	var fadeAmt;
	var shrink = function(header, content, amt, max){
		amt = Math.min(44, amt);
		fadeAmt = 1 - amt / 44;
		ionic.requestAnimationFrame(function(){
			var translate3d = "translate3d(0, -" + amt + "px, 0)";
			if(header==null){return;}
			for (var i = 0, j = header.children.length; i < j; i++){
			header.children[i].style.opacity = fadeAmt;
				header.children[i].style[ionic.CSS.TRANSFORM] = translate3d;
			}
		});
	};
	return {
		link: function($scope, $element, $attr){
			var starty = $scope.$eval($attr.headerShrink) || 0;
			var shrinkAmt;
			var header = $document[0].body.querySelector(".page-title");
			var headerHeight = $attr.offsetHeight || 44;
			$element.bind("scroll", function(e){
				var scrollTop = null;
				if (e.detail){
					scrollTop = e.detail.scrollTop;
				} else if (e.target){
					scrollTop = e.target.scrollTop;
				}
				if (scrollTop > starty){
					shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
					shrink(header, $element[0], shrinkAmt, headerHeight);
				}else{
					shrink(header, $element[0], 0, headerHeight);
				}
			});
			$scope.$parent.$on("$ionicView.leave", function (){
				shrink(header, $element[0], 0, headerHeight);
			});
			$scope.$parent.$on("$ionicView.enter", function (){
				shrink(header, $element[0], 0, headerHeight);
			});
		}
	}
})
// TODO: --|-------- fileread
.directive("fileread",function($ionicLoading,$timeout){
	return {
		scope:{
			fileread: "="
		},
		link: function(scope, element,attributes){
			element.bind("change", function(changeEvent) {
				$ionicLoading.show({
					template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
				});
				scope.fileread = "";
				var reader = new FileReader();
				reader.onload = function(loadEvent) {
					try{
						scope.$apply(function(){
							scope.fileread = loadEvent.target.result;
						});
					}catch(err){
						//alert(err.message);
					}
				}
				reader.onloadend = function(loadEvent) {
					try{
						$timeout(function(){
							$ionicLoading.hide();
								scope.fileread = loadEvent.target.result;
						},300);
					}catch(err){
						//alert(err.message);
					}
				}
				if(changeEvent.target.files[0]){
					reader.readAsDataURL(changeEvent.target.files[0]);
				}
				$timeout(function(){
					$ionicLoading.hide();
				},300)
			});
		}
	}
}) 
// TODO: --|-------- run-app-sms
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppSms", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var phoneNumber = $attrs.phone || "08123456789";
				var textMessage = window.encodeURIComponent($attrs.message) || "Hello";
				var urlSchema = "sms:" + phoneNumber + "?body=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-call
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppCall", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var phoneNumber = $attrs.phone || "08123456789";
				var urlSchema = "tel:" + phoneNumber ;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-email
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppEmail", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var EmailAddr = $attrs.email || "info@ihsana.com";
				var textSubject = $attrs.subject || "";
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "mailto:" + EmailAddr + "?subject=" + textSubject + "&body=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-whatsapp
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppWhatsapp", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "whatsapp://send?text=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-line
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppLine", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "line://msg/text/" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-twitter
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppTwitter", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var textMessage = window.encodeURIComponent($attrs.message) || "";
				var urlSchema = "twitter://post?message=" + textMessage;
				window.open(urlSchema,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-open-url
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runOpenURL", function(){
	/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var $href = $attrs.href || "http://ihsana.com/";
				window.open($href,"_system","location=yes");
			};
		}
	};
})
// TODO: --|-------- run-app-browser
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runAppBrowser", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var $href = $attrs.href || "http://ihsana.com/";
				window.open($href,"_blank","closebuttoncaption=Done");
			};
		}
	};
})
// TODO: --|-------- run-webview
/** required: cordova-plugin-whitelist, cordova-plugin-inappbrowser **/
.directive("runWebview", function(){
	return {
			controller: function($scope, $element, $attrs){
			$element.bind("click", runApp);
			function runApp(event)
			{
				var $href = $attrs.href || "http://ihsana.com/";
				window.open($href,"_self");
			};
		}
	};
})
				
