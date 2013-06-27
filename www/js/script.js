var baseUrl = 'http://acquaintdev.com/';


var userKey = '';
var userLang = 'en';
var userLangId = 2;

var use_hash = true;


// need to improve this for back button
var currentPage = 'myiacquaint';
var currentTab = 1;

var previousPage = 'myiacquaint';
var previousTab = 1;


var previous_arr = new Array();
var current_arr = new Array();
current_arr['func'] = 'showPage';
current_arr['f1'] 	= 'login';




function set_previous() {



	previous_arr['func'] = current_arr['func'];
	
	if (typeof(current_arr['f1']) !=='undefined') {
        previous_arr['f1'] = current_arr['f1'];
    } else {
	    delete previous_arr['f1'];
    }
    
	if (typeof(current_arr['f2']) !=='undefined') {
        previous_arr['f2'] = current_arr['f2'];
    } else {
	    delete previous_arr['f2'];
    }
    
	if (typeof(current_arr['f3']) !=='undefined') {
        previous_arr['f3'] = current_arr['f3'];
    } else {
	    delete previous_arr['f3'];
    }
    
	if (typeof(current_arr['f4']) !=='undefined') {
        previous_arr['f4'] = current_arr['f4'];
    } else {
	    delete previous_arr['f4'];
    }
	if (typeof(current_arr['page']) !=='undefined') {
        previous_arr['page'] = current_arr['page'];
    } else {
	    delete previous_arr['page'];
    }
	if (typeof(current_arr['tab']) !=='undefined') {
        previous_arr['tab'] = current_arr['tab'];
    } else {
	   	delete previous_arr['tab'];
    }
	
	
}



function set_current(func, f1, f2, f3, f4) {
	// 
	
	set_previous();
	
	if(func == 'showPage' && f1 == 'myiacquaint') {
		$(".back-button").hide();
	} else {
		$(".back-button").show();
	}
	
	current_arr['func'] = func;
	
	if (typeof(f1) !=='undefined') {
        current_arr['f1'] = f1;
    } else {
	    delete current_arr['f1'];
    }
    
	if (typeof(f2) !=='undefined') {
        current_arr['f2'] = f2;
    } else {
	    delete current_arr['f2'];
    }
    
	if (typeof(f3) !=='undefined') {
        current_arr['f3'] = f3;
    } else {
	    delete current_arr['f3'];
    }
    
    current_arr['page'] = currentPage;
    current_arr['tab'] = currentTab;

	window.location.hash = 'index.html?'+http_build_query(current_arr);
	
    

}
$(function(){


	$("#go_back").click(function(){
		var hash = location.hash;
		hash = hash.replace('#index.html?', '');
    	var arr = {};
    	parse_str(hash, arr);
    
    	previous_arr = arr;
    
    	go_previous();
	});
  
 
  
});




function go_previous() {
	showPage(previous_arr['page'],previous_arr['tab'], true);
	
	window[previous_arr['func']](previous_arr['f1'], previous_arr['f2'], previous_arr['f3']);
	
}


//setTimeout("location.reload(true);",20000);

//localStorage.clear();

/**
 * check_login function.
 * Check if the User is Logged in or not... 
 * @access public
 * @return void
 */
function check_login() {
	
	var user_key = localStorage.getItem('key');
	var user_lang = localStorage.getItem('lang');
	var user_lang_id = localStorage.getItem('lang_id');
	
	if(user_key && user_key.length > 5) {
		// console.log(user_key);
		userKey = user_key;
		userLangId = user_lang_id;
		userLang = 'en';
		if(userLangId==2) userLang='en'; else userLang='fr';
		
		return true;

	} else {
		return false;
	}
	
	
	
}
	
$(document).ready(function(){

	
	if(check_login()) {	
		showPage('myiacquaint');
        // get content for get started tour/explore
        getStaticContent();
	} else {	
    	showPage('login');
    }
    
    
    //	showPage('login');
    
    
    $('input[name=login]').click(function(){
    	var email = $('input[name=email]').val();
    	var password = $('input[name=password]').val();

    	$.ajax({
            type: 'POST',
            url: baseUrl+'api/user/login/',
            crossDomain: true,
            data: 'email='+email+'&password='+password,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
            success: function (data) {
            	
            	//// console.log(data);

                if(data.status==0){
                	$('.error').html(data.message);
                }else{
                	$('.error').html('');
                	userKey = data.key;
                	userLangId = data.lang_id;
                	if(userLangId==2) userLang='en'; else userLang='fr';
                	
                	localStorage.setItem('key', userKey);
                	localStorage.setItem('lang_id', userLangId);
                	localStorage.setItem('lang', userLang);
                	
                	showPage('myiacquaint');
                }

                // get content for get started tour/explore
                getStaticContent();
            },
            error: function(xhr, textStatus, errorThrown) {
            	
    			var response = JSON.parse(xhr.responseText);

                $('.error').html(response.error);
            }
        });
    	return false;
    });

	
	// stop all iframe videos when user goes to other tab
	$('a').click(function(){      
        $('iframe').attr('src', $('iframe').attr('src'));
    });



    $('.tab').hide();

	$('.content').each(function(){
		$(this).find('.tab:first').show();
		$(this).find('.tabs a:first').addClass('tabactive');
	});

	$(document).on('click','.tabs a, .viewall, .tablink',function(){
	    var val = $(this).attr('href').replace('#','');
	    $(this).parents('.content').find('.tab').hide();
	    $(this).parents('.content').find('.tabs a').removeClass('tabactive');
	    if(!$(this).hasClass('viewall') && !$(this).hasClass('tablink')) $(this).addClass('tabactive');

	    $(this).parents('.content').find('.'+val).show();

	    previousTab = currentTab;
	    currentTab = val;
	})

});

