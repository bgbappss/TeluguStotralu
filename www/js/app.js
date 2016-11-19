angular.module("telugu_stotralu", ["ngCordova","ionic","ionMdInput","ionic-material","ionic.rating","utf8-base64","angular-md5","telugu_stotralu.controllers", "telugu_stotralu.services"])
	.run(function($ionicPlatform,$window,$interval) {
		$ionicPlatform.ready(function() {
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			localforage.config({
				driver : localforage.INDEXEDDB,
				name : "telugu_stotralu",
				storeName : "telugu_stotralu",
				description : "The offline datastore for Telugu Stotralu app"
			});



		});
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})





.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("telugu_stotralu",{
		url: "/telugu_stotralu",
			abstract: true,
			templateUrl: "templates/telugu_stotralu-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("telugu_stotralu.about_us", {
		url: "/about_us",
		views: {
			"telugu_stotralu-side_menus" : {
						templateUrl:"templates/telugu_stotralu-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("telugu_stotralu.dashboard", {
		url: "/dashboard",
		views: {
			"telugu_stotralu-side_menus" : {
						templateUrl:"templates/telugu_stotralu-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("telugu_stotralu.more_apps", {
		url: "/more_apps",
		views: {
			"telugu_stotralu-side_menus" : {
						templateUrl:"templates/telugu_stotralu-more_apps.html",
						controller: "more_appsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("telugu_stotralu.stotras", {
		url: "/stotras",
		cache:false,
		views: {
			"telugu_stotralu-side_menus" : {
						templateUrl:"templates/telugu_stotralu-stotras.html",
						controller: "stotrasCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("telugu_stotralu.stotraslist_singles", {
		url: "/stotraslist_singles/:id",
		cache:false,
		views: {
			"telugu_stotralu-side_menus" : {
						templateUrl:"templates/telugu_stotralu-stotraslist_singles.html",
						controller: "stotraslist_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("telugu_stotralu.stotrasposts", {
		url: "/stotrasposts/:categories",
		cache:false,
		views: {
			"telugu_stotralu-side_menus" : {
						templateUrl:"templates/telugu_stotralu-stotrasposts.html",
						controller: "stotraspostsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/telugu_stotralu/stotras");
});