function getStaticContent(){
	// get some static content
	$.ajax({
        type: "GET",
        data: 'key='+userKey,
        url: baseUrl+'api/get_started/tour/',
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
        success: function (data) {
        
        	if(data.status == 0) {
	        	showPage('login');
        	} else{ 
        		// data.banners
        		// 0: {tour_banner_id:5, tour_banner_content:Content, tour_banner_title:Test title,…}
        		$('#myiacquaint .tab8').html(data.message);
        	}
        }
    });

    $.ajax({
        type: "GET",
        data: 'key='+userKey,
        url: baseUrl+'api/get_started/explore/',
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
        success: function (data) {
       		if(data.status == 0) {
	        	showPage('login');
        	} else{
        		$('#myiacquaint .tab9').html(data.content.content);
        	}
        }
    });


    $.ajax({
        type: "GET",
        url: baseUrl+'api/learn/learn_both/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
        success: function (data) {
        	if(data.status == 0) {
	        	showPage('login');
        	} else{
            	var byNeed='';
	        	for(i=0;i<data.by_need.length;i++){ 
	                byNeed += '<div class="byneedrow">'+
	                    '<div class="tekst1"><a href="#tab3" class="tablink" onClick="javascript:showModule('+data.by_need[i]['id']+');">'+data.by_need[i]['title_'+userLang]+'</a></div>'+
	                    '<a href="#tab3" class="bluebtn tablink" onClick="javascript:showModule('+data.by_need[i]['id']+');">Start</a>'+
	                '</div>';
	        	}
	
	            $('#learn .tab1').html(byNeed);
	
	            var byLife='';
	        	for(i=0;i<data.by_life.length;i++){ 
	                byLife += '<div class="byneedrow">'+
	                    '<div class="tekst1"><a href="#tab3" class="tablink" onClick="javascript:showModule('+data.by_life[i]['id']+');">'+data.by_life[i]['title_'+userLang]+'</a></div>'+
	                    '<a href="#tab3" class="bluebtn tablink" onClick="javascript:showModule('+data.by_life[i]['id']+');">Start</a>'+
	                '</div>';
	        	}
	
	            $('#learn .tab2').html(byLife);
	        }
			
        }
    });

	searchFaq();

}


function showPage(page,tab, skip){
	skip = typeof skip !== 'undefined' ? skip : false;


	//Set History
	if(!skip) {
		set_current('showPage', page, tab);
		previousPage = currentPage;	
	
		if(previousPage=='login') previousPage='myiacquaint';
		currentPage = page;
	}

	// temp
//	if(page=='login'){
//
//	}


	if(userKey=='' && page!='login'){
		showPage('login');
	}else if(userKey!='' && page=='login'){
		showPage('myiacquaint');
	}else{
		if(page=='login'){
			$('#wrap').hide();
			$('#footer').hide();
		}else{
			$('#wrap').show();
			$('#footer').show();
		}

		$('.onepage').hide();
		$('#'+page).show();

		if(page=='learn'){
			$('.bottombar li').removeClass('popout');
			$('.bottombar li a').removeClass('blue');
			$('.bottombar li a div').removeClass('white');
			$('.bottombar li a div').addClass('gray');

			$('.bottombar li:eq(0)').addClass('popout');
			$('.bottombar li:eq(0) a').addClass('blue');
			$('.bottombar li:eq(0) a div').removeClass('gray');			
			$('.bottombar li:eq(0) a div:eq(0)').addClass('white');
		}else if(page=='ask'){
			$('.bottombar li').removeClass('popout');
			$('.bottombar li a').removeClass('blue');
			$('.bottombar li a div').removeClass('white');
			$('.bottombar li a div').addClass('gray');

			$('.bottombar li:eq(1)').addClass('popout');
			$('.bottombar li:eq(1) a').addClass('blue');
			$('.bottombar li:eq(1) a div').removeClass('gray');			
			$('.bottombar li:eq(1) a div:eq(0)').addClass('white');
		}else if(page=='myiacquaint'){
			$('.bottombar li').removeClass('popout');
			$('.bottombar li a').removeClass('blue');
			$('.bottombar li a div').removeClass('white');
			$('.bottombar li a div').addClass('gray');

			$('.bottombar li:eq(2)').addClass('popout');
			$('.bottombar li:eq(2) a').addClass('blue');
			$('.bottombar li:eq(2) a div').removeClass('gray');			
			$('.bottombar li:eq(2) a div:eq(0)').addClass('white');

			$.ajax({
	            type: "GET",
	            url: baseUrl+'api/my_iacquaint/index/key/'+userKey,
	            statusCode: {
					401: function() {
						reset_keys();
					}
				},
	            success: function (data) {
	            
	            	if(data.status == 0) {
			        	showPage('login');
		        	} else{
		            	//// console.log(data);
		            	var progressPercent = 100 * data.points / 1000;
		            	$( "#progressbar" ).progressbar({
					        value: progressPercent
					    });
	
		            	$('.num_of_points').html(data.points);
		            	$('.user_name').html(data.name);
	
		            	$('.expertise').html(data.points_until_next_level);

		            	if(data.image != ''){
		        			var userImage = baseUrl+'uploads/members/'+data.image;
		        		}else{
		        			var userImage = 'img/user.png';
		        		}

		        		$('#myiacquaint .userimage img').attr('src', userImage);
	
		            	$('.num_of_plans').html(data.custom_plans.length + data.started_plans.length);
		            	$('.num_of_favorites').html(data.favorites.length);
		            	$('.num_of_my_mobile').html(data.my_mobile.length);
		            	$('.num_of_questions').html(data.asked_questions.length);
	
	            		if(data.level_badges[0].image_status=='image_off'){
	            			$('#myiacquaint .singleslideimg:eq(0)').removeClass('beginnernolock').addClass('beginner');
	            		}else{
	            			$('#myiacquaint .singleslideimg:eq(0)').removeClass('beginner').addClass('beginnernolock');
	            		}
	
	            		if(data.level_badges[1].image_status=='image_off'){
	            			$('#myiacquaint .singleslideimg:eq(1)').removeClass('enthusiastnolock').addClass('enthusiast');
	            		}else{
	            			$('#myiacquaint .singleslideimg:eq(1)').removeClass('enthusiast').addClass('enthusiastnolock');
	            		}
	
	            		if(data.level_badges[2].image_status=='image_off'){
	            			$('#myiacquaint .singleslideimg:eq(2)').removeClass('expertnolock').addClass('expert');
	            		}else{
	            			$('#myiacquaint .singleslideimg:eq(2)').removeClass('expert').addClass('expertnolock');
	            		}
	
	            		if(data.level_badges[3].image_status=='image_off'){
	            			$('#myiacquaint .singleslideimg:eq(3)').removeClass('masternolock').addClass('master');
	            		}else{
	            			$('#myiacquaint .singleslideimg:eq(3)').removeClass('master').addClass('masternolock');
	            		}
	
	
		            	// VIEW ALL
		            	var myPlans='';
		            	for(i=0;i<data.custom_plans.length;i++){ 
		            		myPlans +='<div class="byneedrow">'+
		                        '<div class="tekst1">'+
		                            '<a href="javascript:void(0);" onClick="showMy(\'plans\',\'custom\','+data.custom_plans[i].id+');">'+
		                                '<img src="img/rightarrow.png" alt=""> '+formatDate(data.custom_plans[i].add_date)+' - <span class="bold">'+data.custom_plans[i].title+'</span>'+
		                            '</a>'+
		                        '</div>'+
		                        '<a href="javascript:void(0);" onClick="deleteMy(\'plans\',\'custom\','+data.custom_plans[i].id+',this);" class="bluebtn">Delete X</a>'+
		                    '</div>';
	                	}
	                	for(i=0;i<data.started_plans.length;i++){ 
		            		myPlans +='<div class="byneedrow">'+
		                        '<div class="tekst1">'+
		                            '<a href="javascript:void(0);" onClick="showMy(\'plans\',\'started\','+data.started_plans[i].module_id+');">'+
		                                '<img src="img/rightarrow.png" alt=""> '+formatDate(data.started_plans[i].add_date)+' - <span class="bold">'+data.started_plans[i].title+'</span>'+
		                            '</a>'+
		                        '</div>'+
		                        '<a href="javascript:void(0);" onClick="deleteMy(\'plans\',\'started\','+data.started_plans[i].id+',this);" class="bluebtn">Delete X</a>'+
		                    '</div>';
	                	}
	
	                	var myFavorites='';
	
	                	var fav  = $.map(data.favorites, function(k, v) {
						    return [k];
						});
	
	                	for(i=0;i<data.favorites.length;i++){ 
		            		myFavorites +='<div class="byneedrow">'+
		                        '<div class="tekst1">'+
		                            '<a href="#tab7" onClick="showMy(\'favorites\',\''+data.favorites[i].type+'\',\''+data.favorites[i].id+'\');">'+
		                                '<img src="img/rightarrow.png" alt=""> <span class="bold">'+data.favorites[i].title+'</span>'+
		                            '</a>'+
		                        '</div>'+
		                        '<a href="javascript:void(0);" onClick="deleteMy(\'favorites\',\''+data.favorites[i].type+'\','+data.favorites[i].url_key+',this);" class="bluebtn">Delete X</a>'+
		                    '</div>';
	                	}
	
	                	var myMobile='';
	                	for(i=0;i<data.my_mobile.length;i++){ 
		            		myMobile +='<div class="byneedrow">'+
		                        '<div class="tekst1">'+
		                            '<a href="#tab7" onClick="showMy(\'mobile\',\'mobile\',\''+data.my_mobile[i].id+'\');">'+
		                                '<img src="img/rightarrow.png" alt=""> '+formatDate(data.my_mobile[i].add_date)+' - <span class="bold">'+data.my_mobile[i].title+'</span>'+
		                            '</a>'+
		                        '</div>'+
		                        '<a href="javascript:void(0);" onClick="deleteMy(\'mobile\',\'mobile\','+data.my_mobile[i].id+',this);" class="bluebtn">Delete X</a>'+
		                    '</div>';
	                	}
	
	                	var myQuestions='';
	                	for(i=0;i<data.asked_questions.length;i++){ 
		            		myQuestions +='<div class="byneedrow">'+
		                        '<div class="tekst1">'+
		                            '<a href="#tab7" onClick="showMy(\'questions\',\'questions\',\''+data.asked_questions[i].id+'\');">'+
		                                '<img src="img/rightarrow.png" alt=""> '+formatDate(data.favorites[i].add_date)+' - <span class="bold">'+data.asked_questions[i].title+'</span>'+
		                            '</a>'+
		                        '</div>'+
		                    '</div>';
	                	}
	
	                    $('#myiacquaint .tab3').html(myPlans);
	                    $('#myiacquaint .tab4').html(myFavorites);
	                    $('#myiacquaint .tab5').html(myMobile);
	                    $('#myiacquaint .tab6').html(myQuestions);
                    }
	            }
	        });

		}else if(page=='browse'){
			$('.bottombar li').removeClass('popout');
			$('.bottombar li a').removeClass('blue');
			$('.bottombar li a div').removeClass('white');
			$('.bottombar li a div').addClass('gray');

			$('.bottombar li:eq(3)').addClass('popout');
			$('.bottombar li:eq(3) a').addClass('blue');
			$('.bottombar li:eq(3) a div').removeClass('gray');			
			$('.bottombar li:eq(3) a div:eq(0)').addClass('white');

			$.ajax({
	            type: "GET",
	            url: baseUrl+'api/browse/index/key/'+userKey,
	            statusCode: {
					401: function() {
						reset_keys();
					}
				},
	            success: function (data) {
	            	// data.categories	category_name
	            	// data.types
	            	
	            	
	            	if(data.status == 0) {
			        	showPage('login');
		        	} else{

	                    var byTopic='';
	                	for(i=0;i<data.categories.length;i++){ 
		            		byTopic +='<div class="bytype">'+
		                        '<div class="tekst"><a href="#tab3" class="tablink" onClick="javascript:tools(\''+data.categories[i]['url_key']+'\',\'all\',\'topic\');">'+data.categories[i]['category_name']+'</a></div>'+
		                    '</div>';
	                	}
	
	                    $('#browse .tab1').html(byTopic);
	
	
	                    var byType='';
	                	for(i=0;i<data.types.length;i++){ 
		            		byType +='<div class="bytype">'+
		                        '<div class="tekst"><a href="#tab4" class="tablink" onClick="javascript:tools(\'all\',\''+data.types[i]['url_key']+'\',\'type\');">'+data.types[i]['title']+'</a></div>'+
		                    '</div>';
	                	}
	
	                    $('#browse .tab2').html(byType);
	                }
	            }
	        });

		}else if(page=='watch'){
			$('.bottombar li').removeClass('popout');
			$('.bottombar li a').removeClass('blue');
			$('.bottombar li a div').removeClass('white');
			$('.bottombar li a div').addClass('gray');

			$('.bottombar li:eq(4)').addClass('popout');
			$('.bottombar li:eq(4) a').addClass('blue');
			$('.bottombar li:eq(4) a div').removeClass('gray');			
			$('.bottombar li:eq(4) a div:eq(0)').addClass('white');

			$.ajax({
	            type: "GET",
	            url: baseUrl+'api/watch/watch_videos/key/'+userKey,
	            statusCode: {
					401: function() {
						reset_keys();
					}
				},
	            success: function (data) {
	            	
	            	if(data.status == 0) {
			        	showPage('login');
		        	} else{
		        	
		            	// data.video_categories.animated
		            	// data.video_categories_new
		            	// data.current_video
		            	if(userLangId==2) var videoUrl = data.animated[0][0]['video_code']; else var videoUrl = data.animated[0][0]['video_code_fr'];
		            	
		            	// console.log(videoUrl);
		            	var vidly_video = vidly_url(videoUrl);
		            	
		            	// console.log(vidly_video);
		            	
		            	$('.vidly_wrapper').html(vidly_video);


	
	                    var videos='';  
	                	for(i=0;i<data.animated.length;i++){ 
	                		videos +='<div class="video_categories">'+
		                				'<div class="middletext">'+data.animated[i][0].category_name+'</div>'+
		                				'<div class="slider">'+
		                                            '<ul class="clearfix">';
	
		                						for(e=0;e<data.animated[i].length;e++){       
		                						if(userLangId==2) var videoUrl = data.animated[i][e]['video_code']; else var videoUrl = data.animated[i][e]['video_code_fr'];
			            						videos +='<li onClick="showVideo(\''+parse_vidly_id(videoUrl)+'\')">'+
		                                                        '<div class="video_img_container shadow2 br2"><img src="'+vidly_img(videoUrl)+'"/></div>'+
		                                                        '<div class="video_title">'+data.animated[i][e]['title']+'</div>'+
		                                                       // '<div class="video_desc">'+data.animated[i][e]['description']+'</div>'+
		                                                  '</li>';                                            
		                        				}
	
		                        		videos +='</ul>'+
		                                '</div>'+
	                                '</div>';
	                	}
	
	                    $('#watch .tab1').html(videos);
	
	                    var videos='';  
	                	for(i=0;i<data.video.length;i++){ 
	                		videos +='<div class="video_categories">'+
		                				'<div class="middletext">'+data.video[i][0].category_name+'</div>'+
		                                        '<div class="slider">'+
		                                            '<ul class="clearfix">';
	
		                						for(e=0;e<data.video[i].length;e++){       
		                						if(userLangId==2) var videoUrl = data.video[i][e]['video_code']; else var videoUrl = data.video[i][e]['video_code_fr'];
			            						videos +='<li onClick="showVideo(\''+parse_vidly_id(videoUrl)+'\')">'+
		                                                        '<div class="video_img_container shadow2 br2"><img src="'+vidly_img(videoUrl)+'"/></div>'+
		                                                        '<div class="video_title">'+data.video[i][e]['title']+'</div>'+
		                                                        //'<div class="video_desc">'+data.video[i][e]['description']+'</div>'+
		                                                '</li>';                                            
		                        				}
	
		                        		videos +='</ul>'+
		                                '</div>'
		                            '</div>';
	                	}
	
	                    $('#watch .tab2').html(videos);
	
	
	                    var videos='';  
	                	for(i=0;i<data.podcasts.length;i++){ 
	                		videos +='<div class="video_categories">'+
		                				'<div class="middletext">'+data.podcasts[i][0].category_name+'</div>'+
		                                        '<div class="slider">'+
		                                            '<ul class="clearfix">';
	
		                						for(e=0;e<data.podcasts[i].length;e++){    
		                						if(userLangId==2) var videoUrl = data.podcasts[i][e]['video_file_en']; else var videoUrl = data.podcasts[i][e]['video_file_fr'];
			            						videos +='<li onClick="showVideo(\''+videoUrl+'\', \'podcasts\')">'+
		                                                        '<div class="video_img_container shadow2"><img src="img/podcast_image.png"/></div>'+
		                                                        '<div class="video_title">'+data.podcasts[i][e]['title']+'</div>'+
		                                                        //'<div class="video_desc">'+data.podcasts[i][e]['description']+'</div>'+
		                                                '</li>';                                            
		                        				}
	
		                        		videos +='</ul>'+
		                                    '</div>'+
		                            '</div>';
	                	}
	
	                    $('#watch .tab3').html(videos);
	
	

				    }

	            }
	        });
		}else if(page=='watch_old-NOTUSED'){
			$('.bottombar li').removeClass('popout');
			$('.bottombar li a').removeClass('blue');
			$('.bottombar li a div').removeClass('white');
			$('.bottombar li a div').addClass('gray');

			$('.bottombar li:eq(4)').addClass('popout');
			$('.bottombar li:eq(4) a').addClass('blue');
			$('.bottombar li:eq(4) a div').removeClass('gray');			
			$('.bottombar li:eq(4) a div:eq(0)').addClass('white');

			$.ajax({
	            type: "GET",
	            url: baseUrl+'api/watch/watch_videos/key/'+userKey,
	            statusCode: {
					401: function() {
						reset_keys();
					}
				},
	            success: function (data) {
	            	
	            	if(data.status == 0) {
			        	showPage('login');
		        	} else{
		        	
		            	// data.video_categories.animated
		            	// data.video_categories_new
		            	// data.current_video
	
						if(userLangId==2){
							$('.vidly_wrapper').html(data.animated[0][0]['video_code']);
							// console.log(data.animated[0][0]);
						}else{
							$('.vidly_wrapper').html(data.animated[0][0]['video_code_fr']);
						}
	
	
	                    var videos='';  
	                	for(i=0;i<data.animated.length;i++){ 
	                		videos +='<div class="video_categories">'+
		                				'<div class="middletext">'+data.animated[i][0].category_name+'</div>'+
		                				'<div class="wrap">'+
		                                   	'<div class="slideraround">'+
		                                        '<div class="scrollbar">'+
		                                            '<div class="handle">'+
		                                                '<div class="mousearea"></div>'+
		                                            '</div>'+
		                                        '</div>'+
		                                        '<button class="btn prev dugmeposle"><img src="img/video_left.png"></button>'+
		                                        '<div class="frame slider">'+
		                                            '<ul class="clearfix">';
	
		                						for(e=0;e<data.animated[i].length;e++){       
		                						if(userLangId==2) var videoUrl = data.animated[i][e]['video_code']; else var videoUrl = data.animated[i][e]['video_code_fr'];
			            						videos +='<li>'+
		                                                    '<div class="videosmall" onClick="showVideo(\''+escapeHtml(videoUrl)+'\')"  ontouch="showVideo(\''+escapeHtml(videoUrl)+'\')">'+
		                                                        '<div class="videocover">'+data.animated[i][e]['title']+'</div>'+
		                                                        '<img src="img/videoimage.png" />'+
		                                                    '</div>'+
		                                                '</li>';                                            
		                        				}
	
		                        		videos +='</ul>'+
		                                        '</div>'+
		                                        '<button class="btn next dugmepre" ><img src="img/video_right.png"></button>'+
		                                    '</div>'+
		                                '</div>'+
	                                '</div>';
	                	}
	
	                    $('#watch .tab1').html(videos);
	
	                    var videos='';  
	                	for(i=0;i<data.video.length;i++){ 
	                		videos +='<div class="video_categories">'+
		                				'<div class="middletext">'+data.video[i][0].category_name+'</div>'+
		                				'<div class="wrap">'+
		                                   	'<div class="slideraround">'+
		                                       '<div class="scrollbar">'+
		                                            '<div class="handle">'+
		                                                '<div class="mousearea"></div>'+
		                                            '</div>'+
		                                        '</div>'+
		                                        '<button class="btn prev dugmeposle" ><img src="img/video_left.png"></button>'+
		                                        '<div class="frame slider">'+
		                                            '<ul class="clearfix">';
	
		                						for(e=0;e<data.video[i].length;e++){       
		                						if(userLangId==2) var videoUrl = data.video[i][e]['video_code']; else var videoUrl = data.video[i][e]['video_code_fr'];
			            						videos +='<li onClick="showVideo(\''+parse_vidly_id(videoUrl)+'\')">'+
		                                                    '<div class="videosmall">'+
		                                                        '<div class="videocover">'+data.video[i][e]['title']+'</div>'+
		                                                        '<img src="img/videoimage.png" />'+
		                                                    '</div>'+
		                                                '</li>';                                            
		                        				}
	
		                        		videos +='</ul>'+
		                                        '</div>'+
		                                        '<button class="btn next dugmepre" ><img src="img/video_right.png"></button>'+
		                                    '</div>'+
		                                '</div>'
		                            '</div>';
	                	}
	
	                    $('#watch .tab2').html(videos);
	
	
	                    var videos='';  
	                	for(i=0;i<data.podcasts.length;i++){ 
	                		videos +='<div class="video_categories">'+
		                				'<div class="middletext">'+data.podcasts[i][0].category_name+'</div>'+
		                				'<div class="wrap">'+
		                                   	'<div class="slideraround">'+
		                                        '<div class="scrollbar">'+
		                                            '<div class="handle">'+
		                                                '<div class="mousearea"></div>'+
		                                            '</div>'+
		                                        '</div>'+
		                                        '<button class="btn prev dugmeposle" ><img src="img/video_left.png"></button>'+
		                                        '<div class="frame slider">'+
		                                            '<ul class="clearfix">';
	
		                						for(e=0;e<data.podcasts[i].length;e++){    
		                						if(userLangId==2) var videoUrl = data.podcasts[i][e]['video_file_en']; else var videoUrl = data.podcasts[i][e]['video_file_fr'];
			            						videos +='<li onClick="showVideo(\''+videoUrl+'\', \'podcasts\')">'+
		                                                    '<div class="videosmall">'+
		                                                        '<div class="videocover">'+data.podcasts[i][e]['title']+'</div>'+
		                                                        '<img src="img/videoimage.png" />'+
		                                                    '</div>'+
		                                                '</li>';                                            
		                        				}
	
		                        		videos +='</ul>'+
		                                        '</div>'+
		                                        '<button class="btn next dugmepre" ><img src="img/video_right.png"></button>'+
		                                    '</div>'+
		                                '</div>'
		                            '</div>';
	                	}
	
	                    $('#watch .tab3').html(videos);
	
	
	                    $('.slider').each(function(){
		                    var $frame = $(this);
					        var $wrap  = $frame.parent();
	
					        // Call Sly on frame
					        $frame.sly({
					            horizontal: 1,
					            itemNav: 'centered',
					            smart: 1,
					            activateOn: 'click',
					            mouseDragging: 1,
					            touchDragging: 1,
					            releaseSwing: 1,
					            startAt: 0,
					            scrollBar: $wrap.find('.scrollbar'),
					            scrollBy: 1,
					            speed: 300,
					            elasticBounds: 1,
					            easing: 'easeOutExpo',
					            dragHandle: 1,
					            dynamicHandle: 1,
					            clickBar: 1,
	
					            // Buttons
					            prev: $wrap.find('.prev'),
					            next: $wrap.find('.next')
					    
		
		
					        });
					    });

				    }

	            }
	        });
		}
	}

	if(!tab) tab='tab1';

	$('.tab').hide();
	$('#'+page+' .'+tab).show();
	
	
	

	previousTab = currentTab;
    currentTab = tab;
	
}


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;") 
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/_/g, "&#95;")   
         .replace(/'/g, "\\'");
 }


function showVideo(video, type){

	//Set history
	set_current('showVideo', video, type);

	if(type=='podcasts'){
		$('#watch .vidly_wrapper').html('');

		$('#watch .vidly_wrapper').hide();
		$('#watch .jplayer_wrapper').show();

		//$('#watch .vidly_wrapper').html('<audio controls><source src="'+baseUrl+'uploads/tools/files/'+video+'">Your browser does not support the audio element.</audio>');
	 	
	 	
	 	var	ret = '<div class="vidly_box podcast">';
		ret += '<a href="'+baseUrl+'uploads/tools/files/'+video+'">';
		ret += '<img src="img/empty.gif" class="vidly_video_play"/>';
		ret += '<img src="img/podcast.png" class="vidly_video"/>';
		ret += '</a></div>';
		$('#watch .vidly_wrapper').html(ret);
		window.scrollTo(0, 0);
	}else{
		$('#watch .jplayer_wrapper').html('');

		$('#watch .jplayer_wrapper').hide();
		$('#watch .vidly_wrapper').show();
			var new_vid = vidly_id(video, 'main_video');
		if(userLangId==2){
		
			$('#watch .vidly_wrapper').html(new_vid);
		}else{
			$('#watch .vidly_wrapper').html(new_vid);
		}

		window.scrollTo(0, 0);
	}
}

var active_key = 0;
var last_key = 0;

function showModule(id,type){
	
	
	//Set History
	set_current('showModule', id, type);
	
	if(type=='custom'){
		var url = baseUrl+'api/learn/custom_learning_plan/id/'+id+'/key/'+userKey;
	}else{
		var url = baseUrl+'api/learn/show_entire_learning_plan/id/'+id+'/key/'+userKey;
	}

	$.ajax({
        type: "GET",
        url: url,
        statusCode: {
				401: function() {
					reset_keys();
				}
			},
        success: function (data) {
        	
	        if(data.status == 0) {
	        	showPage('login');
	        } else{
			        	
	        	last_key = data.tools.length-1;
	        	active_key = data.current_key;
	
	        	var videoNum = 1;
	        	var videoFiles = [];
	
	        	var tools='';
	
	
	        	for(i=0;i<data.tools.length;i++){
	        		tools += '<div class="resource '+i+'" style="display:none;">'+
	        			'<div class="resource_title">'+data.tools[i]['title']+'</div>'+
	                    '<div class="resource_content">';
	                    
	                    if(data.tools[i]['type']=='calculator'){
	                    	if(data.tools[i]['calculator_type']=='internal'){
	                    		var file = data.tools[i]['filename_en'].substring(0, data.tools[i]['filename_en'].length - 4);
	                    		tools += '<iframe width="310px" height="100%" src="'+baseUrl+userLang+'/learn/calc_api/'+file+'"></iframe>';
	                    	}else{
	                    		tools += '<strong><a href="'+data.tools[i]['link_'+userLang]+'" title="link">Click here for more info</a></strong>';
	                    	}
	                    }else if(data.tools[i]['type']=='video'){
	                    	if(data.tools[i]['video_category']=='podcasts'){
	                    	
		                    	videoNum++;
		                    	videoFiles.push(data.tools[i]['video_file_'+userLang]);
	
		                    	tools += '<iframe width="310px" height="300px" src="'+baseUrl+'en/learn/jplayer_api/'+data.tools[i]['video_file_'+userLang]+'"></iframe>';
	
	
	                    	}else{
	                    		if(userLangId==2){
									tools += data.tools[i]['video_code'];
								}else{
									tools += data.tools[i]['video_code_fr'];
								}                    		
	                    	}
	                    }else if(data.tools[i]['type']=='link'){
	                    	tools += '<strong><a href="'+data.tools[i]['link_'+userLang]+'" title="link">Click here for more info</a></strong>';
	                    }else if(data.tools[i]['type']=='file'){
							tools += '<a href="'+baseUrl+'uploads/tools/files/'+data.tools[i]['filename_'+userLang]+'">Download file to read more</a>';
	                    }else{
	                    	tools += data.tools[i]['description'];
	                    }
	
	                tools += '</div>'+
	        		'</div>';
	        	}
	        	tools += '<div class="arrows"><a href="javascript:void(0);" class="prev_tool" onClick="changeModuleResource(active_key-1,last_key);"></a> <a href="javascript:void(0);" class="next_tool" onClick="changeModuleResource(active_key+1,last_key);"></a></div>';
	
	            $('#learn .tab3').html(tools);
	
	            changeModuleResource(active_key, last_key);
	        }
        }
    });

}	

function changeModuleResource(key,last){
	
	
	//Set History
	set_current('changeModuleResource', key, last);
	

	active_key = key;
	$('#learn .tab3 .prev_tool').show();
	$('#learn .tab3 .next_tool').show();

	if(key==0){
		$('#learn .tab3 .prev_tool').hide();
	}
	if(key == last){
		$('#learn .tab3 .next_tool').hide();
	}

	$('#learn .tab').hide();
	$('#learn .tab3').show();

    $('#learn .tab3 .resource').hide();
    $('#learn .tab3 .'+key).show();
}


function browse(type,value){

	
	
	if(!value) var value = 'all';
	
	//Set History
	set_current('browse', type, value);

	if(type=='byTopic'){
		$.ajax({
	        type: "GET",
	        url: baseUrl+'api/browse/index/type/by_topic/value/'+value+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
	        success: function(data){
	        	
	            if(data.status == 0) {
			       	showPage('login');
		       	} else{
			        	
		            var list='';
		            // data.results.total_rows
		        	for(i=0;i<data.results.tools.length;i++){ 
		        		list +='<div class="bytype">'+
		                    '<div class="tekst"><a href="#tab3" onClick="javascript:tools(\''+data.results[i]['url_key']+'\',\'all\',\'topic\');">'+data.results[i]['title']+'</a></div>'+
		                    '<a href="learn.html" class="starbtn"><img src="img/starbtn.png" alt=""></a>'+
		                '</div>';
		        	}
	
		            $('#browse .tab3').html(list);
	            }
	        }
	    });    
	}else if(type=='byType'){
		$.ajax({
	        type: "GET",
	        url: baseUrl+'api/browse/index/type/by_type/value/'+value+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
	        success: function(data){
	        	
	            if(data.status == 0) {
			       	showPage('login');
		       	} else{
			        
		            var list='';
		            // data.results.total_rows
		        	for(i=0;i<10;i++){ 
		        		list +='<div class="bytype">'+
		                    '<div class="tekst"><a href="#tab4" onClick="javascript:tools(\''+data.results[i]['url_key']+'\',\'all\',\'type\');">'+data.results[i]['title']+'</a></div>'+
		                    '<a href="learn.html" class="starbtn"><img src="img/starbtn.png" alt=""></a>'+
		                '</div>';
		        	}
	
		            $('#browse .tab4').html(list);
	            }
	        }
	    });
	}else if(type=='feelingLucky'){
		$('#browse .tab5 .resource_title').html('');
    	$('#browse .tab5 .resource_content').html('');

		$.ajax({
	        type: "GET",
	        url: baseUrl+'api/browse/index/type/feeling_lucky/value/'+value+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
	        success: function(data){	            
	        	
	            if(data.status == 0) {
			       	showPage('login');
		       	} else{
				        
		            $('#browse .tab5 .resource_title').html(data.results.title);
	        		$('#browse .tab5 .resource_content').html(toolDescription(data.results));
	
		        	$('.tab').hide();
		        	$('#browse .tab5').show();
		        }   
	        }
	    });
	}

}


var topicOffset=0;
var typeOffset=0;
function tools(cat,type,by,offset){


	
	if(!cat) var cat = 'all';
	if(!type) var type = 'all';
	if(!offset) var offset = 0;
	
	
	//Set History
	set_current('tools', cat, type, by, offset);

	if(offset==0){
		$('#browse .tab3 .tools_content').html('');
		$('#browse .tab4 .tools_content').html('');
		$('#browse .tab3 .more').show();
		$('#browse .tab4 .more').show();
	}

	$.ajax({
        type: "GET",
        url: baseUrl+'api/browse/tools/cat/'+cat+'/type/'+type+'/offset/'+offset+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
        success: function(data){
        	
	        if(data.status == 0) {
			       	showPage('login');
		       	} else{
			        
		            var list='';
		            // data.results.total_rows
		           // // console.log(data.results.tools.length);
		
		        	for(i=0;i<data.results.tools.length;i++){ 
		        		if(data.results.tools[i]['favorite']=='no'){
		        			var favClass = 'starplus';
		        			var status = 'add';
		        		}else{
		        			var favClass = 'starminus';
		        			var status = 'remove';
		        		}
		
		        		list +='<div class="bytype">'+
		                    '<div class="tekst"><a href="javascript:void(0);" onClick="javascript:viewTool('+data.results.tools[i]['id']+');">'+data.results.tools[i]['title']+'</a></div>'+
		                    '<div class="starbtn '+favClass+'" onClick="javascript:updateFavorite(\''+data.results.tools[i]['url_key']+'\', \''+status+'\', this);"><a href="javascript:void(0);"></a></div>'+
		                '</div>';
		        	}
		
		        	if(by=='topic'){
		            	$('#browse .tab3 .tools_content').append(list);
		
		        		topicOffset = topicOffset + 10;
		            	$('#browse .tab3 .more').attr('onClick','javascript:tools(\''+cat+'\',\''+type+'\',\''+by+'\','+topicOffset+')');
		
		            	if(topicOffset>data.total) $('#browse .tab3 .more').hide();
		        	}else if(by=='type'){
		            	$('#browse .tab4 .tools_content').append(list);
		
		        		typeOffset = typeOffset + 10;
		            	$('#browse .tab4 .more').attr('onClick','javascript:tools(\''+cat+'\',\''+type+'\',\''+by+'\','+typeOffset+')');
		
		            	if(typeOffset>data.total) $('#browse .tab4 .more').hide();
		        	}
        	
        	}
        }
    });    	

}


function updateFavorite(url_key, status, this_button){

	
	if(status=='add') var url = 'add_to_favorites'; else var url = 'remove_from_favorites';
	
	
	//Set History
	set_current('updateFavorite', url_key, status, this_button);
	
	
	$.ajax({
        type: "GET",
        url: baseUrl+'api/browse/'+url+'/url_key/'+url_key+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
        success: function(data){
        
	        if(data.status == 0) {
		       	showPage('login');
		  	} else{
				        
				        
	        	if(status=='add'){
	        		var new_status = 'remove';
	        		$(this_button).removeClass('starplus').addClass('starminus');
	        	}else{
	        		var new_status = 'add';
	        		$(this_button).removeClass('starminus').addClass('starplus');
	        	}
	       		$(this_button).attr('onClick','javascript:updateFavorite(\''+url_key+'\',\''+new_status+'\',this)');
	       }
        }
    });  
}


function viewTool(id){

	
	//Set History
	set_current('viewTool', id);
	
	$('#browse .tab6 .resource_title').html('');
    $('#browse .tab6 .resource_content').html('');

	$.ajax({
        type: "GET",
        url: baseUrl+'api/browse/view_tool/id/'+id+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
        success: function(data){

		    if(data.status == 0) {
		       	showPage('login');
		    } else{
					      
	        	$('.tab').hide();
	        	$('#browse .tab6').show(); 
	
	            $('#browse .tab6 .resource_title').html(data.title);
	        	$('#browse .tab6 .resource_content').html(toolDescription(data));
	        
	        }
        }
    });  
}

function toolDescription(tool){
	
	var desc = '';

	if(tool['type']=='calculator'){
    	if(tool['calculator_type']=='internal'){
    		var file = tool['filename_en'].substring(0, tool['filename_en'].length - 4);
    		desc += '<iframe width="310px"  height="100%" src="'+baseUrl+userLang+'/learn/calc_api/'+file+'"></iframe>';
    	}else{
    		desc += '<strong><a href="'+tool['link_'+userLang]+'" title="link">Click here for more info</a></strong>';
    	}
    }else if(tool['type']=='video'){
    	if(tool['video_category']=='podcasts'){    	
    		
            desc += '<iframe width="100%" height="300px" src="'+baseUrl+'en/learn/jplayer_api/'+tool['video_file_'+userLang]+'"></iframe>';
                    
    	}else{
    		if(userLangId==2){
				// desc += tool['video_code'];
				desc += vidly_url(tool['video_code'], 'tool_desc');
				
			}else{
				//desc += tool['video_code_fr'];
				desc += vidly_url(tool['video_code_fr'], 'tool_desc');
			}                    		
    	}
    }else if(tool['type']=='link'){
    	desc += '<strong><a href="'+tool['link_'+userLang]+'" title="link">Click here for more info</a></strong>';
    }else if(tool['type']=='file'){
		desc += '<a href="'+baseUrl+'uploads/tools/files/'+tool['filename_'+userLang]+'">Download file to read more</a>';
    }else{
    	desc += tool['description'];
    }

	return desc;
}


function showMy(cat,type,id){
	
	
	//Set History
	set_current('showMy', cat, type, id);
	
	
	$('#myiacquaint .resource_title').html('');
    $('#myiacquaint .resource_content').html('');

	if(cat=='plans'){

		if(type=='started'){
			showPage('learn');
			showModule(id);			
		}else if(type=='custom'){
			showPage('learn');
			showModule(id,'custom');
		}

	}else if(cat=='favorites'){

		$.ajax({
	        type: "GET",
	        url: baseUrl+'api/browse/view_tool/id/'+id+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
	        success: function (data) {
	        	
			    if(data.status == 0) {
			       	showPage('login');
			    } else{
		        	$('#myiacquaint .resource_title').html(data.title);
		        	$('#myiacquaint .resource_content').html(toolDescription(data));
	
		        	$('.tab').hide();
		        	$('#myiacquaint .tab7').show();
		        
		        }
	       	}
		});

	}else if(cat=='mobile'){

		$.ajax({
	        type: "GET",
	        url: baseUrl+'api/browse/view_tool/id/'+id+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
	        success: function (data) {
	        
			    if(data.status == 0) {
			       	showPage('login');
			    } else{
		        	$('#myiacquaint .resource_title').html(data.title);
		        	$('#myiacquaint .resource_content').html(toolDescription(data));
	
		        	$('.tab').hide();
		        	$('#myiacquaint .tab7').show();
		        }
	       	}
		});

	}

	
}


function deleteMy(cat,type,id,this_button){
	if(cat=='plans'){
		if(type=='started'){
			$.ajax({
	        	type: "GET",
		        url: baseUrl+'api/learn/delete_plan/id/'+id+'/type/assessments/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
		        success: function (data) {
		        
			        if(data.status == 0) {
				        showPage('login');
				    } else{
		        		$(this_button).parents('div:first').remove();
		        		updateNumOf(cat);
		        	}
		       	}
			});
		}else if(type=='custom'){
			$.ajax({
	        	type: "GET",
		        url: baseUrl+'api/learn/delete_plan/id/'+id+'/type/custom/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
		        success: function (data) {     	
				    if(data.status == 0) {
			       		showPage('login');
			       	} else{
			        	$(this_button).parents('div:first').remove();
			        	updateNumOf(cat);
			        }
		       	}
			});
		}
	}else if(cat=='favorites'){
		$.ajax({
        	type: "GET",
	        url: baseUrl+'api/my_iacquaint/remove_favorite/id/'+id+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
	        success: function (data) {
	        	
			    if(data.status == 0) {
			       	showPage('login');
			    } else{
	        		$(this_button).parents('div:first').remove();
	        		updateNumOf(cat);
	        	}
	       	}
		});
	}else if(cat=='mobile'){
		$.ajax({
        	type: "GET",
	        url: baseUrl+'api/my_iacquaint/remove_my_mobile/id/'+id+'/key/'+userKey,
            statusCode: {
				401: function() {
					reset_keys();
				}
			},
	        success: function (data) {
	        	if(data.status == 0) {
			       	showPage('login');
			    } else	{
	        		$(this_button).parents('div:first').remove();
	        		updateNumOf(cat);
	        	}
	       	}
		});
	}
}


// after deleting decrease count by one
function updateNumOf(cat){
	if(cat=='plans'){
		var num = $('.num_of_plans').html();
		if(num-1 > 0) $('.num_of_plans').html(num-1);
	}else if(cat=='favorites'){
		var num = $('.num_of_favorites').html();
		if(num-1 > 0) $('.num_of_favorites').html(num-1);
	}else if(cat=='mobile'){
		var num = $('.num_of_my_mobile').html();
		if(num-1 > 0) $('.num_of_my_mobile').html(num-1);
	}else if(cat=='questions'){
		var num = $('.num_of_questions').html();
		if(num-1 > 0) $('.num_of_questions').html(num-1);
	}
}


function formatDate(date){
	var t = date.split(/[- :]/);
	// Apply each element to the Date function
	var d = new Date(t[0], t[1]-1, t[2]);
	var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var date = curr_month+'/'+curr_date+'/'+curr_year;
    return date;
}

var search_results;

function searchFaq(){

	var search_term = $('#ask input[name=search_term]').val();

	$.ajax({
        type: "POST",
        data: 'search_term='+search_term,
        url: baseUrl+'api/ask/faq_search/key/'+userKey,
        statusCode: {
			401: function() {
				reset_keys();
			}
		},
        success: function (data) {
        	if(data.status == 0) {
			       	showPage('login');
			} else	{
	        //	// console.log(data);
	        //	data.total_rows
	        	search_results = data.result;
	
	            var text='';
	        	for(i=0;i<data.result.length;i++){ 

	        		if(data.result[i]['user_data'][0]!=undefined){
	        			var userImage = baseUrl+'uploads/members/'+data.result[i]['user_data'][0]['image'];
	        		}else{
	        			var userImage = 'img/smsimage.png';
	        		}

	        		text +='<div class="message">'+
	        					'<div class="messageimg"><img src="'+userImage+'" alt="sms" width="78"></div>'+
	                        	'<a href="javascript:void(0);" onClick="javascript:singleFaq('+i+')">'+
	                            	'<div class="bubble me messagetext">'+data.result[i]['question']+'</div>'+
	                        	'</a>'+
	                        '</div>';
	        	}

	            $('#ask .tab1').html(text);   
	
	            $('#ask .tab1').show();         
	            $('#ask .tab2').hide();
            }
        }
    });
}


function singleFaq(i){
	text = '<div class="message">'+
                '<div class="messageimg"><img src="img/smsimage.png" alt="sms" width="78"></div>'+
                '<div class="messagetext bubble me">'+search_results[i]['question']+'</div>'+
            '</div>'+
            '<div class="responsemessage">'+
                '<div class="responsetext bubble you">'+search_results[i]['response']+'</div>'+
                '<div class="responsemessageimg"><img src="img/APP-iacquaint-ask-open.png" alt="sms" width="43"></div>'+
            '</div>';

	$('#ask .tab2').html(text);

	$('#ask .tab2').show();         
    $('#ask .tab1').hide();
}


function parse_vidly_id(iframe_string) {
  
  var regex = /src=(["\'])(.*?)\1/g;
  var src = regex.exec(iframe_string);

  
  var regex2 = /link=(.*?)&/g;
  var id = regex2.exec(src);

  
  return id[1];
  
}


/**
 * vidly_url function.
 * Generate the actuall video with the regular class
 * @access public
 * @param mixed frame
 * @param mixed width
 * @param mixed height
 * @return void
 */

function vidly_url(frame, clas, width, height) {

	width = typeof width !== 'undefined' ? 'width="'+width+'"' : '';
	height = typeof height !== 'undefined' ? 'height="'+height+'"' : '';
	clas = typeof clas !== 'undefined' ? clas : '';
	   
	var id = parse_vidly_id(frame);
	
	return vidly_id(id, clas, width, height);
}

function vidly_id(id, clas, width, height) {

	width = typeof width !== 'undefined' ? 'width="'+width+'"' : '';
	height = typeof height !== 'undefined' ? 'height="'+height+'"' : '';
	clas = typeof clas !== 'undefined' ? clas : '';
	   	
	var ret = '';
	
	ret += '<div class="vidly_box '+clas+'">';
	ret += '<a href="http://cf.cdn.vid.ly/'+id+'/mp4.mp4">';
	ret += '<img src="img/empty.gif" class="vidly_video_play"/>';
	ret += '<img src="http://cf.cdn.vid.ly/'+id+'/poster.jpg" class="vidly_video" '+width+' '+height+' />';
	ret += '</a></div>';
	
	
	return ret;
}


function vidly_img(frame) {

	var id = parse_vidly_id(frame);
	return 'http://cf.cdn.vid.ly/'+id+'/poster.jpg';
}



function reset_keys() {
	
			//Clear the Key
			localStorage.clear();
			userKey = '';
			showPage('login');
}